# Guía de Integración Frontend - Hunting Platform API

## Configuración Base

### URL Base del API
```
http://localhost:3000/v1
```

### Headers Requeridos
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <access_token>' // Solo para rutas protegidas
}
```

---

## Autenticación JWT

### 1. Registro de Usuario

**Endpoint:** `POST /v1/auth/register`

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123!",
  "role": "STUDENT"  // o "COMPANY"
}
```

**Respuesta exitosa (201):**
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

**Ejemplo React/Axios:**
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/v1';

export const register = async (email, password, role) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    role
  });
  
  // Guardar tokens
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  return response.data;
};
```

---

### 2. Login

**Endpoint:** `POST /v1/auth/login`

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123!"
}
```

**Respuesta exitosa (200):**
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

**Ejemplo React/Axios:**
```javascript
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  return response.data;
};
```

---

### 3. Configurar Axios con Interceptores

**Archivo: `src/services/api.js`**
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el token expiró (401) y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        // Intentar refrescar el token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Reintentar la petición original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, hacer logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

### 4. Obtener Usuario Actual

**Endpoint:** `GET /v1/auth/me`

**Headers:** Requiere `Authorization: Bearer <token>`

**Respuesta:**
```json
{
  "id": "uuid-del-usuario",
  "email": "usuario@ejemplo.com",
  "role": "STUDENT"
}
```

**Ejemplo:**
```javascript
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
```

---

### 5. Refresh Token

**Endpoint:** `POST /v1/auth/refresh`

**Headers:** `Authorization: Bearer <refresh_token>`

**Respuesta:**
```json
{
  "accessToken": "nuevo-access-token...",
  "refreshToken": "nuevo-refresh-token...",
  "user": { ... }
}
```

---

## Endpoints por Rol

### Estudiante (STUDENT)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/students/profile` | Obtener mi perfil |
| PUT | `/students/profile` | Actualizar mi perfil |
| POST | `/uploads/cv` | Subir CV (PDF) |
| POST | `/uploads/photo` | Subir foto de perfil |
| GET | `/vacancies` | Listar vacantes abiertas |
| GET | `/vacancies/:id` | Ver detalle de vacante |
| POST | `/applications/:vacancyId` | Postularse a vacante |
| GET | `/applications/my` | Mis postulaciones |

### Empresa (COMPANY)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/companies/profile` | Obtener mi perfil |
| PUT | `/companies/profile` | Actualizar mi perfil |
| POST | `/uploads/logo` | Subir logo |
| GET | `/companies/contacts` | Listar mis contactos |
| POST | `/companies/contacts` | Crear contacto |
| PUT | `/companies/contacts/:id` | Actualizar contacto |
| DELETE | `/companies/contacts/:id` | Eliminar contacto |
| GET | `/vacancies/my` | Mis vacantes |
| POST | `/vacancies` | Crear vacante |
| PUT | `/vacancies/:id` | Actualizar vacante |
| PATCH | `/vacancies/:id/close` | Cerrar vacante |
| DELETE | `/vacancies/:id` | Eliminar vacante |

### Administrador (ADMIN)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/admin/vacancies` | Listar todas las vacantes |
| PUT | `/admin/vacancies/:id` | Editar cualquier vacante |
| DELETE | `/admin/vacancies/:id` | Eliminar vacante |
| GET | `/admin/applications` | Listar postulaciones |
| GET | `/admin/applications/:id` | Ver detalle de postulación |
| PUT | `/admin/applications/:id/status` | Cambiar estado |
| GET | `/admin/notifications` | Listar notificaciones |
| PATCH | `/admin/notifications/:id/read` | Marcar como leída |
| PATCH | `/admin/notifications/mark-all-read` | Marcar todas como leídas |
| GET | `/admin/notifications/unread-count` | Contador de no leídas |

---

## Ejemplos de Uso

### Crear Perfil de Estudiante
```javascript
const updateStudentProfile = async (profileData) => {
  const response = await api.put('/students/profile', {
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '555-1234',
    state: 'Jalisco',
    city: 'Guadalajara',
    university: 'Universidad de Guadalajara',
    career: 'Ingeniería en Sistemas',
    semester: 8,
    about: 'Estudiante apasionado por la tecnología...'
  });
  return response.data;
};
```

### Subir CV
```javascript
const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append('cv', file);
  
  const response = await api.post('/uploads/cv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // { url: '/uploads/cv/filename.pdf', filename: '...' }
};
```

### Crear Vacante (Empresa)
```javascript
const createVacancy = async (vacancyData) => {
  const response = await api.post('/vacancies', {
    title: 'Desarrollador Frontend Jr',
    description: 'Buscamos desarrollador con conocimientos en React...',
    requirements: 'React, JavaScript, CSS, Git',
    benefits: 'Horario flexible, capacitación',
    hasSalary: true,
    salaryRange: '$8,000 - $12,000 MXN',
    modality: 'HIBRIDO', // PRESENCIAL, REMOTO, HIBRIDO
    schedule: 'Lunes a Viernes 9:00 - 18:00',
    durationType: 'TEMPORAL', // TEMPORAL, INDEFINIDO
    startDate: '2026-03-01',
    endDate: '2026-09-01'
  });
  return response.data;
};
```

### Postularse a Vacante (Estudiante)
```javascript
const applyToVacancy = async (vacancyId) => {
  const response = await api.post(`/applications/${vacancyId}`);
  return response.data;
};
```

---

## Manejo de Errores

### Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos para esta acción |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Ya existe (ej: ya postulado) |

### Ejemplo de Manejo
```javascript
try {
  await applyToVacancy(vacancyId);
  toast.success('Postulación enviada exitosamente');
} catch (error) {
  if (error.response?.status === 403) {
    toast.error('Debes completar tu perfil primero');
  } else if (error.response?.status === 409) {
    toast.error('Ya te has postulado a esta vacante');
  } else {
    toast.error('Error al enviar postulación');
  }
}
```

---

## Context de Autenticación (React)

**Archivo: `src/contexts/AuthContext.jsx`**
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    return user;
  };

  const register = async (email, password, role) => {
    const response = await api.post('/auth/register', { email, password, role });
    const { accessToken, refreshToken, user } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    return user;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isCompany = user?.role === 'COMPANY';
  const isStudent = user?.role === 'STUDENT';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
      isAdmin,
      isCompany,
      isStudent
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## Configuración Inicial

### 1. Crear archivo `.env`
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=internship_platform

JWT_SECRET=tu-secreto-jwt-muy-seguro
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=tu-secreto-refresh-muy-seguro
JWT_REFRESH_EXPIRES_IN=7d

ADMIN_EMAIL=admin@hunting.com
ADMIN_PASSWORD=Admin123!
```

### 2. Crear Base de Datos
```sql
CREATE DATABASE internship_platform;
```

### 3. Ejecutar Backend
```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo (crea tablas automáticamente)
npm run start:dev

# Crear usuario admin
npm run seed
```

### 4. Probar Login Admin
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hunting.com","password":"Admin123!"}'
```
