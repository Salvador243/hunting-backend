# 📋 Guía de Integración Frontend - Actualización Perfil de Estudiante

## 🎯 Resumen de Cambios

Se han actualizado los campos del perfil de estudiante según los requerimientos del cliente. A continuación se detallan todos los cambios implementados en el backend y cómo consumirlos desde el frontend.

---

## 📊 Nuevos Campos Agregados

### 1. **Plan de Estudio** (antes "Semestre")
- **Campo anterior:** `semester` (número)
- **Campo nuevo:** `studyPlan` (enum)
- **Valores permitidos:**
  - `BIMESTRAL`
  - `CUATRIMESTRAL`
  - `SEMESTRAL`

### 2. **Status Académico**
- **Campo:** `academicStatus` (enum)
- **Valores permitidos:**
  - `ESTUDIANTE`
  - `PASANTE`
  - `RECIEN_EGRESADO`

### 3. **Horario de Estudio**
- **Campo:** `studySchedule` (enum)
- **Valores permitidos:**
  - `MATUTINO`
  - `VESPERTINO`
  - `MIXTO`

### 4. **País**
- **Campo:** `country` (string)
- **Descripción:** Se agregó el campo "País" además de Estado/Ciudad
- **Ejemplo:** `"México"`

### 5. **Seguro Médico**
- **Campo 1:** `hasMedicalInsurance` (boolean)
- **Campo 2:** `insuranceType` (enum, opcional si `hasMedicalInsurance` es `true`)
- **Valores de `insuranceType`:**
  - `SEGURO_FACULTATIVO_IMSS`
  - `SEGURO_GASTOS_MEDICOS_MAYORES`
  - `SEGURO_ACCIDENTES_PERSONALES_ESCOLARES`
  - `SEGURO_SALUD_FAMILIA`

### 6. **LinkedIn**
- **Campo:** `linkedinUrl` (string, URL)
- **Ejemplo:** `"https://www.linkedin.com/in/juan-perez"`

### 7. **Portafolio Virtual** (Nuevos archivos)
- **Campo 1:** `studyProofUrl` (string) - Comprobante de estudios
- **Campo 2:** `degreeUrl` (string) - Título o certificado
- **Campo 3:** `certificationsUrl` (string) - Certificaciones

---

## 🔌 Endpoints Actualizados

### 1. **Obtener Perfil de Estudiante**

```http
GET /v1/students/profile
```

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "Juan",
  "lastName": "Pérez",
  "photo": "/uploads/photos/foto.jpg",
  "phone": "3312345678",
  "country": "México",
  "state": "Jalisco",
  "city": "Guadalajara",
  "municipality": "Zapopan",
  "about": "Estudiante apasionado por la tecnología...",
  "cvUrl": "/uploads/cv/cv.pdf",
  "university": "Universidad de Guadalajara",
  "career": "Ingeniería en Sistemas",
  "studyPlan": "SEMESTRAL",
  "academicStatus": "ESTUDIANTE",
  "studySchedule": "MATUTINO",
  "linkedinUrl": "https://www.linkedin.com/in/juan-perez",
  "hasMedicalInsurance": true,
  "insuranceType": "SEGURO_FACULTATIVO_IMSS",
  "studyProofUrl": "/uploads/documents/comprobante.pdf",
  "degreeUrl": "/uploads/documents/titulo.pdf",
  "certificationsUrl": "/uploads/documents/certificaciones.pdf",
  "profileCompleted": true,
  "createdAt": "2026-03-10T12:00:00.000Z",
  "updatedAt": "2026-03-10T12:00:00.000Z"
}
```

---

### 2. **Actualizar Perfil de Estudiante**

```http
PUT /v1/students/profile
```

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "application/json"
}
```

**Body (todos los campos son opcionales):**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "3312345678",
  "country": "México",
  "state": "Jalisco",
  "city": "Guadalajara",
  "municipality": "Zapopan",
  "about": "Estudiante apasionado por la tecnología...",
  "university": "Universidad de Guadalajara",
  "career": "Ingeniería en Sistemas Computacionales",
  "studyPlan": "SEMESTRAL",
  "academicStatus": "ESTUDIANTE",
  "studySchedule": "MATUTINO",
  "linkedinUrl": "https://www.linkedin.com/in/juan-perez",
  "hasMedicalInsurance": true,
  "insuranceType": "SEGURO_FACULTATIVO_IMSS"
}
```

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "firstName": "Juan",
  "lastName": "Pérez",
  // ... todos los campos actualizados
  "profileCompleted": true
}
```

---

### 3. **Subir Comprobante de Estudios** (NUEVO)

```http
POST /v1/students/portfolio/study-proof
```

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "multipart/form-data"
}
```

**Body (FormData):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
```

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "studyProofUrl": "/uploads/documents/studyProof-userId-1234567890.pdf",
  // ... resto del perfil
}
```

---

### 4. **Subir Título o Certificado** (NUEVO)

```http
POST /v1/students/portfolio/degree
```

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "multipart/form-data"
}
```

**Body (FormData):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
```

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "degreeUrl": "/uploads/documents/degree-userId-1234567890.pdf",
  // ... resto del perfil
}
```

---

### 5. **Subir Certificaciones** (NUEVO)

```http
POST /v1/students/portfolio/certifications
```

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>",
  "Content-Type": "multipart/form-data"
}
```

**Body (FormData):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
```

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "certificationsUrl": "/uploads/documents/certifications-userId-1234567890.pdf",
  // ... resto del perfil
}
```

---

## 💻 Ejemplos de Código Frontend

### TypeScript/JavaScript - Tipos de Datos

```typescript
// Enums
export enum StudyPlan {
  BIMESTRAL = 'BIMESTRAL',
  CUATRIMESTRAL = 'CUATRIMESTRAL',
  SEMESTRAL = 'SEMESTRAL',
}

export enum AcademicStatus {
  ESTUDIANTE = 'ESTUDIANTE',
  PASANTE = 'PASANTE',
  RECIEN_EGRESADO = 'RECIEN_EGRESADO',
}

export enum StudySchedule {
  MATUTINO = 'MATUTINO',
  VESPERTINO = 'VESPERTINO',
  MIXTO = 'MIXTO',
}

export enum InsuranceType {
  SEGURO_FACULTATIVO_IMSS = 'SEGURO_FACULTATIVO_IMSS',
  SEGURO_GASTOS_MEDICOS_MAYORES = 'SEGURO_GASTOS_MEDICOS_MAYORES',
  SEGURO_ACCIDENTES_PERSONALES_ESCOLARES = 'SEGURO_ACCIDENTES_PERSONALES_ESCOLARES',
  SEGURO_SALUD_FAMILIA = 'SEGURO_SALUD_FAMILIA',
}

// Interface del perfil de estudiante
export interface StudentProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  municipality?: string;
  about?: string;
  cvUrl?: string;
  university?: string;
  career?: string;
  studyPlan?: StudyPlan;
  academicStatus?: AcademicStatus;
  studySchedule?: StudySchedule;
  linkedinUrl?: string;
  hasMedicalInsurance?: boolean;
  insuranceType?: InsuranceType;
  studyProofUrl?: string;
  degreeUrl?: string;
  certificationsUrl?: string;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO para actualizar perfil
export interface UpdateStudentProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  municipality?: string;
  about?: string;
  university?: string;
  career?: string;
  studyPlan?: StudyPlan;
  academicStatus?: AcademicStatus;
  studySchedule?: StudySchedule;
  linkedinUrl?: string;
  hasMedicalInsurance?: boolean;
  insuranceType?: InsuranceType;
}
```

---

### React - Ejemplo de Formulario

```tsx
import React, { useState, useEffect } from 'react';
import { StudentProfile, StudyPlan, AcademicStatus, StudySchedule, InsuranceType } from './types';

const StudentProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    municipality: '',
    about: '',
    university: '',
    career: '',
    studyPlan: '',
    academicStatus: '',
    studySchedule: '',
    linkedinUrl: '',
    hasMedicalInsurance: false,
    insuranceType: '',
  });

  // Obtener perfil al cargar
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('https://hunting-backend.duckdns.org/v1/students/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      setProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        country: data.country || '',
        state: data.state || '',
        city: data.city || '',
        municipality: data.municipality || '',
        about: data.about || '',
        university: data.university || '',
        career: data.career || '',
        studyPlan: data.studyPlan || '',
        academicStatus: data.academicStatus || '',
        studySchedule: data.studySchedule || '',
        linkedinUrl: data.linkedinUrl || '',
        hasMedicalInsurance: data.hasMedicalInsurance || false,
        insuranceType: data.insuranceType || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://hunting-backend.duckdns.org/v1/students/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setProfile(data);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar perfil');
    }
  };

  const handleFileUpload = async (fileType: 'study-proof' | 'degree' | 'certifications', file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`https://hunting-backend.duckdns.org/v1/students/portfolio/${fileType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });
      const data = await response.json();
      setProfile(data);
      alert('Archivo subido exitosamente');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir archivo');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Información Personal */}
      <section>
        <h2>Información Personal</h2>
        
        <input
          type="text"
          placeholder="Nombre"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        
        <input
          type="text"
          placeholder="Apellido"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        
        <input
          type="tel"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </section>

      {/* Ubicación */}
      <section>
        <h2>Ubicación</h2>
        
        <input
          type="text"
          placeholder="País"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        />
        
        <input
          type="text"
          placeholder="Estado"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        />
        
        <input
          type="text"
          placeholder="Ciudad"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
        
        <input
          type="text"
          placeholder="Municipio/Alcaldía"
          value={formData.municipality}
          onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
        />
      </section>

      {/* Información Académica */}
      <section>
        <h2>Información Académica</h2>
        
        <input
          type="text"
          placeholder="Universidad"
          value={formData.university}
          onChange={(e) => setFormData({ ...formData, university: e.target.value })}
        />
        
        <input
          type="text"
          placeholder="Carrera"
          value={formData.career}
          onChange={(e) => setFormData({ ...formData, career: e.target.value })}
        />
        
        <select
          value={formData.studyPlan}
          onChange={(e) => setFormData({ ...formData, studyPlan: e.target.value })}
        >
          <option value="">Selecciona Plan de Estudio</option>
          <option value={StudyPlan.BIMESTRAL}>Bimestral</option>
          <option value={StudyPlan.CUATRIMESTRAL}>Cuatrimestral</option>
          <option value={StudyPlan.SEMESTRAL}>Semestral</option>
        </select>
        
        <select
          value={formData.academicStatus}
          onChange={(e) => setFormData({ ...formData, academicStatus: e.target.value })}
        >
          <option value="">Selecciona Status Académico</option>
          <option value={AcademicStatus.ESTUDIANTE}>Estudiante</option>
          <option value={AcademicStatus.PASANTE}>Pasante</option>
          <option value={AcademicStatus.RECIEN_EGRESADO}>Recién Egresado</option>
        </select>
        
        <select
          value={formData.studySchedule}
          onChange={(e) => setFormData({ ...formData, studySchedule: e.target.value })}
        >
          <option value="">Selecciona Horario de Estudio</option>
          <option value={StudySchedule.MATUTINO}>Matutino</option>
          <option value={StudySchedule.VESPERTINO}>Vespertino</option>
          <option value={StudySchedule.MIXTO}>Mixto</option>
        </select>
      </section>

      {/* LinkedIn */}
      <section>
        <h2>Redes Profesionales</h2>
        
        <input
          type="url"
          placeholder="URL de LinkedIn"
          value={formData.linkedinUrl}
          onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
        />
      </section>

      {/* Seguro Médico */}
      <section>
        <h2>Seguro Médico</h2>
        
        <label>
          <input
            type="checkbox"
            checked={formData.hasMedicalInsurance}
            onChange={(e) => setFormData({ 
              ...formData, 
              hasMedicalInsurance: e.target.checked,
              insuranceType: e.target.checked ? formData.insuranceType : '',
            })}
          />
          ¿Cuenta con seguro médico?
        </label>
        
        {formData.hasMedicalInsurance && (
          <select
            value={formData.insuranceType}
            onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}
          >
            <option value="">Selecciona tipo de seguro</option>
            <option value={InsuranceType.SEGURO_FACULTATIVO_IMSS}>Seguro Facultativo IMSS</option>
            <option value={InsuranceType.SEGURO_GASTOS_MEDICOS_MAYORES}>Seguro de Gastos Médicos Mayores</option>
            <option value={InsuranceType.SEGURO_ACCIDENTES_PERSONALES_ESCOLARES}>Seguro de Accidentes Personales Escolares</option>
            <option value={InsuranceType.SEGURO_SALUD_FAMILIA}>Seguro de Salud para la Familia</option>
          </select>
        )}
      </section>

      {/* Portafolio Virtual */}
      <section>
        <h2>Portafolio Virtual</h2>
        
        <div>
          <label>Comprobante de Estudios:</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload('study-proof', file);
            }}
          />
          {profile?.studyProofUrl && (
            <a href={`https://hunting-backend.duckdns.org${profile.studyProofUrl}`} target="_blank" rel="noopener noreferrer">
              Ver archivo
            </a>
          )}
        </div>
        
        <div>
          <label>Título o Certificado:</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload('degree', file);
            }}
          />
          {profile?.degreeUrl && (
            <a href={`https://hunting-backend.duckdns.org${profile.degreeUrl}`} target="_blank" rel="noopener noreferrer">
              Ver archivo
            </a>
          )}
        </div>
        
        <div>
          <label>Certificaciones:</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload('certifications', file);
            }}
          />
          {profile?.certificationsUrl && (
            <a href={`https://hunting-backend.duckdns.org${profile.certificationsUrl}`} target="_blank" rel="noopener noreferrer">
              Ver archivo
            </a>
          )}
        </div>
      </section>

      <button type="submit">Guardar Cambios</button>
    </form>
  );
};

export default StudentProfileForm;
```

---

## 🎨 Catálogos para Selectores

### Plan de Estudio
```javascript
const studyPlanOptions = [
  { value: 'BIMESTRAL', label: 'Bimestral' },
  { value: 'CUATRIMESTRAL', label: 'Cuatrimestral' },
  { value: 'SEMESTRAL', label: 'Semestral' },
];
```

### Status Académico
```javascript
const academicStatusOptions = [
  { value: 'ESTUDIANTE', label: 'Estudiante' },
  { value: 'PASANTE', label: 'Pasante' },
  { value: 'RECIEN_EGRESADO', label: 'Recién Egresado' },
];
```

### Horario de Estudio
```javascript
const studyScheduleOptions = [
  { value: 'MATUTINO', label: 'Matutino' },
  { value: 'VESPERTINO', label: 'Vespertino' },
  { value: 'MIXTO', label: 'Mixto' },
];
```

### Tipo de Seguro Médico
```javascript
const insuranceTypeOptions = [
  { value: 'SEGURO_FACULTATIVO_IMSS', label: 'Seguro Facultativo IMSS' },
  { value: 'SEGURO_GASTOS_MEDICOS_MAYORES', label: 'Seguro de Gastos Médicos Mayores' },
  { value: 'SEGURO_ACCIDENTES_PERSONALES_ESCOLARES', label: 'Seguro de Accidentes Personales Escolares' },
  { value: 'SEGURO_SALUD_FAMILIA', label: 'Seguro de Salud para la Familia' },
];
```

---

## ⚠️ Notas Importantes

1. **Campo eliminado:** El campo `semester` (número) ya NO existe. Ahora se usa `studyPlan` (enum).

2. **Validación de LinkedIn:** El campo `linkedinUrl` debe ser una URL válida que comience con `http://` o `https://`.

3. **Seguro médico:** Si `hasMedicalInsurance` es `false`, el campo `insuranceType` debe estar vacío o ser `null`.

4. **Archivos del portafolio:** Los archivos se suben por separado usando `FormData` y el backend retorna la URL del archivo guardado.

5. **Formatos de archivo aceptados:** PDF, JPG, JPEG, PNG para los documentos del portafolio.

6. **Tamaño máximo de archivo:** 5 MB (configurado en el backend).

7. **País/Estado/Ciudad:** Estos campos son strings libres. El cliente mencionó que podría agregar catálogos preestablecidos en el futuro, pero por ahora son campos de texto libre.

---

## 📚 Documentación Swagger

Toda la documentación está disponible en:
```
https://hunting-backend.duckdns.org/api
```

Busca la sección **"Students"** para ver todos los endpoints con ejemplos interactivos.

---

## ✅ Checklist de Implementación Frontend

- [ ] Actualizar tipos/interfaces con los nuevos campos
- [ ] Crear enums para los catálogos
- [ ] Actualizar formulario de perfil con los nuevos campos
- [ ] Agregar selectores para: Plan de Estudio, Status Académico, Horario
- [ ] Agregar campo de País en la sección de ubicación
- [ ] Agregar campo de LinkedIn
- [ ] Agregar checkbox y selector de Seguro Médico
- [ ] Implementar subida de archivos para Portafolio Virtual (3 archivos)
- [ ] Mostrar archivos subidos con enlaces para descargar
- [ ] Remover campo "Semestre" del formulario
- [ ] Probar todos los endpoints en Swagger
- [ ] Validar que los archivos se suban correctamente
- [ ] Validar que las URLs de LinkedIn sean válidas

---

## 🚀 Deploy

Los cambios ya están desplegados en:
```
https://hunting-backend.duckdns.org
```

El auto-deploy está configurado, así que cualquier cambio futuro se desplegará automáticamente al hacer push a `main`.

---

## 📞 Soporte

Si tienes dudas o encuentras algún problema, revisa:
1. Swagger UI: `https://hunting-backend.duckdns.org/api`
2. Este documento
3. Contacta al equipo de backend

---

**Fecha de actualización:** 11 de Marzo, 2026
**Versión:** 2.0
