# TechDesk - Plataforma de Gestión de Técnicos de Campo

cual quier cosa 

Plataforma SaaS empresarial para la gestión de técnicos de campo, tareas, clientes y operaciones de servicio.

## 🎯 Descripción General

**TechDesk** es una aplicación web integral diseñada para:

* **Empresas de mantenimiento**: administrar equipos técnicos y solicitudes de servicio.
* **Telecomunicaciones**: coordinar y monitorear operaciones en campo.
* **Soporte TI**: asignar y supervisar tareas técnicas.
* **Empresas de servicios generales**: gestionar la prestación de servicios y atención al cliente.

---

## 🏗️ Arquitectura del Sistema

| Capa          | Tecnología                     | Propósito                       |
| ------------- | ------------------------------ | ------------------------------- |
| Frontend      | React 19 + Vite + Tailwind CSS | Interfaz moderna y responsiva   |
| Backend       | Node.js + Express 5            | API REST escalable              |
| Base de Datos | PostgreSQL + Prisma ORM        | Persistencia confiable de datos |
| Autenticación | JWT + Refresh Tokens           | Sesiones seguras                |
| Estado Global | Zustand                        | Gestión ligera del estado       |

---

## 🚀 Inicio Rápido

### Clonar el repositorio

```bash
git clone <repositorio>
cd Seminario_01
```

### Instalar dependencias

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Configura la variable:

```env
DATABASE_URL=
```

con tu base de datos PostgreSQL local o Supabase.

### Ejecutar migraciones y datos de prueba

```bash
cd backend

npm run prisma:migrate
npm run prisma:seed
```

### Iniciar servidores

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Acceso:

```text
http://localhost:5173
```

Credenciales de demostración:

```text
Correo: admin@techdesk.com
Contraseña: Admin@12345
```

---

## 👥 Roles y Permisos

### Administrador

* Gestión completa de usuarios
* Creación y asignación de tareas
* Creación de formularios dinámicos
* Generación de reportes
* Visualización de estadísticas

### Técnico

* Visualizar tareas asignadas
* Actualizar estados de trabajo
* Registrar evidencias
* Completar formularios
* Consultar historial laboral

### Cliente

* Crear solicitudes de servicio
* Consultar estado de solicitudes
* Descargar reportes
* Revisar historial de servicios

---

## 📋 Funcionalidades Actuales

### Completadas

* Autenticación JWT
* Inicio y cierre de sesión
* Renovación automática de tokens
* Dashboard por roles
* Tema oscuro

### En Desarrollo

* Gestión de usuarios  ✅
* Gestión de tareas ✅
* Constructor de formularios ✅
* Generación de reportes

---

## 📁 Estructura del Proyecto

```text
backend/
│
├── src/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── utils/
│
├── prisma/
└── .env

frontend/
│
├── src/
│   ├── pages/
│   ├── components/
│   ├── store/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── styles/
│
└── .env
```

---

## 🔌 Endpoints de la API

### Autenticación

```http
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Próximamente

```http
/api/v1/users
/api/v1/tasks
/api/v1/forms
/api/v1/reports
/api/v1/clients
/api/v1/dashboard
```

---

## 🛠️ Tecnologías Utilizadas

### Backend

* Node.js
* Express 5
* Prisma ORM
* JWT
* bcrypt
* Helmet
* CORS
* Zod
* Express Validator

### Frontend

* React 19
* Vite
* Tailwind CSS
* React Router
* Zustand
* Axios
* Lucide React

### Base de Datos

* PostgreSQL
* Prisma ORM
* UUID
* JSONB

---

## 📊 Fases de Desarrollo

### Fase 1: Fundamentos ✅

* Estructura del proyecto
* Autenticación JWT
* Login
* Dashboard por roles

### Fase 2: Operaciones Principales

* CRUD de usuarios
* CRUD de clientes
* CRUD de tareas
* Constructor de formularios
* Asignación de técnicos

### Fase 3: Analítica y Reportes

* Reportes PDF
* Evidencias fotográficas
* Indicadores KPI
* Historial de actividades

### Fase 4: Producción

* Pruebas automatizadas
* Optimización de rendimiento
* Diseño móvil avanzado
* Despliegue en producción

---

## 🔐 Seguridad

* Tokens JWT
* Refresh Tokens
* Control de acceso por roles (RBAC)
* Contraseñas cifradas con bcrypt
* Protección CORS
* Validación de entradas
* Cabeceras de seguridad con Helmet

Próximamente:

* Limitación de peticiones (Rate Limiting)
* Auditoría de acciones
* Registro de eventos

---

## 📈 Escalabilidad

* Arquitectura multiempresa (multi-tenant)
* Paginación en API
* Índices optimizados
* Estado persistente con Zustand
* División de código (Code Splitting)
* Preparado para PWA

---

## 🚀 Despliegue

### Frontend

Vercel

```bash
vercel deploy --prod
```

### Backend

Railway

Despliegue automático conectado a GitHub.

### Base de Datos

Supabase PostgreSQL

* Copias de seguridad automáticas
* Escalabilidad administrada
* Posibilidad de tiempo real en futuras versiones

---

## 📝 Variables de Entorno

### Backend

```env
DATABASE_URL=
JWT_SECRET=
CORS_ORIGIN=
```

### Frontend

```env
VITE_API_URL=
```

---

## 🐛 Solución de Problemas

| Problema                        | Solución                  |
| ------------------------------- | ------------------------- |
| No conecta con la base de datos | Verificar DATABASE_URL    |
| Error CORS                      | Revisar CORS_ORIGIN       |
| Token expirado                  | Verificar refresh token   |
| Puerto ocupado                  | Cambiar el puerto en .env |

---

## 🤝 Contribuciones

1. Crear una rama:

```bash
git checkout -b feature/nueva-funcionalidad
```

2. Desarrollar y probar localmente.

3. Realizar commit.

4. Subir cambios y crear Pull Request.

---

## 📄 Licencia

Licencia MIT.

---

## 👨‍💼 Proyecto Académico

Desarrollado como una solución empresarial para la gestión de servicios técnicos de campo.

**Estado actual:** Versión Alpha (Fase 1)

**Próximo objetivo:** Fase 2 - Gestión de Usuarios, Clientes y Tareas.

