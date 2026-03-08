# Ejemplos de Swagger - Hunting Platform API

## Acceso a Swagger UI
Una vez iniciado el servidor: **http://localhost:3000/api**

---

## Ejemplos de Request Body por Endpoint

### 1. Registro de Usuario (POST /v1/auth/register)

```json
{
  "email": "estudiante@ejemplo.com",
  "password": "Password123!",
  "role": "student"
}
```

**Roles disponibles:** `student`, `company`

---

### 2. Login (POST /v1/auth/login)

```json
{
  "email": "estudiante@ejemplo.com",
  "password": "Password123!"
}
```

---

### 3. Obtener Perfil de Estudiante (GET /v1/students/profile)

**Requiere:** Token JWT de usuario con rol `STUDENT`

**Headers:**
```
Authorization: Bearer <tu_access_token>
```

**Respuesta si el perfil existe:**
```json
{
  "id": "uuid-del-perfil",
  "userId": "uuid-del-usuario",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "3312345678",
  "state": "Jalisco",
  "city": "Guadalajara",
  "university": "Universidad de Guadalajara",
  "career": "Ingeniería en Sistemas",
  "semester": 8,
  "profileCompleted": true,
  "createdAt": "2026-03-08T10:00:00.000Z",
  "updatedAt": "2026-03-08T10:00:00.000Z"
}
```

**Respuesta si el perfil NO existe:**
```json
{
  "message": "Perfil no encontrado. Debe crear su perfil primero.",
  "profile": null,
  "hint": "Use PUT /v1/students/profile para crear su perfil"
}
```

**Ejemplo cURL:**
```bash
curl -X GET 'http://localhost:3000/v1/students/profile' \
  -H 'Authorization: Bearer <tu_access_token>'
```

---

### 4. Crear/Actualizar Perfil de Estudiante (PUT /v1/students/profile)

**Requiere:** Token JWT de usuario con rol `STUDENT`

**Headers:**
```
Authorization: Bearer <tu_access_token>
Content-Type: application/json
```

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "photo": "/uploads/photos/foto-perfil.jpg",
  "phone": "3312345678",
  "state": "Jalisco",
  "city": "Guadalajara",
  "municipality": "Zapopan",
  "about": "Estudiante apasionado por la tecnología y el desarrollo de software. Busco oportunidades para aplicar mis conocimientos.",
  "cvUrl": "/uploads/cv/curriculum-vitae.pdf",
  "university": "Universidad de Guadalajara",
  "career": "Ingeniería en Sistemas Computacionales",
  "semester": 8
}
```

**Campos obligatorios:** `firstName`, `lastName`, `state`, `city`

**Ejemplo cURL:**
```bash
curl -X PUT 'http://localhost:3000/v1/students/profile' \
  -H 'Authorization: Bearer <tu_access_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "state": "Jalisco",
    "city": "Guadalajara",
    "university": "UDG",
    "career": "Ingeniería en Sistemas",
    "semester": 8
  }'
```

---

### 4. Crear/Actualizar Perfil de Empresa (PUT /v1/companies/profile)

**Requiere:** Token JWT de usuario con rol `COMPANY`

```json
{
  "name": "TechSolutions SA de CV",
  "logo": "/uploads/logos/logo-empresa.png",
  "description": "Empresa líder en desarrollo de software y soluciones tecnológicas innovadoras.",
  "industry": "Tecnología de la Información",
  "state": "Jalisco",
  "city": "Guadalajara",
  "municipality": "Zapopan",
  "website": "https://www.techsolutions.com"
}
```

**Campos obligatorios:** `name`, `industry`, `state`, `city`

---

### 5. Crear Contacto de Empresa (POST /v1/companies/contacts)

**Requiere:** Token JWT de usuario con rol `COMPANY`

```json
{
  "contactName": "María López",
  "phone": "3398765432",
  "email": "maria.lopez@techsolutions.com",
  "position": "Gerente de Recursos Humanos"
}
```

**Campos obligatorios:** `contactName`

---

### 6. Crear Vacante (POST /v1/vacancies)

**Requiere:** Token JWT de usuario con rol `COMPANY`

```json
{
  "title": "Desarrollador Frontend Jr",
  "description": "Buscamos desarrollador frontend con conocimientos en React para unirse a nuestro equipo. Trabajarás en proyectos innovadores y tendrás oportunidad de aprender nuevas tecnologías.",
  "requirements": "React, JavaScript, HTML, CSS, Git, Trabajo en equipo",
  "benefits": "Horario flexible, capacitación continua, ambiente laboral agradable, oportunidad de crecimiento",
  "hasSalary": true,
  "salaryRange": "$8,000 - $12,000 MXN",
  "modality": "HIBRIDO",
  "schedule": "Lunes a Viernes 9:00 - 18:00",
  "durationType": "TEMPORAL",
  "startDate": "2026-03-01",
  "endDate": "2026-09-01"
}
```

**Campos obligatorios:** `title`, `description`, `requirements`

**Modalidades:** `PRESENCIAL`, `REMOTO`, `HIBRIDO`  
**Tipos de duración:** `TEMPORAL`, `INDEFINIDO`

---

### 7. Postularse a Vacante (POST /v1/applications/:vacancyId)

**Requiere:** Token JWT de usuario con rol `STUDENT`

**No requiere body**, solo el ID de la vacante en la URL.

**Ejemplo:** `POST /v1/applications/uuid-de-la-vacante`

---

### 8. Actualizar Estado de Postulación (PUT /v1/admin/applications/:id/status)

**Requiere:** Token JWT de usuario con rol `ADMIN`

```json
{
  "status": "APPROVED",
  "adminNotes": "Candidato aprobado. Cumple con todos los requisitos."
}
```

**Estados disponibles:** `PENDING`, `APPROVED`, `REJECTED`

---

## Cómo Usar Swagger UI

### Paso 1: Autenticarse

1. Ir a `POST /v1/auth/login`
2. Click en "Try it out"
3. Ingresar credenciales:
   ```json
   {
     "email": "admin@hunting.com",
     "password": "Admin123!"
   }
   ```
4. Click en "Execute"
5. Copiar el `accessToken` de la respuesta

### Paso 2: Autorizar en Swagger

1. Click en el botón **"Authorize"** (candado verde en la parte superior)
2. Pegar el token en el campo "Value"
3. Click en "Authorize"
4. Click en "Close"

### Paso 3: Probar Endpoints

Ahora puedes probar cualquier endpoint protegido:
- Los endpoints marcados con 🔒 requieren autenticación
- Swagger enviará automáticamente el token en el header `Authorization: Bearer <token>`

---

## Flujo de Prueba Completo

### A. Como Estudiante

```bash
# 1. Registrarse
POST /v1/auth/register
{
  "email": "estudiante@test.com",
  "password": "Password123!",
  "role": "student"
}

# 2. Copiar el accessToken y autorizar en Swagger

# 3. Completar perfil
PUT /v1/students/profile
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "state": "Jalisco",
  "city": "Guadalajara",
  "university": "UDG",
  "career": "Ingeniería en Sistemas",
  "semester": 8
}

# 4. Ver vacantes disponibles
GET /v1/vacancies

# 5. Postularse a una vacante
POST /v1/applications/{vacancyId}

# 6. Ver mis postulaciones
GET /v1/applications/my
```

### B. Como Empresa

```bash
# 1. Registrarse
POST /v1/auth/register
{
  "email": "empresa@test.com",
  "password": "Password123!",
  "role": "company"
}

# 2. Copiar el accessToken y autorizar en Swagger

# 3. Completar perfil
PUT /v1/companies/profile
{
  "name": "Mi Empresa",
  "industry": "Tecnología",
  "state": "Jalisco",
  "city": "Guadalajara"
}

# 4. Crear contacto
POST /v1/companies/contacts
{
  "contactName": "María López",
  "email": "maria@empresa.com"
}

# 5. Crear vacante
POST /v1/vacancies
{
  "title": "Desarrollador Jr",
  "description": "Buscamos desarrollador...",
  "requirements": "React, JavaScript"
}

# 6. Ver mis vacantes
GET /v1/vacancies/my
```

### C. Como Admin

```bash
# 1. Login con credenciales de admin
POST /v1/auth/login
{
  "email": "admin@hunting.com",
  "password": "Admin123!"
}

# 2. Ver todas las vacantes
GET /v1/admin/vacancies

# 3. Ver todas las postulaciones
GET /v1/admin/applications

# 4. Aprobar/Rechazar postulación
PUT /v1/admin/applications/{id}/status
{
  "status": "APPROVED",
  "adminNotes": "Candidato aprobado"
}

# 5. Ver notificaciones
GET /v1/admin/notifications

# 6. Marcar notificación como leída
PATCH /v1/admin/notifications/{id}/read
```

---

## Parámetros de Query Comunes

### Paginación

Disponible en endpoints de listado:

```
GET /v1/vacancies?page=1&limit=10
GET /v1/admin/applications?page=1&limit=20
GET /v1/admin/notifications?page=1&limit=15
```

**Parámetros:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

### Filtros

**Postulaciones por estado:**
```
GET /v1/admin/applications?status=PENDING
GET /v1/admin/applications?status=APPROVED
```

**Notificaciones por estado de lectura:**
```
GET /v1/admin/notifications?isRead=false
GET /v1/admin/notifications?isRead=true
```

---

## Respuestas Comunes

### Respuesta de Login/Register

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "role": "STUDENT"
  }
}
```

### Respuesta de Paginación

```json
{
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Errores Comunes

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**409 Conflict:**
```json
{
  "statusCode": 409,
  "message": "You have already applied to this vacancy"
}
```
