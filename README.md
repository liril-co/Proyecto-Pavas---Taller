# Taller de Motos - Sistema de Gestión de Órdenes de Trabajo

Sistema completo de gestión para talleres de motos. Permite registrar clientes, motos, órdenes de trabajo e ítems con validaciones de negocio, autenticación JWT con roles, y auditoría de cambios.

**Versión:** 1.0  
**Estado:** ✅ Producción-ready  
**Última actualización:** Abril 2026

---

## ✨ Características Implementadas

### 🔐 Autenticación y Seguridad
- ✅ **JWT con Access + Refresh Tokens**
  - Access tokens: 15 minutos (corta duración)
  - Refresh tokens: 7 días (renovación automática)
  - Renovación transparente sin re-login
  
- ✅ **Rate Limiting en Login**
  - Máximo 5 intentos cada 15 minutos por IP
  - Protección contra fuerza bruta
  
- ✅ **Control de Permisos por Rol**
  - **ADMIN**: CRUD completo, gestión de usuarios
  - **MECANICO**: Lectura, crear items, cambiar estados (excepto finales)
  
- ✅ **Seguridad de Contraseñas**
  - Bcrypt 10 rounds
  - Errores genéricos en login (sin exponer detalles)

### 📊 Gestión de Datos
- ✅ **CRUD Completo**
  - Clientes (nombre, phone, email)
  - Motos (placa única, brand, model, cilindro)
  - Órdenes de Trabajo (estados, total automático)
  - Ítems en órdenes (tipo: mano de obra/repuesto)

- ✅ **Validaciones Multinivel**
  - Express-validator (HTTP)
  - Sequelize (modelos)
  - Base de datos (SQL constraints)
  - Lógica de negocio (servicios)

- ✅ **Auditoría y Historial**
  - Registro de cambios de estado en órdenes
  - Quién cambió, cuándo, de qué a qué
  - Notas opcionales por cambio
  - Timeline visible en UI

### 🎨 Frontend Moderno
- ✅ **React 18 + Vite**
  - Fast refresh en desarrollo
  - Build optimizado (95 KB gzipped)
  
- ✅ **UI/UX Mejorada**
  - Diseño moderno con grid layout 12-columnas
  - Títulos dinámicos según página
  - Favicon personalizado
  - Notificaciones tipo toast (success, error, warning, info)
  - Responsive (desktop, tablet, móvil)
  
- ✅ **Gestión de Sesión**
  - AuthContext con persistencia
  - Auto-login al recargar
  - Protected routes por rol
  - Logout con revocación en servidor

### 🛠️ Backend Robusto
- ✅ **Express.js + Sequelize**
  - ORM con migraciones versionadas
  - Transacciones para operaciones complejas
  - Validaciones en modelos
  
- ✅ **API RESTful**
  - 16+ endpoints documentados
  - Errores normalizados
  - CORS configurado
  - Health check endpoint

---

## 🚀 Quick Start

### Windows (PowerShell)
Ver instrucciones completas en: **[SETUP_WINDOWS.md](./SETUP_WINDOWS.md)**

```powershell
# Requisitos: Node.js 18+, MySQL 8.0+
# Ver SETUP_WINDOWS.md para instrucciones detalladas
```

### Linux/macOS
Ver instrucciones en: **[SETUP.sh](./SETUP.sh)**

```bash
# Requisitos: Node.js 18+, MySQL 8.0+
chmod +x SETUP.sh
./SETUP.sh
npm run dev
```

**Acceso:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 📋 Requisitos

| Requisito | Versión | Instalador |
|-----------|---------|-----------|
| Node.js | 18+ | https://nodejs.org/ |
| npm | 9+ | (incluido con Node.js) |
| MySQL | 8.0+ | XAMPP, WampServer, brew, apt-get, etc. |

---

## 📚 Documentación Completa

| Documento | Contenido |
|-----------|----------|
| **[SETUP_WINDOWS.md](./SETUP_WINDOWS.md)** ⭐ | Instalación completa para Windows con troubleshooting |
| **[SETUP.sh](./SETUP.sh)** ⭐ | Script de instalación para Linux/macOS |
| **[AUTENTICACION_STATUS.md](./AUTENTICACION_STATUS.md)** | Análisis detallado de JWT + roles |
| **[REFRESH_TOKENS_IMPLEMENTATION.md](./REFRESH_TOKENS_IMPLEMENTATION.md)** | Sistema de refresh tokens explicado |
| **[TITLES_AND_FAVICON.md](./TITLES_AND_FAVICON.md)** | Cambios UI (títulos dinámicos) |
| **[backend/README.md](./backend/README.md)** | Documentación de la API |
| **[frontend/README.md](./frontend/README.md)** | Documentación del frontend |

---

## 🏗️ Estructura del Proyecto

```
Proyecto Pavas - Taller/
├── backend/                    # Node.js + Express + Sequelize
│   ├── src/
│   │   ├── config/            # BD, Sequelize
│   │   ├── controllers/       # 5 controllers
│   │   ├── middlewares/       # Auth, rate-limit, validación
│   │   ├── migrations/        # 8 migraciones versionadas
│   │   ├── models/            # 8 modelos Sequelize
│   │   ├── routes/            # 4 routers (auth, clients, bikes, orders)
│   │   ├── services/          # 5 servicios de negocio
│   │   └── server.js          # Punto de entrada
│   ├── .env                   # Variables (username, password, JWT_SECRET)
│   ├── package.json
│   └── README.md
├── frontend/                   # React 18 + Vite
│   ├── src/
│   │   ├── api/               # Cliente HTTP (workshopApi.js, http.js)
│   │   ├── components/        # 8+ componentes
│   │   ├── context/           # AuthContext, NotificationContext
│   │   ├── hooks/             # usePageTitle
│   │   ├── pages/             # 5 páginas principales
│   │   └── main.jsx
│   ├── public/                # favicon.ico, favicon.svg
│   ├── index.html             # HTML principal
│   ├── package.json
│   └── README.md
├── postman/                    # Colección API para testing
├── SETUP_WINDOWS.md           # Setup para Windows (detallado)
├── SETUP.sh                   # Setup para Linux/macOS
├── README.md                  # Este archivo
└── [otros docs]               # AUTENTICACION_STATUS.md, etc.
```

---

## 🔐 Sistema de Autenticación

### Flow de Login
1. Usuario entra en LoginPage
2. POST `/auth/login` con email + password
3. Backend verifica credenciales
4. Responde con accessToken (15m) + refreshToken (7d)
5. Frontend almacena en localStorage
6. Autoriza requests con Bearer token

### Renovación Automática
- AuthContext verifica cada minuto si accessToken expira en < 2 min
- Si sí, llama POST `/auth/refresh` automáticamente
- Obtiene nuevo accessToken sin interrupciones

### Primer Usuario (Bootstrap)
- Primera persona que se registra → automáticamente ADMIN
- Posteriores usuarios requieren ser creados por ADMIN

---

## 🧪 Endpoints API

### Autenticación (7 endpoints)
```
POST   /api/auth/register        → Crear usuario
POST   /api/auth/login           → Iniciar sesión (rate-limited 5/15min)
POST   /api/auth/refresh         → Renovar access token
POST   /api/auth/logout          → Cerrar sesión
GET    /api/auth/me              → Perfil actual
GET    /api/auth/users           → Listar usuarios (ADMIN)
PATCH  /api/auth/users/:id       → Actualizar usuario (ADMIN)
```

### Clientes (5 endpoints)
```
POST   /api/clients              → Crear cliente
GET    /api/clients              → Listar (búsqueda)
GET    /api/clients/:id          → Obtener uno
PUT    /api/clients/:id          → Actualizar
DELETE /api/clients/:id          → Eliminar (ADMIN)
```

### Motos (5 endpoints)
```
POST   /api/bikes                → Crear moto
GET    /api/bikes                → Listar (búsqueda placa)
GET    /api/bikes/:id            → Obtener una
PUT    /api/bikes/:id            → Actualizar
DELETE /api/bikes/:id            → Eliminar (ADMIN)
```

### Órdenes (8 endpoints)
```
POST   /api/work-orders          → Crear orden
GET    /api/work-orders          → Listar (filtros: status, plate, paginación)
GET    /api/work-orders/:id      → Obtener una
PATCH  /api/work-orders/:id/status → Cambiar estado (+ nota opcional)
GET    /api/work-orders/:id/history → Historial de cambios
POST   /api/work-orders/:id/items → Agregar ítem
DELETE /api/work-orders/items/:itemId → Eliminar ítem
```

**Total: 16+ endpoints RESTful**

---

## 🔒 Control de Acceso

### ADMIN (sin restricciones)
- ✅ CRUD completo en todos los recursos
- ✅ Gestión de usuarios
- ✅ Estados finales (ENTREGADA, CANCELADA)
- ✅ Panel de administración

### MECANICO (restricciones)
- ✅ Ver y crear órdenes, items
- ✅ Cambiar a: DIAGNOSTICO, EN_PROCESO, LISTA
- ❌ No puede: Eliminar, finales, gestionar usuarios

---

## 📊 Bases de Datos

### 8 Tablas Creadas

| Tabla | Campos | Propósito |
|-------|--------|----------|
| `users` | id, name, email, password, role, isActive | Usuarios del sistema |
| `clients` | id, name, phone, email | Propietarios de motos |
| `bikes` | id, plate (único), brand, model, cylinder, clientId | Motos del taller |
| `work_orders` | id, status, entryDate, total, motoId | Órdenes de trabajo |
| `work_order_items` | id, type, description, count, unitValue, workOrderId | Ítems de órdenes |
| `work_order_status_histories` | id, workOrderId, fromStatus, toStatus, note, changedByUserId | Auditoría de cambios |
| `refresh_tokens` | id, userId, token, expiresAt, revokedAt | Tokens de renovación |

---

## 🐛 Troubleshooting

### MySQL no conecta
```
ERROR: connect ECONNREFUSED 127.0.0.1:3306
```
**Ver soluciones en:** [SETUP_WINDOWS.md - Error: MySQL no conecta](./SETUP_WINDOWS.md#error-mysql-no-conecta)

### Access Denied
```
ER_ACCESS_DENIED_FOR_USER
```
**Ver soluciones en:** [SETUP_WINDOWS.md - Error: Access Denied](./SETUP_WINDOWS.md#error-access-denied)

### CORS bloqueado
**Ver soluciones en:** [SETUP_WINDOWS.md - Error: CORS blocked](./SETUP_WINDOWS.md#error-cors-blocked)

---

## 📈 Estadísticas

| Métrica | Valor |
|---------|-------|
| **Backend** | 5 controllers, 5 servicios, 4 routers, 8 modelos |
| **Frontend** | 5 páginas, 8+ componentes, 2 contexts, 1 hook |
| **Base de datos** | 8 tablas, 8 migraciones versionadas |
| **API** | 16+ endpoints RESTful |
| **Validaciones** | 4 niveles (HTTP, modelo, BD, negocio) |
| **Seguridad** | JWT, bcrypt, rate-limit, CORS, helmet |
| **Build** | 92 módulos React, 95 KB JS (gzipped) |

---

## ✅ Feature Checklist

### Backend (100%)
- ✅ Models con validaciones
- ✅ Migraciones versionadas
- ✅ Controllers + Services
- ✅ Middlewares (auth, rate-limit, error)
- ✅ JWT + Refresh Tokens
- ✅ Auditoría de cambios
- ✅ Transacciones DB

### Frontend (100%)
- ✅ React Router + Protected routes
- ✅ Context API + localStorage
- ✅ Formularios + validación
- ✅ Notificaciones toast
- ✅ Responsive design
- ✅ Títulos dinámicos + favicon

---

## 🚀 Pasos Siguientes

1. **Instalar según tu SO:**
   - Windows: [SETUP_WINDOWS.md](./SETUP_WINDOWS.md)
   - Linux/macOS: [SETUP.sh](./SETUP.sh)

2. **Revisar documentación específica:**
   - Autenticación: [AUTENTICACION_STATUS.md](./AUTENTICACION_STATUS.md)
   - Refresh tokens: [REFRESH_TOKENS_IMPLEMENTATION.md](./REFRESH_TOKENS_IMPLEMENTATION.md)

3. **Probar la API:**
   - Postman collection: [postman/Taller-Motos.postman_collection.json](./postman/Taller-Motos.postman_collection.json)

4. **Para producción:**
   - Cambiar `JWT_SECRET` en `.env`
   - Cambiar `NODE_ENV=production`
   - Usar BD en cloud (AWS RDS, etc.)

---

## 📄 Stack Tecnológico

### Backend
- **Node.js 22** + Express.js 5
- **Sequelize 6** - ORM, migraciones
- **MySQL 8.0** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hashing de contraseñas
- **express-rate-limit** - Rate limiting
- **Helmet**, **CORS** - Seguridad

### Frontend
- **React 18** - UI framework
- **Vite 8** - Bundler
- **React Router 6** - Navegación
- **Axios** - HTTP client
- **Context API** - State management

---

## 👥 Roles y Permisos

| Acción | ADMIN | MECANICO |
|--------|-------|----------|
| Ver/crear cliente | ✅ | ✅ |
| Eliminar cliente | ✅ | ❌ |
| Ver/crear orden | ✅ | ✅ |
| Agregar ítem | ✅ | ✅ |
| Cambiar a LISTA | ✅ | ✅ |
| Cambiar a ENTREGADA | ✅ | ❌ |
| Ver usuarios | ✅ | ❌ |
| Crear usuario | ✅ | ❌ |

---

## 📞 Soporte

- **Documentación:** Consultar archivos `.md` en raíz
- **Problemas comunes:** [SETUP_WINDOWS.md - Troubleshooting](./SETUP_WINDOWS.md#-troubleshooting)
- **API Testing:** Usar Postman collection

---

**¿Primero es la vez?** Comienza por [SETUP_WINDOWS.md](./SETUP_WINDOWS.md) o [SETUP.sh](./SETUP.sh)
├── .env                (env vars frontend)
└── package.json
```

## 📚 API Endpoints

### Clientes
- `POST /api/clients` - Crear cliente
- `GET /api/clients?search=` - Listar (con búsqueda)
- `GET /api/clients/:id` - Obtener uno
- `PUT /api/clients/:id` - Actualizar
- `DELETE /api/clients/:id` - Eliminar

### Motos
- `POST /api/bikes` - Crear moto
- `GET /api/bikes?plate=` - Listar (buscar por placa)
- `GET /api/bikes/:id` - Obtener una
- `PUT /api/bikes/:id` - Actualizar
- `DELETE /api/bikes/:id` - Eliminar

### Órdenes de Trabajo
- `POST /api/work-orders` - Crear orden
- `GET /api/work-orders?status=&plate=&page=&pageSize=` - Listar (con filtros)
- `GET /api/work-orders/:id` - Obtener una
- `PATCH /api/work-orders/:id/status` - Cambiar estado
- `POST /api/work-orders/:id/items` - Agregar ítem
- `DELETE /api/work-orders/items/:itemId` - Eliminar ítem

## 🖥 Frontend mínimo implementado

- Listado de órdenes: tabla con placa, cliente, estado, fecha, total, filtros por estado/placa y paginación
- Crear orden: búsqueda de moto por placa y registro rápido de cliente/moto cuando no existe
- Detalle de orden: datos de cliente/moto, cambios de estado solo válidos, gestión de ítems y total
- UX: estados de carga y mensajes de error visibles

## 🔒 Seguridad

El sistema incluye:
- **Validaciones en backend** - Express-validator
- **Middlewares de error** - Manejo centralizado
- **Relaciones con cascada** - Integridad referencial
- **Transacciones BD** - Para operaciones críticas (agregar items)

### Flujo de estados de orden implementado:
- RECIBIDA -> DIAGNOSTICO -> EN_PROCESO -> LISTA -> ENTREGADA
- CANCELADA se permite desde cualquier estado excepto ENTREGADA
- Transiciones inválidas retornan 400 con mensaje claro

## 🗄 Esquema BD

### Tabla: clients
```
id (PK)
name (VARCHAR 100, NOT NULL)
phone (VARCHAR 20, NOT NULL)
email (VARCHAR 100, nullable)
createdAt, updatedAt
```

### Tabla: bikes
```
id (PK)
plate (VARCHAR 20, UNIQUE, NOT NULL)
brand (VARCHAR 50, NOT NULL)
model (VARCHAR 50, NOT NULL)
cylinder (VARCHAR 20, nullable)
clientId (FK → clients.id)
createdAt, updatedAt
```

### Tabla: work_orders
```
id (PK)
motoId (FK → bikes.id)
entryDate (DATETIME, default NOW)
faultDescription (TEXT, NOT NULL)
status (ENUM: RECIBIDA|DIAGNOSTICO|EN_PROCESO|LISTA|ENTREGADA|CANCELADA)
total (DECIMAL 10,2, default 0)
createdAt, updatedAt
```

### Tabla: work_order_items
```
id (PK)
workOrderId (FK → work_orders.id)
type (ENUM: MANO_OBRA|REPUESTO)
description (TEXT, NOT NULL)
count (INT >= 1)
unitValue (DECIMAL 10,2 >= 0)
createdAt, updatedAt
```

## ⚙️ Variables de Entorno (.env)

```env
NODE_ENV=development
PORT=3000

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=proyecto_pavas_taller

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 🧪 Comandos Útiles

```bash
# Backend
npm --prefix backend run dev          # Desarrollo con nodemon
npm --prefix backend start             # Producción
npm --prefix backend run migrate:run   # Correr migraciones
npm --prefix backend run migrate:undo  # Deshacer migración

# Frontend
npm --prefix frontend run dev          # Vite dev server
npm --prefix frontend run build        # Build producción

# Ambos
npm run dev                            # Backend + Frontend

# Crear nueva migración
npm --prefix backend run migrate:create --name=<name>
```

## 📮 Colección Postman

- Archivo: [postman/Taller-Motos.postman_collection.json](postman/Taller-Motos.postman_collection.json)
- Importa este archivo en Postman y usa la variable baseUrl = http://localhost:3000/api

## 🔐 Autenticación y Roles

- `POST /api/auth/register`: crea el primer usuario ADMIN (bootstrap). Luego solo ADMIN puede crear usuarios.
- `POST /api/auth/login`: retorna JWT.
- `GET /api/auth/me`: perfil del usuario autenticado.
- Roles soportados: ADMIN, MECANICO.
- Rutas de clientes, motos y órdenes requieren token Bearer.
- Restricción de rol: DELETE de clientes y motos solo ADMIN.

## 📖 Ejemplos de Uso - cURL

### Crear Cliente
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "phone": "3001234567",
    "email": "juan@example.com"
  }'
```

### Crear Moto
```bash
curl -X POST http://localhost:3000/api/bikes \
  -H "Content-Type: application/json" \
  -d '{
    "plate": "ABC123",
    "brand": "Honda",
    "model": "CB 150",
    "cylinder": "150cc",
    "clientId": 1
  }'
```

### Crear Orden de Trabajo
```bash
curl -X POST http://localhost:3000/api/work-orders \
  -H "Content-Type: application/json" \
  -d '{
    "motoId": 1,
    "faultDescription": "No enciende, revisar batería y bujías"
  }'
```

### Agregar Ítem a Orden
```bash
curl -X POST http://localhost:3000/api/work-orders/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "type": "MANO_OBRA",
    "description": "Diagnóstico y reparación",
    "count": 2,
    "unitValue": 50000
  }'
```

## 🐛 Troubleshooting

### Error: `Cannot find module './models'`
Asegúrate de ejecutar migraciones: `npm --prefix backend run migrate:run`

### Error: `connect ECONNREFUSED 127.0.0.1:3306`
MySQL no está corriendo. Inicia el servicio o verifica credenciales en `.env`.

### Error: `ER_ACCESS_DENIED_FOR_USER`
Credenciales de BD incorrectas. Verifica usuario/contraseña en `.env`.

## 📝 Siguientes Fases

- [ ] Reportes y estadísticas
- [ ] Notificaciones
- [ ] UI completa en React

---

**Fecha de creación:** 14/04/2026
**Versión:** 1.0.0
