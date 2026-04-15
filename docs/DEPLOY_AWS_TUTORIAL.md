# Tutorial: Deploy Hunting Backend en AWS (EC2 + RDS + CI/CD)

Guía paso a paso para desplegar este backend NestJS en AWS usando free tier.

**Arquitectura:**
```
GitHub (push main) → GitHub Actions (build + lint) → SSH a EC2 → pull + build + PM2 restart
                                                                        ↓
                                                              EC2 t2.micro (NestJS + PM2)
                                                                        ↓
                                                              RDS MySQL db.t3.micro
```

**Costo mensual: $0** (free tier durante 12 meses)

---

## Requisitos previos

- Cuenta de AWS activa (con free tier disponible)
- Repositorio en GitHub con rama `main`
- Conocimientos básicos de terminal/SSH

---

## Paso 1 — Crear instancia EC2

1. Ir a **AWS Console → EC2 → Launch Instance**

2. Configurar:
   - **Name:** `hunting-backend`
   - **AMI:** Ubuntu Server 24.04 LTS (HVM) — **Free tier eligible**
   - **Instance type:** `t2.micro` (free tier)
   - **Key pair:** Click "Create new key pair"
     - Name: `hunting-key`
     - Type: RSA
     - Format: `.pem`
     - **Descargar y guardar el archivo `.pem` en lugar seguro**
   - **Network settings → Edit:**
     - Auto-assign public IP: **Enable**
     - Create security group: `hunting-backend-sg`
     - Reglas inbound:

       | Type | Port | Source | Descripción |
       |------|------|--------|-------------|
       | SSH | 22 | My IP | Acceso SSH |
       | HTTP | 80 | 0.0.0.0/0 | Para Nginx |
       | Custom TCP | 3000 | 0.0.0.0/0 | Puerto NestJS |

   - **Storage:** 20 GiB gp3

3. Click **Launch Instance**

4. **Anotar la IP pública** de la instancia (la necesitarás después)

> **Tip:** Para que la IP no cambie al reiniciar la instancia, ve a **EC2 → Elastic IPs → Allocate** y asóciala a tu instancia. Esto es gratis mientras la instancia esté corriendo.

---

## Paso 2 — Crear base de datos RDS MySQL

1. Ir a **AWS Console → RDS → Create database**

2. Configurar:
   - **Method:** Standard create
   - **Engine:** MySQL
   - **Engine version:** MySQL 8.0.x
   - **Templates:** ⚠️ **Free tier** (seleccionar esta opción)
   - **DB instance identifier:** `hunting-db`
   - **Master username:** `admin`
   - **Master password:** `TuPasswordSegura123!` (anótala, la necesitas después)
   - **DB instance class:** `db.t3.micro` (se selecciona automáticamente con free tier)
   - **Storage:** 20 GiB gp2
   - **Connectivity:**
     - VPC: Default VPC (la misma que tu EC2)
     - **Public access:** ❌ No
     - VPC Security group: Create new → `hunting-db-sg`
   - **Additional configuration:**
     - **Initial database name:** `internship_platform`
     - Backup retention: 7 days (default)

3. Click **Create database** (tarda ~5 minutos)

4. Una vez creada, **anotar el Endpoint** (ej: `hunting-db.xxxxxxx.us-east-1.rds.amazonaws.com`)

### 2b — Configurar Security Group de RDS

1. Ir a **RDS → tu BD → Connectivity & security**
2. Click en el **Security Group** de la BD (`hunting-db-sg`)
3. **Edit inbound rules:**

   | Type | Port | Source | Descripción |
   |------|------|--------|-------------|
   | MySQL/Aurora | 3306 | `hunting-backend-sg` | Permitir acceso desde EC2 |

   > En "Source", selecciona "Custom" y busca el security group de tu EC2 (`hunting-backend-sg`)

4. **Save rules**

---

## Paso 3 — Configurar EC2

### 3a — Conectarse por SSH

```bash
# Dar permisos al archivo .pem
chmod 400 hunting-key.pem

# Conectarse
ssh -i hunting-key.pem ubuntu@<TU_IP_PUBLICA>
```

### 3b — Instalar dependencias del sistema

Ejecutar estos comandos **dentro del EC2**:

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version  # Debería mostrar v20.x.x
npm --version

# Instalar pnpm globalmente
sudo npm install -g pnpm

# Instalar PM2 (process manager)
sudo npm install -g pm2

# Instalar git (probablemente ya viene instalado)
sudo apt install -y git
```

### 3c — Clonar el repositorio

```bash
# Clonar tu repo (reemplaza con tu URL)
git clone https://github.com/<TU_USUARIO>/hunting-backend.git ~/hunting-backend

cd ~/hunting-backend
```

> **Si tu repo es privado:** Necesitas configurar un Personal Access Token o SSH key de GitHub.
> Para token: `git clone https://<TOKEN>@github.com/<TU_USUARIO>/hunting-backend.git`

### 3d — Instalar dependencias del proyecto

```bash
cd ~/hunting-backend
pnpm install
```

---

## Paso 4 — Configurar variables de entorno

Crear el archivo `.env` en el servidor:

```bash
nano ~/hunting-backend/.env
```

Pegar este contenido (reemplaza los valores con los tuyos):

```env
# Database (usar endpoint de RDS del Paso 2)
DB_HOST=hunting-db.xxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_USERNAME=admin
DB_PASSWORD=TuPasswordSegura123!
DB_DATABASE=internship_platform

# JWT (genera strings aleatorios largos)
JWT_SECRET=cambiar-por-string-aleatorio-largo-de-al-menos-32-caracteres
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=cambiar-por-otro-string-aleatorio-largo-diferente
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=production

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS (tu frontend en Netlify + otros orígenes permitidos)
CORS_ORIGINS=https://innova-talentum.netlify.app

# Admin seed
ADMIN_EMAIL=admin@platform.com
ADMIN_PASSWORD=CambiarEstePasswordEnProduccion!
```

Guardar: `Ctrl+O` → `Enter` → `Ctrl+X`

> **Tip para generar JWT secrets aleatorios:**
> ```bash
> openssl rand -hex 32
> ```

---

## Paso 5 — Primer deploy manual

```bash
cd ~/hunting-backend

# Crear carpetas necesarias
mkdir -p uploads logs

# Build del proyecto
pnpm run build

# Ejecutar seed para crear admin (solo la primera vez)
pnpm run seed

# Iniciar con PM2 usando el ecosystem.config.js
pm2 start ecosystem.config.js

# Verificar que está corriendo
pm2 status

# Ver logs en tiempo real
pm2 logs hunting-backend
```

### Verificar que funciona:

```bash
# Desde el EC2
curl http://localhost:3000/v1

# Desde tu computadora (reemplaza con tu IP)
curl http://<TU_IP_PUBLICA>:3000/v1
```

### Configurar PM2 para iniciar automáticamente al reiniciar el servidor:

```bash
pm2 save
pm2 startup
```

> PM2 te mostrará un comando que debes copiar y ejecutar (empieza con `sudo env PATH=...`). Ejecútalo.

---

## Paso 6 — Configurar GitHub Secrets (CI/CD)

1. Ir a tu repositorio en GitHub
2. **Settings → Secrets and variables → Actions → New repository secret**
3. Agregar estos 4 secrets:

| Secret Name | Valor |
|-------------|-------|
| `SSH_HOST_AWS` | IP pública de tu EC2 (ej: `54.123.45.67`) |
| `SSH_USER_AWS` | `ubuntu` |
| `SSH_PRIVATE_KEY_AWS` | Contenido completo del archivo `hunting-key.pem` (ver abajo) |
| `SSH_PORT_AWS` | `22` |

### Para copiar el contenido del `.pem`:

```bash
# En tu computadora local (no en EC2)
cat hunting-key.pem
```

Copiar **TODO** el contenido, incluyendo las líneas `-----BEGIN RSA PRIVATE KEY-----` y `-----END RSA PRIVATE KEY-----`.

---

## Paso 7 — Probar el pipeline CI/CD

1. Hacer un cambio menor en el código (ej: agregar un comentario)
2. Commit y push:

```bash
git add .
git commit -m "ci: configure AWS deployment"
git push origin main
```

3. Ir a **GitHub → tu repo → Actions**
4. Verás el workflow ejecutándose con 2 jobs:
   - **Build & Lint:** verifica que el proyecto compile
   - **Deploy to EC2:** hace SSH y actualiza el servidor

5. Una vez completado, verificar:

```bash
curl http://<TU_IP_PUBLICA>:3000/v1
```

> **A partir de ahora, cada push a `main` desplegará automáticamente.**

---

## Paso 8 — Seguridad básica (recomendado)

### 8a — Instalar Nginx como reverse proxy

```bash
# En EC2
sudo apt install -y nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/hunting-backend
```

Pegar:

```nginx
server {
    listen 80;
    server_name _;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/hunting-backend /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

Ahora la API responde en el **puerto 80** (sin necesidad de especificar `:3000`):
```bash
curl http://<TU_IP_PUBLICA>/v1
```

### 8b — Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

> Después de configurar Nginx puedes quitar la regla del puerto 3000 del Security Group de EC2 si quieres.

---

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `pm2 status` | Ver estado del proceso |
| `pm2 logs hunting-backend` | Ver logs en tiempo real |
| `pm2 logs hunting-backend --lines 100` | Ver últimos 100 logs |
| `pm2 restart hunting-backend` | Reiniciar la app |
| `pm2 stop hunting-backend` | Detener la app |
| `pm2 monit` | Monitor interactivo de CPU/memoria |

---

## Troubleshooting

### La app no conecta a RDS
- Verificar que el **Security Group de RDS** permite tráfico desde el Security Group de EC2
- Verificar el **endpoint** de RDS en el archivo `.env`
- Probar conexión: `mysql -h <ENDPOINT_RDS> -u admin -p`

### El deploy de GitHub Actions falla
- Verificar que los **4 secrets** están configurados correctamente
- Verificar que el contenido del `.pem` está completo (incluyendo headers)
- Revisar logs en GitHub → Actions → click en el workflow fallido

### PM2 no encuentra el proceso al reiniciar EC2
- Ejecutar `pm2 save` y `pm2 startup` nuevamente
- Ejecutar el comando `sudo env PATH=...` que muestra `pm2 startup`

### Error de permisos al hacer git pull
- Verificar que el usuario tiene acceso al repo
- Si es privado, configurar token: `git remote set-url origin https://<TOKEN>@github.com/<USER>/hunting-backend.git`

---

## Escalabilidad futura

Cuando el tráfico crezca, puedes escalar así:

| Necesidad | Solución AWS |
|-----------|-------------|
| Más CPU/RAM | Cambiar EC2 a `t3.medium` o `t3.large` |
| Alta disponibilidad | Application Load Balancer + Auto Scaling Group |
| Más rendimiento BD | Escalar RDS a `db.t3.medium` + Read Replicas |
| Containers | Migrar a ECS Fargate o EKS |
| IP fija + SSL | Elastic IP + Route 53 + ACM Certificate |
| Archivos estáticos | Mover uploads a S3 + CloudFront CDN |
