# 🔧 Instalación en Windows - Guía Completa

## ✅ Requisitos

1. **Node.js 18+** → https://nodejs.org/  
   - npm se instala automáticamente
   - Verifica con: `node --version` y `npm --version`

2. **MySQL 8.0+** → Opciones:
   - **XAMPP** (recomendado): https://www.apachefriends.org/download.html
     - Incluye Apache, MySQL, PHP
     - Control Panel fácil de usar
   - **WampServer**: https://www.wampserver.com/en/download.php
   - **Instalador MySQL directo**: https://dev.mysql.com/downloads/installer/
   - **Docker**: (Opcional) `docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8.0`

3. **Git** (opcional, para clonar): https://git-scm.com/download/win

4. **Editor recomendado**: VS Code https://code.visualstudio.com/

---

## 📋 Tabla de Contenidos

1. [Configuración de MySQL](#-configuración-mysql)
2. [Instalación Paso a Paso](#-instalación-paso-a-paso)
3. [Primer Usuario (Bootstrap)](#-primer-usuario-bootstrap)
4. [Características del Sistema](#-características-del-sistema)
5. [Testear la API](#-testear-la-api)
6. [Troubleshooting](#-troubleshooting)
7. [FAQ](#-faq)

---

## 🗄️ Configuración MySQL

### Opción 1: XAMPP (Recomendado)

1. **Descargar e instalar** desde https://www.apachefriends.org/download.html
2. **Abrir XAMPP Control Panel**
3. **Click en "Start"** junto a MySQL
4. **Esperar** hasta que diga "Running"
5. **Click en "Admin"** para abrir phpMyAdmin (http://localhost/phpmyadmin)

Usuario por defecto: **root** | Contraseña: **root**

### Opción 2: Instalador MySQL Directo

1. **Descargar**: https://dev.mysql.com/downloads/installer/
2. **Instalar** con valores por defecto
3. **Usuario**: root | **Contraseña**: la que configures
4. **Actualizar** en `backend/.env` según tu contraseña

### Opción 3: Docker

```powershell
docker run --name mysql-taller -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```

### Verificar Conexión

En PowerShell:
```powershell
mysql -u root -p
# Ingresa la contraseña (por defecto "root" en XAMPP)
# Si entra, MySQL está OK
exit
```

---

## 🚀 Instalación Paso a Paso

### Paso 1️⃣: Descargar el Proyecto

**Opción A: Con Git**
```powershell
cd Desktop
git clone <URL-del-repo>
cd "Proyecto Pavas - Taller"
```

**Opción B: Manual**
- Descargar ZIP del repositorio
- Descomprimir en Desktop o donde prefieras
- Abrir carpeta en PowerShell o terminal

---

### Paso 2️⃣: Crear Base de Datos

**Opción A: Con MySQL CLI**
```powershell
mysql -u root -p
```
Ingresa contraseña (por defecto: **root**). Luego ejecuta:
```sql
CREATE DATABASE proyecto_pavas_taller CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit
```

**Opción B: Con phpMyAdmin (XAMPP)**
1. Abrir http://localhost/phpmyadmin
2. Click en "Nueva"
3. Ingresar nombre: `proyecto_pavas_taller`
4. Charset: `utf8mb4_unicode_ci`
5. Click "Crear"

**Verificar creación:**
```powershell
mysql -u root -p -e "SHOW DATABASES;"
# Deberías ver: proyecto_pavas_taller
```

---

### Paso 3️⃣: Configurar Variables de Entorno

En la carpeta `backend/`, crea o edita `.env`:

```env
# ========== SERVIDOR ==========
NODE_ENV=development
PORT=3000

# ========== BASE DE DATOS ==========
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=proyecto_pavas_taller

# ========== AUTENTICACIÓN ==========
JWT_SECRET=mi-clave-super-secreta-no-compartir-xyz123
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# ========== RATE LIMITING ==========
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_ATTEMPTS=5

# ========== FRONTEND ==========
CORS_ORIGIN=http://localhost:5173
```

**⚠️ IMPORTANTE:**
- Cambiar `JWT_SECRET` en producción (usar 32+ caracteres aleatorios)
- No compartir este archivo
- Si MySQL usa otra contraseña, actualizar `DB_PASSWORD`

**Si tu MySQL es diferente:**

| Escenario | DB_USER | DB_PASSWORD | Nota |
|-----------|---------|-------------|------|
| XAMPP defecto | root | root | ✅ Default |
| MySQL instalador | root | [tu password] | Cambiar |
| Docker | root | root | Si lo configuraste así |

---

### Paso 4️⃣: Instalar Dependencias

Abrir PowerShell en la raíz del proyecto (`Proyecto Pavas - Taller`):

```powershell
# Instalar dependencias de raíz
npm install

# Instalar backend
cd backend
npm install
cd ..

# Instalar frontend
cd frontend
npm install
cd ..
```

**Esperar** a que termine la instalación (2-5 minutos según internet).

Verifica con:
```powershell
node --version  # Debe ser 18+
npm --version   # Debe ser 9+
```

---

### Paso 5️⃣: Ejecutar Migraciones

Crea las 8 tablas necesarias:

```powershell
cd backend
npm run migrate:run
cd ..
```

**Deberías ver:**
```
✓ Migrations executed successfully
✓ 8 migrations completed:
  - 20260414000001-create-clients
  - 20260414000002-create-bikes
  - 20260414000003-create-work-orders
  - 20260414000004-create-work-order-items
  - 20260414000005-create-users
  - 20260414000006-alter-work-order-status-enum
  - 20260414000007-create-work-order-status-history
  - 20260414000008-create-refresh-tokens
```

---

### Paso 6️⃣: Iniciar en Desarrollo

```powershell
npm run dev
```

**Resultado esperado:**
```
[Backend] http://localhost:3000 ✓
[Frontend] http://localhost:5173 ✓
```

Se abrirá automáticamente la página de login en el navegador.

---

## 👤 Primer Usuario (Bootstrap)

### Crear Admin Inicial

1. **Acceder a**: http://localhost:5173
2. **Click en "Registrarse"**
3. **Ingresar datos:**
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: (mínimo 6 caracteres)

4. **Click en "Registrarse"**

**¡Listo!** Automáticamente te conviertes en **ADMIN** (primer usuario).

### Crear Otro Usuario (Como ADMIN)

1. **Login** con tu cuenta admin
2. **Ir a**: Administración → Usuarios
3. **Click en "Nuevo Usuario"**
4. **Ingresar datos del nuevo usuario**
5. **Seleccionar rol**: MECANICO o ADMIN
6. **Click en "Guardar"**

---

## 🔐 Características del Sistema

### 🔑 Autenticación JWT

**¿Qué es JWT?**
- Sistema de tokens para verificar identidad
- Access Token: 15 minutos de validez
- Refresh Token: 7 días de validez
- Auto-renovación transparente sin re-login

**Flujo:**
1. Login → Recibe 2 tokens
2. Access token para requests
3. Sistema chequea cada minuto si expira pronto
4. Renueva automáticamente si < 2 min restante
5. Si expira, auto-refresh "detrás de escenas"

### 🛡️ Rate Limiting

**Protección contra fuerza bruta:**
- Máximo: 5 intentos fallidos de login
- Espera: 15 minutos por IP
- Mensaje: "Too many login attempts, try again later"

### 👥 Control de Roles

**ADMIN:**
- ✅ CRUD completo en todo
- ✅ Gestionar usuarios
- ✅ Estados finales (Entregada, Cancelada)
- ✅ Ver auditoría completa

**MECANICO:**
- ✅ Ver órdenes
- ✅ Crear ítems
- ✅ Cambiar a: Diagnóstico, En Proceso, Lista
- ❌ No puede finales ni gestionar usuarios

### 📊 Auditoría de Cambios

Cada vez que cambia el estado de una orden:
- ✔️ Se registra QUIÉN cambió
- ✔️ Cuándo fue el cambio
- ✔️ De qué estado a cuál
- ✔️ Nota opcional

**Acceso:**
- Click en orden → Tab "Historial"

### 💾 Base de Datos (8 tablas)

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios del sistema |
| `clients` | Propietarios de motos |
| `bikes` | Motos (placa única) |
| `work_orders` | Órdenes de trabajo |
| `work_order_items` | Ítems dentro de órdenes |
| `work_order_status_histories` | Auditoría de cambios |
| `refresh_tokens` | Tokens para renovación |
| `sequelize_meta` | Control de migraciones |

---

## 🧪 Testear la API

### Opción 1: Postman (GUI - Recomendado)

1. **Descargar Postman**: https://www.postman.com/downloads/
2. **Abrir Postman**
3. **Click "Import"**
4. **Buscar archivo**: `postman/Taller-Motos.postman_collection.json`
5. **Importar**
6. **¡Listo!** Todos los endpoints ya están configurados

**Usar en Postman:**
- Selecciona un endpoint
- Click "Send"
- Ves respuesta en JSON

### Opción 2: cURL (CLI)

**Health check:**
```powershell
curl http://localhost:3000/api/health
```

**Registrarse:**
```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
```

**Login:**
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"123456"}'
```

Respuesta:
```json
{
  "message": "Login successful",
  "user": { "id": 1, "email": "test@example.com", "role": "ADMIN" },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

## 🐛 Troubleshooting

### Error: "mysql: El término 'mysql' no se reconoce"

**Causa:** MySQL no está en PATH de Windows

**Solución:**
1. Abre **Variables de Entorno del Sistema**:
   - Windows + R → `sysdm.cpl` → Tab "Avanzado"
   - Click "Variables de entorno"
   - En "Variables del sistema", busca "Path"
   - Click "Editar"
   - Click "Nuevo" y agrega: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
   - OK y reinicia PowerShell

2. O simplemente usa phpMyAdmin (GUI de XAMPP)

---

### Error: "connect ECONNREFUSED 127.0.0.1:3306"

**Causa:** MySQL no está corriendo

**Solución:**

**Si usas XAMPP:**
1. Abrir XAMPP Control Panel
2. Click "Start" junto a MySQL
3. Esperar a que diga "Running"

**Si instalaste MySQL directamente:**
1. Abre Services (Windows + R → `services.msc`)
2. Busca "MySQL80" (o tu versión)
3. Click derecho → "Start"

**Verificar:**
```powershell
mysql -u root -p
# Si entra, MySQL funciona
exit
```

---

### Error: "Unknown database 'proyecto_pavas_taller'"

**Causa:** Base de datos no fue creada

**Solución:**
```powershell
mysql -u root -p
```
Ejecuta:
```sql
CREATE DATABASE proyecto_pavas_taller CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
exit
```

---

### Error: "ER_ACCESS_DENIED_FOR_USER 'root'@'localhost'"

**Causa:** Contraseña MySQL incorrecta en `.env`

**Solución:**

1. **Si usas XAMPP:**
   - Usuario: `root`
   - Contraseña: `root` (vacío también funciona)
   - En `backend/.env`: `DB_PASSWORD=root`

2. **Si instalaste MySQL:**
   - Verifica tu contraseña
   - Actualiza en `backend/.env`

3. **Prueba conexión:**
   ```powershell
   mysql -u root -p
   # Si pide password: hay una
   # Si entra sin pedir: no hay
   ```

---

### Error: "TypeError: Cannot read property 'email' of undefined"

**Causa:** JWT_SECRET en `.env` está vacío

**Solución:**
1. Abre `backend/.env`
2. Verifica que `JWT_SECRET` tenga un valor
3. No debe estar vacío ni comentado

```env
JWT_SECRET=tu-clave-secreta-aqui  # ✅ Bien
# JWT_SECRET=...                  # ❌ Comentado
```

---

### Error: "CORS blocked"

**Causa:** Frontend intenta contactar backend que no permite CORS

**Solución:**

El CORS está configurado, pero si sigue:

1. Verifica `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

2. Reinicia: `npm run dev`
3. Limpia cache: Ctrl + Shift + Delete

---

### Error: "Module not found: 'express'"

**Causa:** `npm install` no se ejecutó correctamente

**Solución:**
```powershell
cd backend
rm -r node_modules  # Eliminar carpeta
npm install          # Reinstalar
cd ..
```

O limpia todo:
```powershell
npm cache clean --force
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

### Error: "npm run migrate:run" falla

**Causa:** Múltiples posibilidades

**Solución paso a paso:**

1. **Verifica que MySQL está corriendo:**
   ```powershell
   mysql -u root -p -e "SELECT 1;"
   ```

2. **Verifica BD existe:**
   ```powershell
   mysql -u root -p -e "SHOW DATABASES;"
   # Busca: proyecto_pavas_taller
   ```

3. **Verifica .env en backend:**
   - `DB_HOST=localhost`
   - `DB_USER=root`
   - `DB_PASSWORD=root` (o tu password)

4. **Reinicia:**
   ```powershell
   cd backend
   npm run migrate:run
   cd ..
   ```

---

### Error: "Port 3000 already in use"

**Causa:** Otro proceso está en puerto 3000

**Solución:**
```powershell
# Opción 1: Terminar proceso
# Windows + R → taskmgr.exe → Busca node → End task

# Opción 2: Usar otro puerto
# En backend/.env: PORT=3001
# Luego: npm run dev -- --port 3001
```

---

### Frontend no carga o está en blanco

**Causa:**
- Vite no está corriendo
- Puerto 5173 ocupado

**Solución:**
```powershell
npm run dev

# Si dice "port in use":
npm run dev -- --port 5174
```

Luego accede a http://localhost:5174

---

### "Too many login attempts"

**Causa:** Excediste 5 intentos fallidos en 15 minutos

**Solución:**
- Espera 15 minutos
- O reinicia el backend

---

## ❓ FAQ

### ¿Puedo cambiar el puerto de Node?

Sí, en `backend/.env`:
```env
PORT=3001
```

O en comando:
```powershell
npm run dev -- --port 3001
```

---

### ¿Puedo usar una BD en la nube?

Sí, actualiza `backend/.env`:
```env
DB_HOST=mi-servidor.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=mi-password
DB_NAME=proyecto_pavas_taller
```

---

### ¿Cuánto dura el Access Token?

15 minutos. Se renueva automáticamente sin que hagas re-login.

El sistema chequea cada minuto y renueva si < 2 min para expirar.

---

### ¿Qué pasa si pierdo la sesión?

Los tokens se guardan en `localStorage` del navegador.
- Cerrar tab: Se mantiene sesión
- Limpiar datos del navegador: Cierra sesión

---

### ¿Puedo usar HTTPS?

Sí, en `backend/src/server.js` configura SSL:
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/key.pem'),
  cert: fs.readFileSync('path/to/cert.pem')
};

https.createServer(options, app).listen(3000);
```

---

### ¿Cómo respaldar la BD?

```powershell
mysqldump -u root -p proyecto_pavas_taller > backup.sql
```

Restaurar:
```powershell
mysql -u root -p proyecto_pavas_taller < backup.sql
```

---

### ¿Qué hacer si todo falla?

1. **Verifica:**
   - Node.js 18+ (`node --version`)
   - MySQL corriendo (`mysql -u root -p`)
   - Puerto 3000 y 5173 libres

2. **Revisa logs:**
   - Backend: Consola donde corre `npm run dev`
   - Frontend: DevTools (F12 → Console)
   - MySQL: Archivo de logs

3. **Reinicia todo:**
   ```powershell
   npm run dev
   ```

---

**¡Si todo está verde, ya está listo para usar! 🎉**

Accede a http://localhost:5173 y comienza a registrar órdenes.
