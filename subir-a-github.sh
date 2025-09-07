#!/bin/bash

# 🚀 SCRIPT: Conexión Automática a GitHub
# 👩‍💼 Fundadora: Estefanía Pérez Vázquez
# 🏢 Agencia: Fanny Design Style
# 📧 Contacto: fannydesignstyle@outlook.com
# 📱 Ejecutable en Termux (Android)

echo "🚀 INICIANDO CONEXIÓN CON GITHUB"
echo "================================"
echo "📦 Proyecto: Transparencia Conectada"
echo "🔗 Repositorio: Fannydesignstyle/Transparencia-conectada.portalclaro"
echo "👩‍💼 Fundadora: Estefanía Pérez Vázquez"
echo ""

# Verificar si estamos en Termux
if [ -z "$PREFIX" ]; then
    echo "❌ Este script solo funciona en Termux"
    exit 1
fi

# Verificar si estamos en el directorio del proyecto
if [ ! -f "package.json" ]; then
    echo "🔍 No se encontró package.json"
    echo "📁 Navegando al directorio del proyecto..."
    cd ~/portal-transparencia 2>/dev/null || {
        echo "❌ No se pudo encontrar ~/portal-transparencia"
        echo "💡 Crea el proyecto con: npx create-react-app portal-transparencia --template typescript"
        exit 1
    }
    echo "✅ Cambiado a ~/portal-transparencia"
fi

# Instalar Git si no está presente
if ! command -v git &> /dev/null; then
    echo "📦 Instalando Git..."
    pkg install git -y
fi

# Configurar Git con información oficial
echo "🔧 Configurando Git..."
git config --global user.name "Estefanía Pérez Vázquez"
git config --global user.email "fannydesignstyle@outlook.com"
git config --global core.editor nano

# Inicializar repositorio si no existe
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositorio Git..."
    git init
else
    echo "✅ Repositorio Git ya existe"
fi

# Agregar todos los archivos
echo "📎 Agregando archivos..."
git add .

# Hacer commit con información oficial
echo "💾 Guardando cambios..."
git commit -m "📦 Proyecto inicial - Portal de Transparencia Conectada
👩‍💼 Fundadora: Estefanía Pérez Vázquez
🏢 Agencia: Fanny Design Style
📧 Contacto: fannydesignstyle@outlook.com
📞 Teléfono: 951 743 9204
✅ Estructura base con React, Firebase y Tailwind" || echo "No hay cambios nuevos"

# URL del repositorio
REPO_URL="https://Fannydesignstyle:***REMOVED***@github.com/Fannydesignstyle/Transparencia-conectada.portalclaro.git"# Conectar y subir
echo "🔗 Conectando con GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "📤 Subiendo proyecto a GitHub..."
git branch -M main

if git push -u origin main; then
    echo ""
    echo "🎉 ¡PROYECTO SUBIDO CON ÉXITO A GITHUB!"
    echo ""
    echo "✅ Ahora puedes abrirlo en GitHub Codespaces:"
    echo ""
    echo "1. Ve a: https://github.com/Fannydesignstyle/Transparencia-conectada.portalclaro"
    echo "2. Haz clic en '<> Code'"
    echo "3. Selecciona 'Codespaces'"
    echo "4. Haz clic en 'Create codespace'"
    echo ""
    echo "💻 Tu entorno profesional está listo"
    echo ""
    echo "🌐 URL del proyecto: https://Fannydesignstyle.github.io/Transparencia-conectada.portalclaro"
    echo ""
    echo "📌 Recuerda: Tu trabajo está ahora en la nube"
else
    echo ""
    echo "❌ Error al subir a GitHub"
    echo "💡 Posibles causas:"
    echo "   - El token ha expirado"
    echo "   - El repositorio no existe"
    echo "   - Problema de conexión"
    echo ""
    echo "🔧 Solución:"
    echo "   1. Verifica que el repositorio exista"
    echo "   2. Genera un nuevo token en:"
    echo "      https://github.com/settings/tokens"
    echo "   3. Vuelve a ejecutar este script"
fi

# Crear recordatorio
cat > ~/RECORDATORIO-GITHUB.txt << EOL
🚀 TRANSparencia CONECTADA - CONEXIÓN GITHUB

👩‍💼 Fundadora: Estefanía Pérez Vázquez
🏢 Agencia: Fanny Design Style
📧 Contacto: fannydesignstyle@outlook.com
📞 Teléfono: 951 743 9204

✅ PROYECTO SUBIDO A:
https://github.com/Fannydesignstyle/Transparencia-conectada.portalclaro

💻 PARA ABRIR EN CODESPACES:
1. Ve al repositorio
2. Haz clic en '<> Code'
3. Selecciona 'Codespaces'
4. Crea un nuevo codespace

🌐 DESPLIEGUE EN VERCEL:
https://vercel.com/import/git

🔒 TOKEN DE ACCESO:
Este token fue usado para autenticación.
Para mayor seguridad, revócalo en:
https://github.com/settings/tokens
EOL

echo ""
echo "📄 Guía guardada en: ~/RECORDATORIO-GITHUB.txt"
echo "💡 Usa: cat ~/RECORDATORIO-GITHUB.txt"
