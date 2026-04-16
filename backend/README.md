# Backend - Sistema de Control de Alistamientos

## 🏗 Arquitectura

```
MVC + Service Layer:
Routes → Controllers → Services → Models/BD
```

## 📦 Dependencias Principales

- `express` - Framework HTTP
- `sequelize` - ORM para MySQL
- `mysql2` - Driver MySQL
- `express-validator` - Validaciones
- `jsonwebtoken` - JWT
- `bcryptjs` - Hash de contraseñas
- `helmet` - Seguridad HTTP
- `cors` - Cross-Origin Resource Sharing
- `morgan` - Logging HTTP
- `dotenv` - Variables de entorno

## 🎯 Flujo de Validación

1. **Rutas**: `express-validator` valida entrada
2. **Controladores**: Orquesta llamadas a servicios
3. **Servicios**: Lógica de negocio (transacciones, cálculos)
4. **Modelos**: Validaciones Sequelize (tipo, rango, formato)
5. **BD**: Restricciones SQL (unique, FK, NOT NULL)
6. **Error Handler**: Captura y formatea errores

## 📋 Modelos y Relaciones

```
Client (1) ←→ (N) Bike
   ↑                 ↓
   └── HasMany  (1) ←→ (N) WorkOrder
                          ↓
                     (1) ←→ (N) WorkOrderItem
```

**Cascadas:**
- Eliminar Cliente → Elimina sus Motos
- Eliminar Moto → Elimina sus Órdenes
- Eliminar Orden → Elimina sus Items

## 🔄 Transacciones

Se usan en operaciones que afectan múltiples registros:
- **Crear Orden**: Valida moto existe
- **Agregar Item**: Recalcula total de orden
- **Eliminar Item**: Ajusta total de orden

## ✅ Validaciones Implementadas

### Cliente
- `name`: 3-100 caracteres
- `phone`: Solo números
- `email`: Formato email (opcional)

### Moto
- `plate`: Única, mayúsculas
- `brand`: No vacío
- `model`: No vacío
- `clientId`: Debe existir

### Orden
- `motoId`: Debe existir
- `faultDescription`: No vacía
- `status`: RECIBIDA|DIAGNOSTICO|EN_PROCESO|LISTA|ENTREGADA|CANCELADA
- `total`: >= 0

### Regla de negocio de estados
- Flujo principal: RECIBIDA -> DIAGNOSTICO -> EN_PROCESO -> LISTA -> ENTREGADA
- CANCELADA: permitido desde RECIBIDA, DIAGNOSTICO, EN_PROCESO y LISTA
- Desde ENTREGADA no se permite CANCELADA
- Transiciones inválidas retornan HTTP 400 con mensaje descriptivo

### Ítem
- `type`: MANO_OBRA | REPUESTO
- `description`: No vacía
- `count`: > 0
- `unitValue`: >= 0

## 🚀 Quick Start

```bash
# 1. Instalar
npm install

# 2. Crear BD
# (en MySQL)
# CREATE DATABASE proyecto_pavas_taller CHARACTER SET utf8mb4;

# 3. Migraciones
npm run migrate:run

# 4. Desarrollo
npm run dev

# 5. Health check
curl http://localhost:3000/api/health
```

## 📝 Ejemplos API

### GET (Búsqueda con paginación)
```bash
curl "http://localhost:3000/api/clients?search=juan&page=1&pageSize=10"
```

Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "phone": "3001234567",
      "email": "juan@example.com",
      "createdAt": "2026-04-14T10:30:00Z",
      "updatedAt": "2026-04-14T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### POST (Validación fallida)
```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name": "ab", "phone": "abc"}'
```

Respuesta:
```json
{
  "success": false,
  "error": "Error de validación",
  "details": [
    {
      "field": "name",
      "message": "El nombre debe tener entre 3 y 100 caracteres"
    },
    {
      "field": "phone",
      "message": "El teléfono debe contener solo números"
    }
  ]
}
```

### Errores de BD (Placa duplicada)
```json
{
  "success": false,
  "error": "Conflicto: El registro ya existe",
  "details": [
    {
      "field": "plate",
      "message": "plate ya existe en el sistema"
    }
  ]
}
```

## 🔍 Logs

Morgan registra todas las requests HTTP:
```
GET /api/clients 200 45.230 ms - 1234
POST /api/bikes 201 102.456 ms - 567
```

## 🛡 Seguridad

- ✅ Helmet para headers HTTP
- ✅ CORS configurado
- ✅ Validaciones en input
- ✅ Transacciones BD
- ✅ Manejo centralizado de errores
- ✅ JWT (login y rutas protegidas)
- ✅ Roles y permisos (ADMIN / MECANICO)

## 🔐 Endpoints Auth

- `POST /api/auth/register` - Bootstrap del primer ADMIN y alta de usuarios por ADMIN
- `POST /api/auth/login` - Login y emisión de JWT
- `GET /api/auth/me` - Perfil del usuario autenticado

## 📂 Directorios

- `/config` - BD, Sequelize
- `/controllers` - Endpoints lógica
- `/middlewares` - Validación, errores
- `/migrations` - SQL schema
- `/models` - Sequelize models
- `/routes` - Express routes
- `/services` - Lógica negocio
- `/utils` - Helpers
- `/validators` - Reglas validación

## 🧪 Testing

```bash
# Crear un cliente
npm --prefix backend start
# (en otra terminal)
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "phone": "1234567890",
    "email": "test@test.com"
  }'
```

## 🐛 Debug

Habilitar logs SQL:
```javascript
// En src/config/sequelize.js
logging: console.log  // en lugar de false
```

## 📞 Endpoints Resumen

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/clients` | Crear cliente |
| GET | `/api/clients` | Listar clientes |
| GET | `/api/clients/:id` | Obtener cliente |
| PUT | `/api/clients/:id` | Actualizar cliente |
| DELETE | `/api/clients/:id` | Eliminar cliente |
| POST | `/api/bikes` | Crear moto |
| GET | `/api/bikes` | Listar motos |
| GET | `/api/bikes/:id` | Obtener moto |
| PUT | `/api/bikes/:id` | Actualizar moto |
| DELETE | `/api/bikes/:id` | Eliminar moto |
| POST | `/api/work-orders` | Crear orden |
| GET | `/api/work-orders` | Listar órdenes |
| GET | `/api/work-orders/:id` | Obtener orden |
| PATCH | `/api/work-orders/:id/status` | Cambiar estado |
| POST | `/api/work-orders/:id/items` | Agregar ítem |
| DELETE | `/api/work-orders/items/:itemId` | Eliminar ítem |

---

**Versión:** 1.0.0 | **Última actualización:** 14/04/2026
