#!/bin/bash

# ============================================================
# Dream Team Extended - Skills Verificadas y Disponibles
# ============================================================
# Instala skills reales disponibles en skills.sh para:
# - Algoritmos y Ciencias de la Computación
# - Desarrollo de Videojuegos
# - Estadística y Data Science
# - LLMs e IA
# - Compresión y Optimización
# ============================================================

set -e

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

echo -e ""
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}║  ${CYAN}🚀 DREAM TEAM EXTENDED${NC}                                       ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║  ${CYAN}Skills Verificadas y Disponibles${NC}                             ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

mkdir -p "$SKILLS_DIR"

# ============================================================
# SKILLS REALES DISPONIBLES EN SKILLS.SH
# ============================================================

echo -e "${BLUE}📦 Instalando skills extendidas verificadas...${NC}"
echo ""

# Array de skills organizadas por categoría
declare -a ALGORITHM_SKILLS=(
    "anthropics/knowledge-work-plugins"     # data-exploration
)

declare -a GAME_DEV_SKILLS=(
    "sickn33/antigravity-awesome-skills"    # game-development
    "vudovn/antigravity-kit"                # game-development
    "rmyndharis/antigravity-skills"         # unity-developer
    "zate/cc-godot"                         # godot-development
    "wshobson/agents"                       # unity-ecs-patterns, godot-gdscript-patterns
)

declare -a STATISTICS_SKILLS=(
    "anthropics/knowledge-work-plugins"     # data-exploration
)

declare -a LLM_SKILLS=(
    "inference-sh/agent-skills"             # llm-models
    "1nf-sh/skills"                         # llm-models
    "itechmeat/llm-code"                    # skill-master
)

declare -a COMPRESSION_SKILLS=(
    # Las de compresión son menos comunes, usaremos recursos generales
)

# Función para instalar skill de un repositorio
install_repo_skills() {
    local repo=$1
    local category=$2
    
    echo -e "${CYAN}▸ Instalando de:${NC} $repo ($category)"
    
    # Instalar globalmente
    if npx skills add "$repo" --yes --global 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} Instalado globalmente"
        
        # Copiar al proyecto
        for skill_dir in "$HOME/.agents/skills/"*/; do
            if [ -d "$skill_dir" ]; then
                skill_name=$(basename "$skill_dir")
                if [ ! -d "$SKILLS_DIR/$skill_name" ]; then
                    cp -r "$skill_dir" "$SKILLS_DIR/" 2>/dev/null || true
                    echo -e "    ${GREEN}✓${NC} Copiado: $skill_name"
                fi
            fi
        done
        return 0
    else
        echo -e "  ${RED}✗${NC} No se pudo instalar"
        return 1
    fi
}

# Instalar skills por categoría
echo -e "${MAGENTA}📚 Categoría: Algoritmos y Data Science${NC}"
install_repo_skills "anthropics/knowledge-work-plugins" "Data Exploration"
echo ""

echo -e "${MAGENTA}🎮 Categoría: Game Development${NC}"
install_repo_skills "wshobson/agents" "Game Dev Patterns"
install_repo_skills "sickn33/antigravity-awesome-skills" "Game Dev"
install_repo_skills "zate/cc-godot" "Godot"
install_repo_skills "rmyndharis/antigravity-skills" "Unity"
echo ""

echo -e "${MAGENTA}🤖 Categoría: LLMs e IA${NC}"
install_repo_skills "inference-sh/agent-skills" "LLM Models"
install_repo_skills "itechmeat/llm-code" "LLM Code"
echo ""

# Crear skills personalizadas para lo que no existe
echo -e "${BLUE}🔧 Creando skills personalizadas...${NC}"

# Skill: Algorithm Design
cat > "$SKILLS_DIR/algorithm-design/SKILL.md" << 'EOF'
---
name: algorithm-design
description: Design and analyze efficient algorithms with focus on time/space complexity, data structures, and optimization techniques
---

# Algorithm Design

Expert guidance for designing, analyzing, and optimizing algorithms.

## Core Areas

### 1. Algorithm Analysis
- Time Complexity (Big-O notation)
- Space Complexity
- Best/Average/Worst case analysis
- Amortized analysis

### 2. Data Structures
- Arrays and Linked Lists
- Stacks and Queues
- Trees (Binary, BST, AVL, Red-Black)
- Graphs (Adjacency matrix/list)
- Hash Tables
- Heaps

### 3. Algorithm Paradigms
- Divide and Conquer
- Dynamic Programming
- Greedy Algorithms
- Backtracking
- Branch and Bound

### 4. Graph Algorithms
- BFS and DFS
- Shortest Path (Dijkstra, Bellman-Ford, Floyd-Warshall)
- Minimum Spanning Tree (Prim, Kruskal)
- Topological Sort
- Strongly Connected Components

### 5. Sorting and Searching
- Quick Sort, Merge Sort, Heap Sort
- Binary Search variations
- String matching (KMP, Rabin-Karp)

## Best Practices
1. Always analyze complexity before implementation
2. Consider trade-offs between time and space
3. Use appropriate data structures
4. Handle edge cases
5. Optimize only when necessary
EOF

# Skill: Game Development Advanced
cat > "$SKILLS_DIR/game-development-advanced/SKILL.md" << 'EOF'
---
name: game-development-advanced
description: Advanced game development patterns including ECS, game physics, AI, and multiplayer networking
---

# Game Development Advanced

Advanced patterns and techniques for professional game development.

## Core Systems

### 1. Entity Component System (ECS)
- Data-oriented design
- Component-based architecture
- System processing
- Memory layout optimization

### 2. Game Physics
- Collision detection
- Rigid body dynamics
- Physics engines (Box2D, PhysX)
- Ray casting

### 3. Game AI
- Pathfinding (A*, Dijkstra, NavMesh)
- Behavior trees
- State machines
- GOAP (Goal Oriented Action Planning)
- Flocking behaviors

### 4. Multiplayer Networking
- Client-server architecture
- Network prediction
- Lag compensation
- Entity interpolation
- Authoritative server

### 5. Graphics Programming
- Rendering pipeline
- Shaders (HLSL, GLSL)
- Lighting models
- Post-processing effects
- Optimization techniques

## Best Practices
1. Separate logic from presentation
2. Use object pooling for performance
3. Implement proper game loop
4. Profile early and often
5. Design for scalability
EOF

# Skill: Statistics and Probability
cat > "$SKILLS_DIR/statistics-probability/SKILL.md" << 'EOF'
---
name: statistics-probability
description: Statistical analysis, descriptive statistics, hypothesis testing, and probability theory for data analysis
---

# Statistics and Probability

Comprehensive guide for statistical analysis and probability theory.

## Descriptive Statistics

### 1. Measures of Central Tendency
- Mean (arithmetic, geometric, harmonic)
- Median
- Mode
- Quantiles (quartiles, percentiles)

### 2. Measures of Dispersion
- Range
- Variance and Standard Deviation
- Interquartile Range (IQR)
- Mean Absolute Deviation

### 3. Distribution Shape
- Skewness
- Kurtosis
- Histograms
- Box plots

## Probability Theory

### 1. Basic Concepts
- Random variables
- Probability distributions
- Conditional probability
- Bayes' theorem

### 2. Common Distributions
- Normal/Gaussian
- Binomial
- Poisson
- Exponential
- Uniform

## Statistical Inference

### 1. Hypothesis Testing
- Null and alternative hypotheses
- Type I and Type II errors
- p-values
- Confidence intervals
- t-tests, z-tests
- Chi-square tests
- ANOVA

### 2. Regression Analysis
- Linear regression
- Correlation
- R-squared
- Residual analysis

## Best Practices
1. Always visualize data first
2. Check assumptions before tests
3. Report effect sizes, not just p-values
4. Handle missing data appropriately
5. Consider multiple testing corrections
EOF

# Skill: LLM Engineering
cat > "$SKILLS_DIR/llm-engineering/SKILL.md" << 'EOF'
---
name: llm-engineering
description: Design, train, and optimize Large Language Models including transformers, fine-tuning, and deployment
---

# LLM Engineering

Comprehensive guide for working with Large Language Models.

## Architecture

### 1. Transformer Architecture
- Attention mechanisms
- Self-attention
- Multi-head attention
- Positional encoding
- Encoder-decoder structure

### 2. Model Types
- GPT (Decoder-only)
- BERT (Encoder-only)
- T5 (Encoder-decoder)
- Mixture of Experts (MoE)

## Training

### 1. Pre-training
- Tokenization (BPE, WordPiece, SentencePiece)
- Masked language modeling
- Autoregressive modeling
- Training at scale

### 2. Fine-tuning
- Supervised Fine-Tuning (SFT)
- RLHF (Reinforcement Learning from Human Feedback)
- LoRA and QLoRA
- Full fine-tuning vs PEFT

## Optimization

### 1. Inference Optimization
- Quantization (INT8, INT4)
- KV-cache optimization
- Batch processing
- Streaming generation

### 2. Model Compression
- Knowledge distillation
- Pruning
- Weight sharing
- Efficient architectures

## Advanced Techniques

### 1. RAG (Retrieval-Augmented Generation)
- Vector databases
- Embedding models
- Chunking strategies
- Re-ranking

### 2. Prompt Engineering
- Chain-of-thought
- Few-shot prompting
- System prompts
- Prompt templates

### 3. Evaluation
- Perplexity
- BLEU, ROUGE scores
- Human evaluation
- Benchmarks (MMLU, HellaSwag, etc.)

## Best Practices
1. Start with pre-trained models
2. Use appropriate context lengths
3. Monitor for hallucinations
4. Implement safety measures
5. Consider computational costs
EOF

# Skill: Data Compression
cat > "$SKILLS_DIR/data-compression/SKILL.md" << 'EOF'
---
name: data-compression
description: Algorithms and techniques for lossless and lossy data compression including text, image, and video compression
---

# Data Compression

Expert guide for data compression algorithms and techniques.

## Lossless Compression

### 1. Dictionary-Based
- LZ77 and LZ78
- LZW (Lempel-Ziv-Welch)
- DEFLATE (gzip, zip)
- Zstandard (zstd)

### 2. Statistical Methods
- Huffman coding
- Arithmetic coding
- Range coding
- Asymmetric numeral systems (ANS)

### 3. Modern Algorithms
- LZ4 (speed optimized)
- Brotli
- Bzip2
- 7z

## Lossy Compression

### 1. Image Compression
- JPEG (DCT-based)
- JPEG 2000 (wavelet-based)
- WebP
- AVIF
- Compression ratios and quality trade-offs

### 2. Video Compression
- H.264/AVC
- H.265/HEVC
- AV1
- VP9
- Keyframes and inter-frame compression

### 3. Audio Compression
- MP3
- AAC
- Ogg Vorbis
- Opus
- Psychoacoustic models

## Text Compression
- Burrows-Wheeler Transform (BWT)
- Move-to-front transform
- Prediction by Partial Matching (PPM)
- Context mixing

## Best Practices
1. Choose algorithm based on data type
2. Balance compression ratio vs speed
3. Consider streaming for large data
4. Test decompression integrity
5. Use standard formats for interoperability
EOF

mkdir -p "$SKILLS_DIR/algorithm-design"
mkdir -p "$SKILLS_DIR/game-development-advanced"
mkdir -p "$SKILLS_DIR/statistics-probability"
mkdir -p "$SKILLS_DIR/llm-engineering"
mkdir -p "$SKILLS_DIR/data-compression"

# Copiar los archivos (ya creados arriba)
echo -e "  ${GREEN}✓${NC} Skill personalizada: algorithm-design"
echo -e "  ${GREEN}✓${NC} Skill personalizada: game-development-advanced"
echo -e "  ${GREEN}✓${NC} Skill personalizada: statistics-probability"
echo -e "  ${GREEN}✓${NC} Skill personalizada: llm-engineering"
echo -e "  ${GREEN}✓${NC} Skill personalizada: data-compression"

echo ""

# Crear perfiles de agentes extendidos
echo -e "${BLUE}📝 Creando perfiles de agentes extendidos...${NC}"

# Crear directorio para agentes extendidos
mkdir -p "$PROJECT_DIR/agents-extended"

cat > "$PROJECT_DIR/agents-extended/AGENT-11-ALGORITHM-MASTER.md" << 'EOF'
# 🧮 AGENTE 11: The Algorithm Master

## Rol
Especialista en diseño y análisis de algoritmos

## Especialización
- Diseño de algoritmos eficientes
- Análisis de complejidad (Big-O)
- Estructuras de datos avanzadas
- Optimización de código
- Programación competitiva

## Skills Disponibles
- algorithm-design (personalizada)
- data-exploration (de Anthropics)

## Cuándo Usar
- "Optimiza este algoritmo"
- "Diseña una solución eficiente"
- "Análisis de complejidad"
- "Estructuras de datos"
EOF

cat > "$PROJECT_DIR/agents-extended/AGENT-12-GAME-ARCHITECT.md" << 'EOF'
# 🎮 AGENTE 12: The Game Architect

## Rol
Arquitecto de Videojuegos Avanzado

## Especialización
- Unity, Unreal Engine, Godot
- ECS (Entity Component System)
- Física de juegos
- Game AI (pathfinding, behavior trees)
- Multiplayer networking
- Optimización de juegos

## Skills Disponibles
- game-development-advanced (personalizada)
- unity-ecs-patterns
- godot-gdscript-patterns
- godot-development
- unity-developer

## Cuándo Usar
- "Crea un juego en Unity/Godot"
- "Implementa pathfinding AI"
- "Sistema de físicas"
- "Multiplayer networking"
EOF

cat > "$PROJECT_DIR/agents-extended/AGENT-13-STATISTICS-SAGE.md" << 'EOF'
# 📊 AGENTE 13: The Statistics Sage

## Rol
Experto en Estadística y Análisis de Datos

## Especialización
- Estadística descriptiva
- Probabilidad
- Tests de hipótesis
- Análisis de regresión
- Inferencia estadística
- Visualización de datos

## Skills Disponibles
- statistics-probability (personalizada)
- data-exploration

## Cuándo Usar
- "Analiza estos datos estadísticamente"
- "Calcula métricas descriptivas"
- "Test de hipótesis"
- "Regresión y correlación"
EOF

cat > "$PROJECT_DIR/agents-extended/AGENT-14-LLM-ENGINEER.md" << 'EOF'
# 🤖 AGENTE 14: The LLM Engineer

## Rol
Ingeniero de Modelos de Lenguaje (LLMs)

## Especialización
- Arquitectura Transformer
- Fine-tuning de LLMs
- Prompt engineering
- RAG (Retrieval-Augmented Generation)
- Evaluación de modelos
- Compresión y optimización

## Skills Disponibles
- llm-engineering (personalizada)
- llm-models
- skill-master
- rag-implementation (ya instalada)

## Cuándo Usar
- "Diseña un modelo de lenguaje"
- "Fine-tuning de LLMs"
- "Implementa RAG"
- "Optimiza prompts"
- "Evalúa modelos"
EOF

cat > "$PROJECT_DIR/agents-extended/AGENT-15-COMPRESSION-EXPERT.md" << 'EOF'
# 🗜️ AGENTE 15: The Compression Expert

## Rol
Experto en Compresión de Datos

## Especialización
- Algoritmos de compresión lossless/lossy
- Compresión de imágenes (JPEG, WebP, AVIF)
- Compresión de video (H.264, H.265, AV1)
- Compresión de texto
- Streaming compression
- Optimización de storage

## Skills Disponibles
- data-compression (personalizada)

## Cuándo Usar
- "Comprime estos datos"
- "Optimiza imágenes/video"
- "Algoritmos de compresión"
- "Streaming compression"
EOF

echo -e "${GREEN}✓${NC} Perfiles creados en agents-extended/"
echo ""

# Actualizar README
cat >> "$PROJECT_DIR/DREAM-TEAM-SETUP.md" << 'EOF'

---

## 🆕 AGENTES EXTENDIDOS (15 Total)

### 11. 🧮 The Algorithm Master
**Rol:** Especialista en Algoritmos y Estructuras de Datos  
**Skills:** algorithm-design, data-exploration  
**Uso:** Optimización, complejidad, diseño de algoritmos

### 12. 🎮 The Game Architect  
**Rol:** Arquitecto de Videojuegos Avanzado  
**Skills:** game-development-advanced, unity-ecs-patterns, godot-development  
**Uso:** Unity, Godot, físicas, AI, multiplayer

### 13. 📊 The Statistics Sage
**Rol:** Experto en Estadística Descriptiva  
**Skills:** statistics-probability, data-exploration  
**Uso:** Análisis estadístico, tests, inferencia

### 14. 🤖 The LLM Engineer
**Rol:** Ingeniero de Modelos de Lenguaje  
**Skills:** llm-engineering, llm-models, rag-implementation  
**Uso:** Transformers, fine-tuning, RAG, evaluación

### 15. 🗜️ The Compression Expert
**Rol:** Experto en Compresión de Datos  
**Skills:** data-compression  
**Uso:** Algoritmos, imágenes, video, streaming

---

## 📊 Resumen Total del Dream Team

**15 Agentes Especializados:**
1. 🏗️ The Architect
2. 🎨 The Frontend Master
3. ⚙️ The Backend Beast
4. 🚀 The DevOps Wizard
5. 🛡️ The QA Guardian
6. 🔮 The Data Alchemist
7. 📱 The Mobile Ninja
8. 🔒 The Security Sentinel
9. ⚡ The Performance Optimizer
10. 🌟 The Generalist
11. 🧮 The Algorithm Master *(nuevo)*
12. 🎮 The Game Architect *(nuevo)*
13. 📊 The Statistics Sage *(nuevo)*
14. 🤖 The LLM Engineer *(nuevo)*
15. 🗜️ The Compression Expert *(nuevo)*

**Total Skills:** 61+ originales + 5 personalizadas + skills de repos adicionales
EOF

echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}║  ${GREEN}✅ DREAM TEAM EXTENDED COMPLETADO${NC}                            ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Resumen:${NC}"
echo -e "  👥 Total de agentes: ${CYAN}15${NC}"
echo -e "  📦 Skills originales: ${CYAN}61${NC}"
echo -e "  🔧 Skills personalizadas: ${CYAN}5${NC}"
echo -e "  📚 Skills de repos adicionales: ${CYAN}varias${NC}"
echo ""
echo -e "${BLUE}📁 Estructura:${NC}"
echo -e "  ${CYAN}.opencode/skills/${NC} - Todas las skills disponibles"
echo -e "  ${CYAN}agents-extended/${NC} - Perfiles de agentes 11-15"
echo -e "  ${CYAN}DREAM-TEAM-SETUP.md${NC} - Documentación completa"
echo ""
echo -e "${YELLOW}🆕 Skills personalizadas creadas:${NC}"
echo -e "  • algorithm-design - Diseño de algoritmos"
echo -e "  • game-development-advanced - Game dev avanzado"
echo -e "  • statistics-probability - Estadística"
echo -e "  • llm-engineering - Modelos de lenguaje"
echo -e "  • data-compression - Compresión de datos"
echo ""
echo -e "${GREEN}🚀 Tu Dream Team ahora tiene 15 agentes especializados!${NC}"
echo ""
