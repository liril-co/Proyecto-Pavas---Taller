#!/bin/bash
# 🚀 Script de instalación rápida (Linux/Mac)
# Para Windows, usa SETUP_WINDOWS.md

set -e  # Exit on first error

echo "🚀 Instalador: Sistema de Control de Alistamientos (Taller de Motos)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Verificar Node.js
echo "📋 Verificando requisitos..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Descarga desde: https://nodejs.org/ (v18+)"
    exit 1
fi
echo "   ✓ Node.js: $(node -v)"
echo "   ✓ npm: $(npm -v)"
echo ""

# 2. Verificar MySQL
echo "🗄  Verificando MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL no encontrado en PATH"
    echo "   Asegúrate de tener MySQL 8.0+ instalado y corriendo en:"
    echo "   localhost:3306 (usuario: root, contraseña: root de default)"
    echo ""
    echo "   Para instalar:"
    echo "   - macOS:   brew install mysql"
    echo "   - Ubuntu:  sudo apt-get install mysql-server"
    echo "   - Arch:    sudo pacman -S mysql"
    echo ""
else
    echo "   ✓ MySQL instalado"
fi
echo ""

# 3. Crear BD si no existe
echo "📝 Preparando base de datos..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS proyecto_pavas_taller CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || {
    echo "⚠️  No se pudo crear BD. Verifica MySQL está corriendo."
    echo "   Inicia MySQL:"
    echo "   - macOS (Homebrew):  brew services start mysql"
    echo "   - Ubuntu:            sudo systemctl start mysql"
    echo ""
    echo "   Luego crea manualmente:"
    echo "   mysql -u root -p"
    echo "   > CREATE DATABASE proyecto_pavas_taller CHARACTER SET utf8mb4;"
    exit 1
}
echo "   ✓ Database 'proyecto_pavas_taller' lista"
echo ""

# 4. Instalar dependencias
echo "📦 Instalando dependencias..."
echo "   • npm install (raíz)"
npm install --silent
echo "   • Backend"
cd backend && npm install --silent && cd ..
echo "   • Frontend"
cd frontend && npm install --silent && cd ..
echo "   ✓ Dependencias instaladas"
echo ""

# 5. Correr migraciones
echo "🗂️  Ejecutando migraciones..."
cd backend
if npm run migrate:run; then
    echo "   ✓ Migraciones completadas"
else
    echo "   ❌ Error en migraciones"
    exit 1
fi
cd ..
echo ""

# 6. Mostrar resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ¡Setup completado exitosamente!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Próximos pasos:"
echo ""
echo "1. Inicia la aplicación:"
echo "   npm run dev"
echo ""
echo "2. Accede a:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:3000"
echo ""
echo "3. Crea el primer usuario (se convierte en ADMIN):"
echo ""
echo "   curl -X POST http://localhost:3000/api/auth/register \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{"
echo "       \"name\": \"Admin\","
echo "       \"email\": \"admin@taller.com\","
echo "       \"password\": \"Admin123\","
echo "       \"role\": \"ADMIN\""
echo "     }'"
echo ""
echo "4. Inicia sesión en http://localhost:5173"
echo "   Email: admin@taller.com"
echo "   Password: Admin123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentación:"
echo "   - Features: Consulta AUTENTICACION_STATUS.md"
echo "   - Auth:     Consulta REFRESH_TOKENS_IMPLEMENTATION.md"
echo ""
echo "❓ ¿Problemas? Consulta SETUP_WINDOWS.md (Troubleshooting)"
echo ""
