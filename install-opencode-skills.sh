#!/bin/bash

# ============================================================
# Instalador de Skills para OpenCode
# ============================================================

echo "🚀 Instalando skills en OpenCode..."
echo ""

# Crear directorios
mkdir -p .opencode/skills
mkdir -p .claude/skills
mkdir -p .agents/skills

echo "📁 Directorios creados:"
echo "  - .opencode/skills"
echo "  - .claude/skills"  
echo "  - .agents/skills"
echo ""

# Skills prioritarias del Dream Team
declare -a SKILLS=(
    # Core - Vercel
    "vercel-labs/agent-skills"
    "vercel-labs/skills"
    
    # Superpowers - Obra
    "obra/superpowers"
    
    # Frontend - Anthropic
    "anthropics/skills"
    
    # Utilidades
    "wshobson/agents"
    "antfu/skills"
    
    # Testing
    "expo/skills"
    
    # DevOps
    "supabase/agent-skills"
    "better-auth/skills"
)

TOTAL=${#SKILLS[@]}
CURRENT=0

echo "📦 Instalando $TOTAL skills prioritarias..."
echo ""

for skill in "${SKILLS[@]}"; do
    CURRENT=$((CURRENT + 1))
    echo "[$CURRENT/$TOTAL] Instalando: $skill"
    
    # Instalar en múltiples ubicaciones para compatibilidad
    npx skills add "$skill" 2>/dev/null || echo "  ⚠️  No se pudo instalar: $skill"
    
    echo ""
done

echo "✅ Instalación completada!"
echo ""
echo "📍 Ubicaciones:"
echo "  Global: ~/.config/opencode/skills/"
echo "  Proyecto: .opencode/skills/"
echo "  Claude: ~/.claude/skills/"
echo ""
echo "🎯 Las skills están listas para usar en OpenCode"
