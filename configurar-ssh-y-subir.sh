#!/bin/bash

# 🚀 SCRIPT: Configuración SSH + Migración a GitHub
# 👩‍💼 Fundadora: Estefanía Pérez Vázquez
# 🏢 Agencia: Fanny Design Style
# 📧 Contacto: fannydesignstyle@outlook.com
# 📱 Ejecutable en Termux (Android)

echo "🔐 INICIANDO CONFIGURACIÓN SSH PARA GITHUB"
echo "==========================================="
echo "📦 Proyecto: Transparencia Conectada"
echo "🔗 Repositorio: git@github.com:Fannydesignstyle/Transparencia-conectada.portalclaro.git"
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

# Instalar dependencias si no están presentes
if ! command -v git &> /dev/null; then
    echo "📦 Instalando Git..."
    pkg install git -y
fi

if ! command -v ssh-keygen &> /dev/null; then
    echo "📦 Instalando OpenSSH..."
    pkg install openssh -y
fi

# Configurar Git con información oficial
echo "🔧 Configurando Git..."
git config --global user.name "Estefanía Pérez Vázquez"
git config --global user.email "fannydesignstyle@outlook.com"
git config --global core.editor nano

# Verificar si ya existe una clave SSH
if [ -f "$HOME/.ssh/id_rsa" ]; then
    echo "✅ Ya existe una clave SSH en ~/.ssh/id_rsa"
    read -p "¿Quieres generar una nueva clave? (s/n): " nueva_clave
    if [ "$nueva_clave" = "s" ] || [ "$nueva_clave" = "S" ]; then
        rm -f ~/.ssh/id_rsa ~/.ssh/id_rsa.pub
    else
        echo "📌 Usando clave existente"
    fi
fi

# Generar clave SSH si no existe
if [ ! -f "$HOME/.ssh/id_rsa" ]; then
    echo "🔑 Generando nueva clave SSH..."
    ssh-keygen -t rsa -b 4096 -C "fannydesignstyle@outlook.com" -f ~/.ssh/id_rsa -N ""
    
    # Mostrar clave pública
    echo ""
    echo "📋 TU CLAVE PÚBLICA SSH (cópiala para GitHub):"
    echo "==========================================="
    cat ~/.ssh/id_rsa.pub
    echo ""
    echo "📌 PASOS PARA CONFIGURAR EN GITHUB:"
    echo "1. Ve a: https://github.com/settings/keys"
    echo "2. Haz clic en 'New SSH key'"
    echo "3. Titulo: 'Termux - Transparencia Conectada'"
    echo "4. Pega la clave que aparece arriba"
    echo "5. Haz clic en 'Add SSH key'"
    echo ""
    
    read -p "¿Ya agregaste la clave a GitHub? (s/n): " clave_agregada
    if [ "$clave_agregada" != "s" ] && [ "$clave_agregada" != "S" ]; then
        echo "💡 Por favor, agrega la clave a GitHub y vuelve a ejecutar este script"
        exit 1
    fi
fi

# Probar conexión SSH con GitHub
echo "🔌 Probando conexión SSH con GitHub..."
ssh -T git@github.com 2>&1 | grep "successfully" && {
    echo "✅ Conexión SSH establecida correctamente"
} || {
    echo "❌ Error en la conexión SSH"
    echo "💡 Verifica que:"
    echo "   1. Copiaste la clave correctamente en GitHub"
    echo "   2. La clave no tiene errores de copia/pegado"
    echo "   3. Tienes conexión a internet"
    exit 1
}

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

# Configurar URL SSH del repositorio
REPO_URL="git@github.com:Fannydesignstyle/Transparencia-conectada.portalclaro.git"

# Conectar y subir
echo "🔗 Conectando con GitHub vía SSH..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "📤 Subiendo proyecto a GitHub..."
git branch -M main

if git push -u origin main; then
    echo ""
    echo "🎉 ¡PROYECTO SUBIDO CON ÉXITO A GITHUB VIA SSH!"
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
    echo "   - La clave SSH no está configurada correctamente en GitHub"
    echo "   - El repositorio no existe"
    echo "   - Problema de conexión"
    echo ""
    echo "🔧 Solución:"
    echo "   1. Verifica que el repositorio exista"
    echo "   2. Verifica que la clave SSH esté correctamente configurada"
    echo "   3. Vuelve a ejecutar este script"
fi

# Crear recordatorio
cat > ~/RECORDATORIO-SSH.txt << EOL
🚀 TRANSparencia CONECTADA - CONFIGURACIÓN SSH

👩‍💼 Fundadora: Estefanía Pérez Vázquez
🏢 Agencia: Fanny Design Style
📧 Contacto: fannydesignstyle@outlook.com
📞 Teléfono: 951 743 9204

✅ CLAVE SSH CONFIGURADA
🔑 Ubicación: ~/.ssh/id_rsa

✅ PROYECTO SUBIDO A:
git@github.com:Fannydesignstyle/Transparencia-conectada.portalclaro.git

💻 PARA ABRIR EN CODESPACES:
1. Ve al repositorio
2. Haz clic en '<> Code'
3. Selecciona 'Codespaces'
4. Crea un nuevo codespace

🌐 DESPLIEGUE EN VERCEL:
https://vercel.com/import/git

🔒 GESTIÓN DE CLAVES SSH:
- Ver claves: https://github.com/settings/keys
- Agregar nueva clave: https://github.com/settings/keys/new
EOL

echo ""
echo "📄 Guía guardada en: ~/RECORDATORIO-SSH.txt"
echo "💡 Usa: cat ~/RECORDATORIO-SSH.txt"
