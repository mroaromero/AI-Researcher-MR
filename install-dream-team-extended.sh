#!/bin/bash

# ============================================================
# Dream Team Extended - Especialistas Adicionales
# ============================================================
# Agrega especialistas en:
# - Diseño de Algoritmos
# - Desarrollo de Videojuegos Avanzado
# - Estadística Descriptiva
# - Modelos de Lenguaje (LLMs)
# - Compresión de Datos
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
echo -e "${MAGENTA}║  ${CYAN}🚀 DREAM TEAM EXTENDED${NC}                                       ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║  ${CYAN}Especialistas Adicionales${NC}                                    ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
echo -e ""

# Verificar directorio
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Error: No se encuentra el directorio del proyecto${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Proyecto:${NC} $PROJECT_DIR"
echo -e "${BLUE}📂 Skills:${NC} $SKILLS_DIR"
echo ""

# ============================================================
# NUEVOS AGENTES ESPECIALIZADOS
# ============================================================

declare -A NEW_AGENTS
declare -A NEW_SKILLS

# Agente 11: The Algorithm Master (Diseño de Algoritmos)
NEW_AGENTS["algorithm-master"]="🧮 The Algorithm Master"
NEW_SKILLS["algorithm-master"]="
data-structures-and-algorithms
competitive-programming
algorithm-optimization
complexity-analysis
graph-algorithms
dynamic-programming
sorting-algorithms
search-algorithms
"

# Agente 12: The Game Architect (Desarrollo de Videojuegos Avanzado)
NEW_AGENTS["game-architect"]="🎮 The Game Architect"
NEW_SKILLS["game-architect"]="
game-development
unity-development
unreal-engine
godot-development
game-design-patterns
game-physics
game-ai
multiplayer-networking
"

# Agente 13: The Statistics Sage (Estadística Descriptiva)
NEW_AGENTS["statistics-sage"]="📊 The Statistics Sage"
NEW_SKILLS["statistics-sage"]="
data-exploration
descriptive-statistics
statistical-analysis
probability-theory
hypothesis-testing
bayesian-statistics
experimental-design
"

# Agente 14: The LLM Engineer (Modelos de Lenguaje)
NEW_AGENTS["llm-engineer"]="🤖 The LLM Engineer"
NEW_SKILLS["llm-engineer"]="
llm-models
transformer-architecture
fine-tuning-llms
prompt-engineering
rag-implementation
vector-databases
llm-evaluation
model-compression
"

# Agente 15: The Compression Expert (Compresión de Datos)
NEW_AGENTS["compression-expert"]="🗜️ The Compression Expert"
NEW_SKILLS["compression-expert"]="
data-compression
lossless-compression
lossy-compression
image-compression
video-compression
text-compression
compression-algorithms
"

# Función para instalar skill
install_skill_extended() {
    local skill_name=$1
    local agent_name=$2
    
    echo -e "  ${CYAN}→${NC} Instalando: ${YELLOW}$skill_name${NC}"
    
    # Verificar si ya existe localmente
    if [ -d "$SKILLS_DIR/$skill_name" ]; then
        echo -e "    ${GREEN}✓${NC} Ya existe localmente"
        return 0
    fi
    
    # Verificar si existe en instalación global
    if [ -d "$HOME/.agents/skills/$skill_name" ]; then
        cp -r "$HOME/.agents/skills/$skill_name" "$SKILLS_DIR/"
        echo -e "    ${GREEN}✓${NC} Copiado desde instalación global"
        return 0
    fi
    
    # Intentar instalar con npx
    echo -e "    ${YELLOW}⚠${NC} Intentando instalar desde skills.sh..."
    npx skills add "$skill_name" --yes --global 2>/dev/null || true
    
    # Verificar si se instaló globalmente
    if [ -d "$HOME/.agents/skills/$skill_name" ]; then
        cp -r "$HOME/.agents/skills/$skill_name" "$SKILLS_DIR/"
        echo -e "    ${GREEN}✓${NC} Instalado y copiado"
        return 0
    fi
    
    echo -e "    ${RED}✗${NC} No disponible en skills.sh"
    return 1
}

# Instalar skills por agente
total_new_skills=0
for agent_key in "${!NEW_AGENTS[@]}"; do
    agent_skills="${NEW_SKILLS[$agent_key]}"
    skill_count=$(echo "$agent_skills" | grep -v "^$" | wc -l)
    total_new_skills=$((total_new_skills + skill_count))
done

echo -e "${BLUE}📦 Instalando $total_new_skills skills para 5 nuevos agentes...${NC}"
echo ""

installed_count=0
failed_count=0

for agent_key in "algorithm-master" "game-architect" "statistics-sage" "llm-engineer" "compression-expert"; do
    agent_name="${NEW_AGENTS[$agent_key]}"
    
    echo -e "${MAGENTA}▸ $agent_name${NC}"
    
    # Leer skills para este agente
    IFS=$'\n' read -d '' -ra skills_array <<< "${NEW_SKILLS[$agent_key]}"
    
    for skill in "${skills_array[@]}"; do
        # Limpiar skill name
        skill=$(echo "$skill" | tr -d '[:space:]')
        
        if [ -n "$skill" ]; then
            if install_skill_extended "$skill" "$agent_name"; then
                installed_count=$((installed_count + 1))
            else
                failed_count=$((failed_count + 1))
            fi
        fi
    done
    
    echo ""
done

# Crear perfiles de agentes
echo -e "${BLUE}📝 Creando perfiles de agentes...${NC}"

# Agente 11: The Algorithm Master
cat > "$PROJECT_DIR/AGENT-11-ALGORITHM-MASTER.md" << 'EOF'
# 🧮 AGENTE 11: The Algorithm Master

## Especialización
Diseño y análisis de algoritmos, estructuras de datos, optimización

## Skills
- Data Structures & Algorithms
- Competitive Programming
- Algorithm Optimization
- Complexity Analysis (Big-O)
- Graph Algorithms
- Dynamic Programming
- Sorting & Search Algorithms

## Cuándo Usar
- "Optimiza este algoritmo"
- "Diseña una solución eficiente"
- "Análisis de complejidad"
- "Problemas de grafos"
- "Programación dinámica"
EOF

# Agente 12: The Game Architect
cat > "$PROJECT_DIR/AGENT-12-GAME-ARCHITECT.md" << 'EOF'
# 🎮 AGENTE 12: The Game Architect

## Especialización
Desarrollo avanzado de videojuegos, motores gráficos, diseño de juegos

## Skills
- Game Development (Unity, Unreal, Godot)
- Game Design Patterns
- Game Physics
- Game AI (pathfinding, behavior trees)
- Multiplayer Networking
- Game Optimization
- ECS (Entity Component System)

## Cuándo Usar
- "Crea un juego en Unity/Godot"
- "Implementa pathfinding AI"
- "Sistema de físicas"
- "Multiplayer networking"
- "Optimización de juegos"
EOF

# Agente 13: The Statistics Sage
cat > "$PROJECT_DIR/AGENT-13-STATISTICS-SAGE.md" << 'EOF'
# 📊 AGENTE 13: The Statistics Sage

## Especialización
Estadística descriptiva, análisis de datos, probabilidad

## Skills
- Data Exploration
- Descriptive Statistics
- Statistical Analysis
- Probability Theory
- Hypothesis Testing
- Bayesian Statistics
- Experimental Design

## Cuándo Usar
- "Analiza estos datos estadísticamente"
- "Calcula métricas descriptivas"
- "Test de hipótesis"
- "Inferencia estadística"
- "Diseño de experimentos"
EOF

# Agente 14: The LLM Engineer
cat > "$PROJECT_DIR/AGENT-14-LLM-ENGINEER.md" << 'EOF'
# 🤖 AGENTE 14: The LLM Engineer

## Especialización
Diseño, entrenamiento y optimización de modelos de lenguaje

## Skills
- LLM Models & Architecture
- Transformer Architecture
- Fine-tuning LLMs
- Prompt Engineering
- RAG Implementation
- Vector Databases
- LLM Evaluation
- Model Compression

## Cuándo Usar
- "Diseña un modelo de lenguaje"
- "Fine-tuning de LLMs"
- "Implementa RAG"
- "Optimiza prompts"
- "Evaluación de modelos"
- "Compresión de modelos"
EOF

# Agente 15: The Compression Expert
cat > "$PROJECT_DIR/AGENT-15-COMPRESSION-EXPERT.md" << 'EOF'
# 🗜️ AGENTE 15: The Compression Expert

## Especialización
Compresión de datos, algoritmos de compresión, optimización de storage

## Skills
- Data Compression (lossless/lossy)
- Image Compression
- Video Compression
- Text Compression
- Compression Algorithms (gzip, zstd, lz4)
- Dictionary Compression
- Streaming Compression

## Cuándo Usar
- "Comprime estos datos"
- "Optimiza el tamaño de archivos"
- "Streaming compression"
- "Compresión de imágenes/video"
- "Algoritmos de compresión"
EOF

echo -e "${GREEN}✓${NC} Perfiles de agentes creados"
echo ""

# Actualizar README principal
cat >> "$PROJECT_DIR/DREAM-TEAM-SETUP.md" << EOF

---

## 🆕 AGENTES EXTENDIDOS (Nuevos)

### 11. 🧮 The Algorithm Master
**Skills:** Algoritmos, estructuras de datos, optimización, complejidad

### 12. 🎮 The Game Architect
**Skills:** Unity, Unreal, Godot, game physics, AI, multiplayer

### 13. 📊 The Statistics Sage
**Skills:** Estadística descriptiva, análisis, probabilidad, tests

### 14. 🤖 The LLM Engineer
**Skills:** Transformers, fine-tuning, RAG, evaluación, compresión

### 15. 🗜️ The Compression Expert
**Skills:** Compresión lossless/lossy, imágenes, video, streaming

**Total Dream Team:** 15 Agentes Especializados
EOF

echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}║  ${GREEN}✅ INSTALACIÓN COMPLETADA${NC}                                     ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Resumen:${NC}"
echo -e "  ${GREEN}✓${NC} Nuevas skills instaladas: ${GREEN}$installed_count${NC}"
echo -e "  ${RED}✗${NC} Skills no disponibles: ${RED}$failed_count${NC}"
echo -e "  👥 Total de agentes: ${CYAN}15${NC} (10 originales + 5 nuevos)"
echo ""
echo -e "${BLUE}📄 Archivos creados:${NC}"
echo -e "  • AGENT-11-ALGORITHM-MASTER.md"
echo -e "  • AGENT-12-GAME-ARCHITECT.md"
echo -e "  • AGENT-13-STATISTICS-SAGE.md"
echo -e "  • AGENT-14-LLM-ENGINEER.md"
echo -e "  • AGENT-15-COMPRESSION-EXPERT.md"
echo ""
echo -e "${YELLOW}💡 Nota:${NC} Algunas skills pueden no estar disponibles en skills.sh"
echo -e "   pero las que existen han sido instaladas correctamente."
echo ""
echo -e "${GREEN}🚀 Tu Dream Team ahora tiene 15 agentes especializados!${NC}"
echo ""
