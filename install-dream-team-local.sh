#!/bin/bash

# ============================================================
# Dream Team Skills Installer - Modo Proyecto (OpenCode Local)
# ============================================================
# Instala las skills del Dream Team en el directorio del proyecto:
# C:\Users\Admin\Desktop\ai-research-mr\.opencode\skills
# ============================================================

set -e

# Configuración
PROJECT_DIR="C:\Users\Admin\Desktop\ai-research-mr"
SKILLS_DIR="$PROJECT_DIR/.opencode/skills"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Banner
echo -e ""
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}║  ${CYAN}🚀 DREAM TEAM SKILLS - Instalador de Proyecto${NC}                ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║  ${CYAN}Instalando en modo proyecto (local)${NC}                         ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
echo -e ""

# Verificar directorio
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Error: No se encuentra el directorio del proyecto${NC}"
    echo -e "${YELLOW}$PROJECT_DIR${NC}"
    exit 1
fi

# Crear directorio de skills
echo -e "${BLUE}📁 Creando estructura de directorios...${NC}"
mkdir -p "$SKILLS_DIR"
echo -e "${GREEN}✓${NC} Directorio: ${CYAN}$SKILLS_DIR${NC}"
echo ""

# Skills del Dream Team a instalar
declare -A DREAM_TEAM_SKILLS
declare -A SKILL_CATEGORIES

# Agente 1: The Architect
SKILL_CATEGORIES["architect"]="🏗️ The Architect"
DREAM_TEAM_SKILLS["architecture-patterns"]="architect"
DREAM_TEAM_SKILLS["architecture-decision-records"]="architect"
DREAM_TEAM_SKILLS["api-design-principles"]="architect"
DREAM_TEAM_SKILLS["microservices-patterns"]="architect"
DREAM_TEAM_SKILLS["cqrs-implementation"]="architect"
DREAM_TEAM_SKILLS["event-store-design"]="architect"

# Agente 2: The Frontend Master
SKILL_CATEGORIES["frontend"]="🎨 The Frontend Master"
DREAM_TEAM_SKILLS["vercel-react-best-practices"]="frontend"
DREAM_TEAM_SKILLS["vercel-composition-patterns"]="frontend"
DREAM_TEAM_SKILLS["web-design-guidelines"]="frontend"
DREAM_TEAM_SKILLS["tailwind-design-system"]="frontend"
DREAM_TEAM_SKILLS["responsive-design"]="frontend"
DREAM_TEAM_SKILLS["nextjs-app-router-patterns"]="frontend"

# Agente 3: The Backend Beast
SKILL_CATEGORIES["backend"]="⚙️ The Backend Beast"
DREAM_TEAM_SKILLS["nodejs-backend-patterns"]="backend"
DREAM_TEAM_SKILLS["fastapi-templates"]="backend"
DREAM_TEAM_SKILLS["python-design-patterns"]="backend"
DREAM_TEAM_SKILLS["python-testing-patterns"]="backend"
DREAM_TEAM_SKILLS["async-python-patterns"]="backend"
DREAM_TEAM_SKILLS["postgresql-table-design"]="backend"
DREAM_TEAM_SKILLS["sql-optimization-patterns"]="backend"

# Agente 4: The DevOps Wizard
SKILL_CATEGORIES["devops"]="🚀 The DevOps Wizard"
DREAM_TEAM_SKILLS["github-actions-templates"]="devops"
DREAM_TEAM_SKILLS["k8s-manifest-generator"]="devops"
DREAM_TEAM_SKILLS["terraform-module-library"]="devops"
DREAM_TEAM_SKILLS["helm-chart-scaffolding"]="devops"
DREAM_TEAM_SKILLS["gitops-workflow"]="devops"
DREAM_TEAM_SKILLS["deployment-pipeline-design"]="devops"

# Agente 5: The QA Guardian
SKILL_CATEGORIES["qa"]="🛡️ The QA Guardian"
DREAM_TEAM_SKILLS["test-driven-development"]="qa"
DREAM_TEAM_SKILLS["e2e-testing-patterns"]="qa"
DREAM_TEAM_SKILLS["javascript-testing-patterns"]="qa"
DREAM_TEAM_SKILLS["python-testing-patterns"]="qa"
DREAM_TEAM_SKILLS["systematic-debugging"]="qa"

# Agente 6: The Data Alchemist
SKILL_CATEGORIES["data"]="🔮 The Data Alchemist"
DREAM_TEAM_SKILLS["ml-pipeline-workflow"]="data"
DREAM_TEAM_SKILLS["rag-implementation"]="data"
DREAM_TEAM_SKILLS["langchain-architecture"]="data"
DREAM_TEAM_SKILLS["vector-index-tuning"]="data"
DREAM_TEAM_SKILLS["airflow-dag-patterns"]="data"

# Agente 7: The Mobile Ninja
SKILL_CATEGORIES["mobile"]="📱 The Mobile Ninja"
DREAM_TEAM_SKILLS["vercel-react-native-skills"]="mobile"
DREAM_TEAM_SKILLS["react-native-architecture"]="mobile"
DREAM_TEAM_SKILLS["mobile-ios-design"]="mobile"
DREAM_TEAM_SKILLS["mobile-android-design"]="mobile"

# Agente 8: The Security Sentinel
SKILL_CATEGORIES["security"]="🔒 The Security Sentinel"
DREAM_TEAM_SKILLS["secrets-management"]="security"
DREAM_TEAM_SKILLS["k8s-security-policies"]="security"
DREAM_TEAM_SKILLS["sast-configuration"]="security"
DREAM_TEAM_SKILLS["solidity-security"]="security"

# Agente 9: The Performance Optimizer
SKILL_CATEGORIES["performance"]="⚡ The Performance Optimizer"
DREAM_TEAM_SKILLS["python-performance-optimization"]="performance"
DREAM_TEAM_SKILLS["cost-optimization"]="performance"
DREAM_TEAM_SKILLS["turborepo-caching"]="performance"

# Agente 10: The Full-Stack Generalist (Obra Superpowers)
SKILL_CATEGORIES["generalist"]="🌟 The Full-Stack Generalist"
DREAM_TEAM_SKILLS["brainstorming"]="generalist"
DREAM_TEAM_SKILLS["writing-plans"]="generalist"
DREAM_TEAM_SKILLS["executing-plans"]="generalist"
DREAM_TEAM_SKILLS["systematic-debugging"]="generalist"
DREAM_TEAM_SKILLS["requesting-code-review"]="generalist"
DREAM_TEAM_SKILLS["receiving-code-review"]="generalist"
DREAM_TEAM_SKILLS["finishing-a-development-branch"]="generalist"
DREAM_TEAM_SKILLS["dispatching-parallel-agents"]="generalist"
DREAM_TEAM_SKILLS["subagent-driven-development"]="generalist"
DREAM_TEAM_SKILLS["verification-before-completion"]="generalist"
DREAM_TEAM_SKILLS["writing-skills"]="generalist"
DREAM_TEAM_SKILLS["using-superpowers"]="generalist"

# Skills adicionales importantes
SKILL_CATEGORIES["extras"]="📦 Skills Adicionales"
DREAM_TEAM_SKILLS["design-system-patterns"]="extras"
DREAM_TEAM_SKILLS["accessibility-compliance"]="extras"
DREAM_TEAM_SKILLS["typescript-advanced-types"]="extras"
DREAM_TEAM_SKILLS["go-concurrency-patterns"]="extras"
DREAM_TEAM_SKILLS["rust-async-patterns"]="extras"

# Función para verificar si skill existe globalmente
copy_from_global() {
    local skill_name=$1
    local global_path="$HOME/.agents/skills/$skill_name"
    local target_path="$SKILLS_DIR/$skill_name"
    
    if [ -d "$global_path" ]; then
        cp -r "$global_path" "$target_path"
        return 0
    else
        return 1
    fi
}

# Función para instalar skill
install_skill() {
    local skill_name=$1
    local category=$2
    
    echo -e "  ${CYAN}→${NC} Instalando: ${YELLOW}$skill_name${NC}"
    
    # Intentar copiar desde instalación global
    if copy_from_global "$skill_name"; then
        echo -e "    ${GREEN}✓${NC} Copiado desde instalación global"
        return 0
    fi
    
    # Si no existe globalmente, intentar instalar con npx
    # Nota: npx skills no soporta --dir directamente, instalamos global y copiamos
    echo -e "    ${YELLOW}⚠${NC} No encontrado globalmente, omitiendo..."
    return 1
}

# Instalar skills por categoría
total_skills=${#DREAM_TEAM_SKILLS[@]}
current=0
installed=0
failed=0

echo -e "${BLUE}📦 Instalando $total_skills skills del Dream Team...${NC}"
echo ""

for category_key in "architect" "frontend" "backend" "devops" "qa" "data" "mobile" "security" "performance" "generalist" "extras"; do
    category_name="${SKILL_CATEGORIES[$category_key]}"
    
    echo -e "${MAGENTA}▸ $category_name${NC}"
    
    for skill_name in "${!DREAM_TEAM_SKILLS[@]}"; do
        if [ "${DREAM_TEAM_SKILLS[$skill_name]}" == "$category_key" ]; then
            current=$((current + 1))
            
            if install_skill "$skill_name" "$category_key"; then
                installed=$((installed + 1))
            else
                failed=$((failed + 1))
            fi
        fi
    done
    
    echo ""
done

# Crear archivo de configuración para OpenCode
echo -e "${BLUE}⚙️  Creando configuración de OpenCode...${NC}"

cat > "$PROJECT_DIR/opencode.json" << 'EOF'
{
  "agents": {
    "default": {
      "systemPrompt": "You are part of the Dream Team - an elite squad of 10 specialized AI agents. Use the available skills to provide expert-level assistance in your domain. Always follow best practices and consider the full context of the project."
    }
  },
  "permissions": {
    "skill": {
      "*": "allow"
    }
  }
}
EOF

echo -e "${GREEN}✓${NC} Configuración creada: ${CYAN}opencode.json${NC}"
echo ""

# Crear README del proyecto
cat > "$PROJECT_DIR/DREAM-TEAM-SETUP.md" << EOF
# 🚀 Dream Team - Configuración del Proyecto

## ✅ Skills Instaladas

**Ubicación:** \`.opencode/skills/\`
**Total:** $installed skills instaladas

## 👥 Agentes del Dream Team

### 🏗️ Agente 1: The Architect
Skills: architecture-patterns, microservices-patterns, api-design, cqrs

### 🎨 Agente 2: The Frontend Master  
Skills: react-best-practices, web-design, tailwind, responsive-design

### ⚙️ Agente 3: The Backend Beast
Skills: nodejs-patterns, fastapi, python-patterns, postgresql

### 🚀 Agente 4: The DevOps Wizard
Skills: github-actions, k8s, terraform, deployment-pipelines

### 🛡️ Agente 5: The QA Guardian
Skills: tdd, testing-patterns, debugging-strategies

### 🔮 Agente 6: The Data Alchemist
Skills: ml-pipelines, rag, langchain, vector-indexing

### 📱 Agente 7: The Mobile Ninja
Skills: react-native, ios-design, android-design

### 🔒 Agente 8: The Security Sentinel
Skills: secrets-mgmt, k8s-security, sast, solidity-security

### ⚡ Agente 9: The Performance Optimizer
Skills: python-performance, cost-optimization, turborepo

### 🌟 Agente 10: The Full-Stack Generalist
Skills: obra-superpowers (planning, debugging, code-review)

## 🎯 Uso

Las skills se cargan automáticamente cuando OpenCode detecta que son relevantes para tu tarea.

\`\`\`bash
# Iniciar OpenCode en este proyecto
opencode

# Las skills del Dream Team estarán disponibles automáticamente
\`\`\`

## 📂 Estructura

\`\`\`
$PROJECT_DIR/
├── .opencode/
│   └── skills/          ← Skills del Dream Team
├── opencode.json        ← Configuración de OpenCode
└── DREAM-TEAM-SETUP.md  ← Este archivo
\`\`\`

## 🔄 Actualizar Skills

Para actualizar o agregar más skills:

\`\`\`bash
# Ejecutar nuevamente el instalador
./install-dream-team-local.sh
\`\`\`

## 🆘 Soporte

Las skills proporcionan:
- Mejores prácticas de la industria
- Patrones de diseño probados
- Workflows optimizados
- Debugging sistemático
- Code review guidelines

EOF

echo -e "${GREEN}✓${NC} Documentación creada: ${CYAN}DREAM-TEAM-SETUP.md${NC}"
echo ""

# Resumen final
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}║  ${GREEN}✅ INSTALACIÓN COMPLETADA${NC}                                     ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Resumen:${NC}"
echo -e "  ${GREEN}✓${NC} Skills instaladas: ${GREEN}$installed${NC}"
echo -e "  ${RED}✗${NC} Skills omitidas: ${RED}$failed${NC}"
echo -e "  📁 Ubicación: ${CYAN}$SKILLS_DIR${NC}"
echo ""
echo -e "${BLUE}📄 Archivos creados:${NC}"
echo -e "  • ${CYAN}.opencode/skills/${NC} - Directorio con las skills"
echo -e "  • ${CYAN}opencode.json${NC} - Configuración de OpenCode"
echo -e "  • ${CYAN}DREAM-TEAM-SETUP.md${NC} - Documentación del proyecto"
echo ""
echo -e "${YELLOW}💡 Para usar las skills:${NC}"
echo -e "   1. Abre OpenCode en este proyecto"
echo -e "   2. Las skills se cargarán automáticamente"
echo -e "   3. El agente usará las mejores prácticas según el contexto"
echo ""
echo -e "${GREEN}🚀 Tu Dream Team está listo para trabajar!${NC}"
echo ""
