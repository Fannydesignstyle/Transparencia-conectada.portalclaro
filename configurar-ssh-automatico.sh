#!/bin/bash

# 🚀 SCRIPT: Configuración Automática SSH + GitHub
# 👩‍💼 Fundadora: Estefanía Pérez Vázquez
# 🏢 Agencia: Fanny Design Style
# 📧 Contacto: fannydesignstyle@outlook.com
# 📱 Ejecutable en Termux (Android)

echo "🔐 CONFIGURACIÓN AUTOMÁTICA SSH PARA GITHUB"
echo "============================================"
echo "📦 Proyecto: Transparencia Conectada"
echo "👩‍💼 Fundadora: Estefanía Pérez Vázquez"
echo "📞 Teléfono: 951 743 9204"
echo ""

# Verificar si estamos en Termux
if [ -z "$PREFIX" ]; then
    echo "❌ Este script solo funciona en Termux"
    exit 1
fi

# Verificar si estamos en el directorio del proyecto
if [ ! -f "package.json" ]; then
    echo "🔍 Buscando proyecto..."
    if [ -d "$HOME/portal-transparencia" ]; then
        cd "$HOME/portal-transparencia"
        echo "✅ Encontrado y cambiado a: $HOME/portal-transparencia"
    else
        echo "❌ No se encontró el proyecto"
        echo "💡 Crea el proyecto con: npx create-react-app portal-transparencia --template typescript"
        exit 1
    fi
fi

# Instalar dependencias necesarias
echo "📦 Instalando dependencias..."
pkg update -y > /dev/null 2>&1
pkg install openssh git -y > /dev/null 2>&1

# Configurar Git con información oficial
echo "🔧 Configurando Git..."
git config --global user.name "Estefanía Pérez Vázquez"
git config --global user.email "fannydesignstyle@outlook.com"
git config --global core.editor nano
git config --global init.defaultBranch main

# Función para verificar conexión SSH
verificar_conexion_ssh() {
    echo "🔌 Probando conexión SSH con GitHub..."
    if ssh -T git@github.com 2>&1 | grep -q "successfully"; then
        echo "✅ Conexión SSH establecida correctamente"
        return 0
    else
        echo "❌ Error en la conexión SSH"
        return 1
    fi
}

# Verificar si ya existe una clave SSH
if [ -f "$HOME/.ssh/id_rsa" ]; then
    echo "🔑 Ya existe una clave SSH"
    read -p "¿Quieres generar una nueva? (s/n): " generar_nueva
    if [ "$generar_nueva" = "s" ] || [ "$generar_nueva" = "S" ]; then
        rm -f ~/.ssh/id_rsa ~/.ssh/id_rsa.pub ~/.ssh/known_hosts
        echo "🗑️  Claves anteriores eliminadas"
    else
        if verificar_conexion_ssh; then
            echo "📌 Usando clave existente"
        else
            echo "⚠️  La clave existente no funciona. Generando nueva..."
            rm -f ~/.ssh/id_rsa ~/.ssh/id_rsa.pub ~/.ssh/known_hosts
        fi
    fi
fi

# Generar nueva clave SSH si no existe o si falló la conexión
if [ ! -f "$HOME/.ssh/id_rsa" ]; then
    echo "🔑 Generando nueva clave SSH..."
    ssh-keygen -t rsa -b 4096 -C "fannydesignstyle@outlook.com" -f ~/.ssh/id_rsa -N "" > /dev/null
    
    # Agregar clave al ssh-agent
    eval $(ssh-agent -s) > /dev/null 2>&1
    ssh-add ~/.ssh/id_rsa > /dev/null 2>&1
    
    # Añadir GitHub a known_hosts
    ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null
    
    echo ""
    echo "📋 TU NUEVA CLAVE PÚBLICA SSH:"
    echo "============================="
    cat ~/.ssh/id_rsa.pub
    echo ""
    echo "📌 INSTRUCCIONES PARA GITHUB:"
    echo "1. Abre este enlace en tu navegador:"
    echo "   https://github.com/settings/keys/new"
    echo "2. Titulo: 'Termux - Transparencia Conectada'"
    echo "3. Tipo: 'Authentication Key'"
    echo "4. Copia y pega la clave que aparece arriba"
    echo "5. Haz clic en 'Add SSH key'"
    echo ""
    
    # Intentar abrir el enlace automáticamente (si es posible)
    if command -v termux-open-url &> /dev/null; then
        echo "🌐 Abriendo enlace automáticamente..."
        termux-open-url "https://github.com/settings/keys/new"
    fi
    
    # Esperar a que el usuario configure la clave
    echo "⏳ Esperando a que configures la clave en GitHub..."
    echo "💡 Presiona ENTER cuando hayas terminado de configurar la clave en GitHub"
    read
fi

# Verificar conexión final
if ! verificar_conexion_ssh; then
    echo ""
    echo "❌ AÚN HAY PROBLEMAS CON LA CONEXIÓN SSH"
    echo "💡 Soluciones:"
    echo "   1. Verifica que copiaste la clave completa en GitHub"
    echo "   2. Asegúrate de que no hay espacios al final de la clave"
    echo "   3. Verifica tu conexión a internet"
    echo "   4. Revisa: https://docs.github.com/en/authentication/troubleshooting-ssh"
    echo ""
    read -p "¿Quieres intentar de nuevo? (s/n): " intentar_nuevo
    if [ "$intentar_nuevo" = "s" ] || [ "$intentar_nuevo" = "S" ]; then
        exec "$0" "$@"
    else
        exit 1
    fi
fi

# Inicializar repositorio si no existe
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositorio Git..."
    git init
else
    echo "✅ Repositorio Git ya existe"
fi

# Agregar todos los archivos
echo "📎 Agregando archivos al repositorio..."
git add .

# Hacer commit inicial
echo "💾 Guardando cambios iniciales..."
git commit -m "📦 Proyecto inicial - Portal de Transparencia Conectada
👩‍💼 Fundadora: Estefanía Pérez Vázquez
🏢 Agencia: Fanny Design Style
📧 Contacto: fannydesignstyle@outlook.com
📞 Teléfono: 951 743 9204
✅ Estructura base con React, Firebase y Tailwind" || echo "No hay cambios nuevos"

# Configurar URL SSH del repositorio
REPO_URL="git@github.com:Fannydesignstyle/Transparencia-conectada.portalclaro.git"

# Conectar con GitHub
echo "🔗 Conectando con GitHub vía SSH..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

# Verificar si el repositorio remoto existe
echo "🔍 Verificando repositorio remoto..."
if git ls-remote "$REPO_URL" HEAD > /dev/null 2>&1; then
    echo "✅ Repositorio remoto verificado"
else
    echo "⚠️  El repositorio remoto no existe o no tienes acceso"
    echo "💡 Crea el repositorio en GitHub:"
    echo "   https://github.com/new"
    echo "   Nombre: Transparencia-conectada.portalclaro"
    echo "   No inicialices con README, .gitignore o licencia"
    echo ""
    read -p "¿Ya creaste el repositorio? (s/n): " repo_creado
    if [ "$repo_creado" != "s" ] && [ "$repo_creado" != "S" ]; then
        echo "📌 Crea el repositorio y vuelve a ejecutar este script"
        exit 1
    fi
fi

# Subir el proyecto
echo "🚀 Subiendo proyecto a GitHub..."
git branch -M main

if git push -u origin main; then
    echo ""
    echo "🎉 ¡FELICIDADES! PROYECTO SUBIDO CON ÉXITO VIA SSH"
    echo "==============================================="
    echo "✅ Configuración SSH completada"
    echo "✅ Proyecto subido a GitHub"
    echo "✅ Listo para Codespaces y producción"
    echo ""
    echo "💻 PARA ABRIR EN GITHUB CODESPACES:"
    echo "   https://github.com/Fannydesignstyle/Transparencia-conectada.portalclaro"
    echo "   Haz clic en '<> Code' → 'Codespaces' → 'Create codespace'"
    echo ""
    echo "🌐 PARA DESPLEGAR EN VERCEL:"
    echo "   https://vercel.com/import/git"
    echo ""
    echo "🔐 TUS CLAVES SSH ESTÁN EN: ~/.ssh/"
    echo "   - Privada: id_rsa"
    echo "   - Pública: id_rsa.pub"
    echo ""
    echo "📌 RECORDATORIO DE SEGURIDAD:"
    echo "   - Nunca compartas tu clave privada (id_rsa)"
    echo "   - Si pierdes acceso, genera una nueva clave"
    echo "   - Administra tus claves en: https://github.com/settings/keys"
else
    echo ""
    echo "❌ ERROR AL SUBIR EL PROYECTO"
    echo "💡 Soluciones:"
    echo "   1. Verifica que el repositorio existe en GitHub"
    echo "   2. Verifica que la clave SSH está correctamente configurada"
    echo "   3. Verifica permisos del repositorio"
    echo "   4. Intenta de nuevo con: git push -u origin main"
    exit 1
fi

# Crear archivo de recordatorio
cat > ~/RECORDATORIO-SSH-TRANSparencia.txt << EOL
🚀 TRANSparencia CONECTADA - CONFIGURACIÓN SSH COMPLETA

👩‍💼 Fundadora: Estefanía Pérez Vázquez
🏢 Agencia: Fanny Design Style
📧 Contacto: fannydesignstyle@outlook.com
📞 Teléfono: 951 743 9204

✅ CONFIGURACIÓN SSH EXITOSA
🔑 Clave pública: ~/.ssh/id_rsa.pub
🔒 Clave privada: ~/.ssh/id_rsa (¡NUNCA COMPARTIR!)

✅ PROYECTO EN GITHUB:
git@github.com:Fannydesignstyle/Transparencia-conectada.portalclaro.git

💻 ABRIR EN CODESPACES:
https://github.com/Fannydesignstyle/Transparencia-conectada.portalclaro

🌐 DESPLEGAR EN VERCEL:
https://vercel.com/import/git

🔧 COMANDOS ÚTILES:
- Ver estado: git status
- Actualizar: git pull
- Subir cambios: git push
- Ver ramas: git branch

🔒 GESTIÓN DE CLAVES SSH:
- Ver claves: https://github.com/settings/keys
- Agregar nueva: https://github.com/settings/keys/new
- Revocar clave: https://github.com/settings/keys

⚠️ IMPORTANTE: Si cambias de dispositivo, necesitarás configurar SSH nuevamente.
EOL

echo ""
echo "📄 Guía completa guardada en: ~/RECORDATORIO-SSH-TRANSparencia.txt"
echo "💡 Usa: cat ~/RECORDATORIO-SSH-TRANSparencia.txt"
echo ""
echo "🎉 ¡FELICIDADES! Tu proyecto está ahora en la nube con autenticación SSH segura"
echo "👩‍💼 Fundadora: Estefanía Pérez Vázquez | 🏢 Agencia: Fanny Design Style"
