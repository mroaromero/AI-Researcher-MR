#!/bin/bash

# ============================================================
# 🚀 SETUP DREAM TEAM - 10 Agentes Especializados
# ============================================================
# Script automatizado para configurar un equipo de 10 agentes
# con skills especializadas según el modelo "Dream Team"
# ============================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Directorio base
BASE_DIR="${1:-./dream-team}"
PYTHON_SCRIPT="./install-all-tech-skills.py"

# Verificar que existe el script Python
if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo -e "${RED}Error: No se encuentra $PYTHON_SCRIPT${NC}"
    echo "Asegúrate de tener el script install-all-tech-skills.py en el directorio actual"
    exit 1
fi

# Contadores
TOTAL_AGENTS=10
CURRENT_AGENT=0

# Función para mostrar progreso
show_progress() {
    local agent_num=$1
    local agent_name=$2
    local percent=$((agent_num * 100 / TOTAL_AGENTS))
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Agente $agent_num/$TOTAL_AGENTS [$percent%]${NC}"
    echo -e "${YELLOW}$agent_name${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Función para instalar skills de un agente
setup_agent() {
    local agent_num=$1
    local agent_dir=$2
    shift 2
    local categories=("$@")
    
    mkdir -p "$agent_dir"
    
    echo -e "${CYAN}📁 Directorio:${NC} $agent_dir"
    echo -e "${CYAN}📚 Instalando skills...${NC}"
    
    for category in "${categories[@]}"; do
        echo -e "  ${YELLOW}→ $category${NC}"
        python "$PYTHON_SCRIPT" --category "$category" --dir "$agent_dir" --workers 3 || true
    done
    
    echo -e "${GREEN}✅ Agente $agent_num configurado${NC}"
}

# Banner inicial
echo -e ""
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                            ║${NC}"
echo -e "${MAGENTA}║  ${CYAN}🚀 CONFIGURACIÓN DEL DREAM TEAM${NC}                            ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║  ${CYAN}10 Agentes Especializados - 408+ Skills${NC}                   ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║                                                            ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
echo -e ""
echo -e "${YELLOW}📂 Directorio base:${NC} $BASE_DIR"
echo -e "${YELLOW}⏱️  Tiempo estimado:${NC} 20-40 minutos"
echo -e ""

# Crear directorio base
mkdir -p "$BASE_DIR"

# ============================================================
# AGENTE 1: THE ARCHITECT 🏗️
# ============================================================
CURRENT_AGENT=1
show_progress $CURRENT_AGENT "🏗️ AGENTE 1: The Architect (Arquitecto de Software)"
echo -e "${CYAN}🎯 Rol:${NC} Diseña sistemas escalables y toma decisiones tecnológicas"
echo -e "${CYAN}📋 Skills:${NC} Architecture Patterns, System Design, Microservices"
echo ""

setup_agent $CURRENT_AGENT "$BASE_DIR/agent-01-architect" \
    "wshobson-patterns" \
    "specialized-tech"

# Crear README específico del agente
cat > "$BASE_DIR/agent-01-architect/AGENT-PROFILE.md" << 'EOF'
# 🏗️ AGENTE 1: The Architect

## Rol
Arquitecto de Software - Diseña sistemas escalables y define la arquitectura técnica

## Responsabilidades
- Diseño de arquitectura de sistemas
- Toma de decisiones tecnológicas
- Definición de patrones y estándares
- Revisión de diseños de otros agentes
- Documentación arquitectónica

## Skills Clave
- Architecture Patterns
- API Design Principles
- System Design
- Microservices Patterns (CQRS, Saga, Event-Driven)
- Database Design
- Next.js App Router Patterns

## Cuándo Usar
- "Necesito diseñar un sistema escalable"
- "¿Qué arquitectura deberíamos usar?"
- "Revisa este diseño técnico"
- "Define los patrones para el proyecto"
EOF

# ============================================================
# AGENTE 2: THE FRONTEND MASTER 🎨
# ============================================================
CURRENT_AGENT=2
show_progress $CURRENT_AGENT "🎨 AGENTE 2: The Frontend Master (Especialista Frontend)"
echo -e "${CYAN}🎯 Rol:${NC} Crea experiencias de usuario excepcionales"
echo -e "${CYAN}📋 Skills:${NC} React, Vue, TypeScript, UI/UX, Design Systems"
echo ""

setup_agent $CURRENT_AGENT "$BASE_DIR/agent-02-frontend" \
    "frontend-core" \
    "antfu-ecosystem" \
    "vue-specialized"

cat > "$BASE_DIR/agent-02-frontend/AGENT-PROFILE.md" << 'EOF'
# 🎨 AGENTE 2: The Frontend Master

## Rol
Especialista Frontend - Crea interfaces de usuario excepcionales

## Responsabilidades
- Desarrollo de UI/UX
- Componentes reutilizables
- Gestión de estado
- Performance frontend
- Diseño responsive
- Accesibilidad

## Skills Clave
- React Best Practices
- Next.js (todas las variantes)
- Vue/Nuxt
- TypeScript Advanced
- Tailwind Design System
- Web Design Guidelines
- Responsive Design
- Canvas Design

## Cuándo Usar
- "Necesito crear un componente React"
- "Optimiza esta interfaz"
- "Haz que sea responsive"
- "Mejora el UX de esta página"
EOF

# ============================================================
# AGENTE 3: THE BACKEND BEAST ⚙️
# ============================================================
CURRENT_AGENT=3
show_progress $CURRENT_AGENT "⚙️ AGENTE 3: The Backend Beast (Especialista Backend)"
echo -e "${CYAN}🎯 Rol:${NC} Construye APIs robustas y escalables"
echo -e "${CYAN}📋 Skills:${NC} Node.js, Python, Go, Java, APIs, Bases de datos"
echo ""

setup_agent $CURRENT_AGENT "$BASE_DIR/agent-03-backend" \
    "backend-core" \
    "languages-frameworks"

cat > "$BASE_DIR/agent-03-backend/AGENT-PROFILE.md" << 'EOF'
# ⚙️ AGENTE 3: The Backend Beast

## Rol
Especialista Backend - Construye APIs robustas y escalables

## Responsabilidades
- APIs REST y GraphQL
- Lógica de negocio
- Bases de datos
- Autenticación y autorización
- Integraciones de terceros
- Microservicios backend

## Skills Clave
- Node.js Backend Patterns
- FastAPI Templates
- API Design Principles
- PostgreSQL Table Design
- NestJS Best Practices
- Go Development & Microservices
- Java Spring Boot
- GraphQL (Apollo, Hasura)

## Cuándo Usar
- "Necesito crear una API"
- "Diseña el modelo de datos"
- "Implementa autenticación"
- "Crea un microservicio"
EOF

# ============================================================
# AGENTE 4: THE DEVOPS WIZARD 🚀
# ============================================================
CURRENT_AGENT=4
show_progress $CURRENT_AGENT "🚀 AGENTE 4: The DevOps Wizard (DevOps/Platform Engineer)"
echo -e "${CYAN}🎯 Rol:${NC} Gestiona infraestructura y CI/CD"
echo -e "${CYAN}📋 Skills:${NC} Kubernetes, Terraform, CI/CD, Cloud, Monitoring"
echo ""

setup_agent $CURRENT_AGENT "$BASE_DIR/agent-04-devops" \
    "devops-platform"

cat > "$BASE_DIR/agent-04-devops/AGENT-PROFILE.md" << 'EOF'
# 🚀 AGENTE 4: The DevOps Wizard

## Rol
DevOps/Platform Engineer - Gestiona infraestructura y CI/CD

## Responsabilidades
- CI/CD pipelines
- Infraestructura como código
- Orquestación de contenedores
- Monitoreo y observabilidad
- Cloud platforms
- Deployment automation

## Skills Clave
- Kubernetes (admin, Helm, Istio)
- Terraform/Pulumi IaC
- CI/CD (Jenkins, GitLab, ArgoCD)
- Docker & Containers
- Monitoring (Prometheus, Grafana)
- GitHub Actions Templates
- Cloud Platforms (AWS, GCP, Azure)
- Chaos Engineering

## Cuándo Usar
- "Configura el pipeline de CI/CD"
- "Despliega a producción"
- "Necesito monitoreo"
- "Escalar la infraestructura"
EOF

# ============================================================
# AGENTE 5: THE QA GUARDIAN 🛡️
# ============================================================
CURRENT_AGENT=5
show_progress $CURRENT_AGENT "🛡️ AGENTE 5: The QA Guardian (Testing Specialist)"
echo -e "${CYAN}🎯 Rol:${NC} Asegura calidad y confiabilidad"
echo -e "${CYAN}📋 Skills:${NC} E2E, Performance, Visual Testing, BDD"
echo ""

setup_agent $CURRENT_AGENT "$BASE_DIR/agent-05-qa" \
    "testing-advanced"

cat > "$BASE_DIR/agent-05-qa/AGENT-PROFILE.md" << 'EOF'
# 🛡️ AGENTE 5: The QA Guardian

## Rol
Testing Specialist - Asegura calidad y confiabilidad del software

## Responsabilidades
- Testing automatizado
- Testing de performance
- Testing visual
- Testing de seguridad
- BDD y TDD
- Estrategias de calidad

## Skills Clave
- E2E Testing (Cypress, Playwright)
- API Testing (Postman, REST Assured)
- Performance Testing (k6, JMeter, Gatling)
- Visual Testing (Percy, Chromatic)
- Contract Testing (Pact)
- Mutation Testing
- BDD (Cucumber)
- Security Testing (OWASP ZAP)

## Cuándo Usar
- "Escribe tests para esta feature"
- "Necesito testing E2E"
- "Testea el performance"
- "Encuentra bugs de seguridad"
EOF

# ============================================================
# AGENTE 6: THE DATA ALCHEMIST 🔮
# ============================================================
CURRENT_AGENT=6
show_progress $CURRENT_AGENT "🔮 AGENTE 6: The Data Alchemist (Data/ML Engineer)"
echo -e "${CYAN}🎯 Rol:${NC} Gestiona datos e implementa ML/AI"
echo -e "${CYAN}📋 Skills:${NC} Spark, TensorFlow, PyTorch, LangChain, MLOps"
echo ""

setup_agent $CURRENT_AGENT "$BASE_DIR/agent-06-data" \
    "data-ml-ai"

cat > "$BASE_DIR/agent-06-data/AGENT-PROFILE.md" << 'EOF'
# 🔮 AGENTE 6: The Data Alchemist

## Rol
Data/ML Engineer - Gestiona datos e implementa ML/AI

## Responsabilidades
- Pipelines de datos
- Modelos de ML
- Integración de AI
- Analytics y reporting
- Vector databases
- MLOps

## Skills Clave
- Apache Spark, Kafka, Airflow
- Python Data Stack (Pandas, NumPy)
- TensorFlow/PyTorch
- HuggingFace Transformers
- LangChain & OpenAI API
- MLOps (MLflow, Kubeflow)
- Vector Databases (Pinecone, Weaviate)
- Computer Vision (OpenCV)

## Cuándo Usar
- "Necesito un pipeline de datos"
- "Implementa ML en este feature"
- "Integra OpenAI/LangChain"
- "Crea un sistema de recomendación"
EOF

# ============================================================
# AGENTE 7: THE MOBILE NINJA 📱
# ============================================================
CURRENT_AGENT=7
show_progress $CURRENT_AGENT "📱 AGENTE 7: The Mobile Ninja (Mobile Developer)"
echo -e "${CYAN}🎯 Rol:${NC} Desarrolla apps móviles nativas y cross-platform"
echo -e "${CYAN}📋 Skills:${NC} iOS (Swift), Android (Kotlin), React Native, Flutter"
echo ""

setup_agent $CURRENT_AGENT "$BASE_DIR/agent-07-mobile" \
    "mobile-native" \
    "mobile-cross"

cat > "$BASE_DIR/agent-07-mobile/AGENT-PROFILE.md" << 'EOF'
# 📱 AGENTE 7: The Mobile Ninja

## Rol
Mobile Developer - Desarrolla apps móviles nativas y cross-platform

## Responsabilidades
- Apps iOS nativas
- Apps Android nativas
- React Native / Expo
- Flutter
- Testing móvil
- Publicación en stores

## Skills Clave
- iOS: Swift, SwiftUI, UIKit
- Android: Kotlin, Jetpack Compose
- React Native / Expo
- Flutter
- Mobile Testing (Maestro, Detox)
- App Store/Play Store Deployment
- Push Notifications

## Cuándo Usar
- "Necesito una app iOS"
- "Crea la versión Android"
- "App en React Native"
- "Publica en la App Store"
EOF

# ============================================================
# AGENTE 8: THE SECURITY SENTINEL 🔒
# ============================================================
CURRENT_AGENT=8
show_progress $CURRENT_AGENT "🔒 AGENTE 8: The Security Sentinel (Security Engineer)"
echo -e "${CYAN}🎯 Rol:${NC} Protege sistemas y audita seguridad"
echo -e "${CYAN}📋 Skills:${NC} Smart Contract Security, DevSecOps, Pentesting"
echo ""

setup_agent $CURRENT_AGENT "$BASE_DIR/agent-08-security" \
    "web3-blockchain" \
    "devops-platform" \
    "testing-advanced"

cat > "$BASE_DIR/agent-08-security/AGENT-PROFILE.md" << 'EOF'
# 🔒 AGENTE 8: The Security Sentinel

## Rol
Security Engineer - Protege sistemas y audita seguridad

## Responsabilidades
- Auditoría de seguridad
- Smart contract security
- DevSecOps
- Pentesting
- Vulnerability scanning
- Security best practices

## Skills Clave
- Smart Contract Security (Trail of Bits, Slither)
- DevSecOps (Snyk, Trivy, Falco)
- OWASP ZAP, Burp Suite
- Vault Secrets Management
- Secure Coding Practices
- Penetration Testing
- Vulnerability Scanning

## Cuándo Usar
- "Audita la seguridad"
- "Revisa este smart contract"
- "Escanea vulnerabilidades"
- "Implementa seguridad"
EOF

# ============================================================
# AGENTE 9: THE PERFORMANCE OPTIMIZER ⚡
# ============================================================
CURRENT_AGENT=9
show_progress $CURRENT_AGENT "⚡ AGENTE 9: The Performance Optimizer (Performance Engineer)"
echo -e "${CYAN}🎯 Rol:${NC} Optimiza velocidad y eficiencia"
echo -e "${CYAN}📋 Skills:${NC} Performance Testing, Profiling, Optimization"
echo ""

setup_agent $CURRENT_AGENT "$BASE_DIR/agent-09-performance" \
    "testing-advanced" \
    "frontend-core"

cat > "$BASE_DIR/agent-09-performance/AGENT-PROFILE.md" << 'EOF'
# ⚡ AGENTE 9: The Performance Optimizer

## Rol
Performance Engineer - Optimiza velocidad y eficiencia

## Responsabilidades
- Performance testing
- Profiling y benchmarking
- Optimización de código
- Caching strategies
- Database optimization
- Cost optimization

## Skills Clave
- Performance Testing (k6, JMeter, Artillery)
- Web Performance Optimization
- Bundle Size Optimization
- Database Query Optimization
- Caching Strategies
- CDN/Edge Optimization
- Load Balancing
- Profiling y Benchmarking

## Cuándo Usar
- "La app está lenta"
- "Optimiza el performance"
- "Reduce el bundle size"
- "Haz load testing"
EOF

# ============================================================
# AGENTE 10: THE FULL-STACK GENERALIST 🌟
# ============================================================
CURRENT_AGENT=10
show_progress $CURRENT_AGENT "🌟 AGENTE 10: The Full-Stack Generalist (Comodín)"
echo -e "${CYAN}🎯 Rol:${NC} Apoyo en todas las áreas, debugging, planificación"
echo -e "${CYAN}📋 Skills:${NC} Superpowers, Debugging, Planning, Utilities"
echo ""

setup_agent $CURRENT_AGENT "$BASE_DIR/agent-10-generalist" \
    "obra-superpowers" \
    "tools-utilities" \
    "google-stitch"

cat > "$BASE_DIR/agent-10-generalist/AGENT-PROFILE.md" << 'EOF'
# 🌟 AGENTE 10: The Full-Stack Generalist

## Rol
Full-Stack Generalist - El comodín del equipo

## Responsabilidades
- Debugging complejo
- Planificación de proyectos
- Documentación
- Code reviews
- Apoyo en todas las áreas
- Brainstorming
- Solución de problemas

## Skills Clave
- Superpowers de Obra (debugging, TDD, planning)
- Brainstorming & Problem Solving
- Web Scraping (Firecrawl, Browser-use)
- Documentation (Docusaurus, Swagger)
- Systematic Debugging
- Writing Plans & Execution
- Code Review Excellence
- Git Worktrees

## Cuándo Usar
- "Debuggea este error"
- "Planifica este proyecto"
- "Revisa este código"
- "Necesito ayuda general"
- "No sabemos qué agente usar"
EOF

# ============================================================
# RESUMEN FINAL
# ============================================================
echo ""
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                            ║${NC}"
echo -e "${MAGENTA}║  ${GREEN}✅ DREAM TEAM CONFIGURADO EXITOSAMENTE${NC}                    ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║                                                            ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Resumen del Equipo:${NC}"
echo ""
echo -e "${CYAN}1.${NC} 🏗️  The Architect        - Arquitectura & Diseño"
echo -e "${CYAN}2.${NC} 🎨  The Frontend Master  - UI/UX Frontend"
echo -e "${CYAN}3.${NC} ⚙️  The Backend Beast    - APIs & Backend"
echo -e "${CYAN}4.${NC} 🚀  The DevOps Wizard    - Infraestructura"
echo -e "${CYAN}5.${NC} 🛡️  The QA Guardian      - Testing & Calidad"
echo -e "${CYAN}6.${NC} 🔮  The Data Alchemist   - ML/AI & Datos"
echo -e "${CYAN}7.${NC} 📱  The Mobile Ninja     - Apps Móviles"
echo -e "${CYAN}8.${NC} 🔒  The Security Sentinel- Seguridad"
echo -e "${CYAN}9.${NC} ⚡  The Performance Opt. - Optimización"
echo -e "${CYAN}10.${NC} 🌟 The Generalist      - Comodín Full-Stack"
echo ""
echo -e "${BLUE}📁 Estructura de directorios:${NC}"
echo -e "${YELLOW}$BASE_DIR/${NC}"
echo -e "  ├── ${CYAN}agent-01-architect/${NC}"
echo -e "  ├── ${CYAN}agent-02-frontend/${NC}"
echo -e "  ├── ${CYAN}agent-03-backend/${NC}"
echo -e "  ├── ${CYAN}agent-04-devops/${NC}"
echo -e "  ├── ${CYAN}agent-05-qa/${NC}"
echo -e "  ├── ${CYAN}agent-06-data/${NC}"
echo -e "  ├── ${CYAN}agent-07-mobile/${NC}"
echo -e "  ├── ${CYAN}agent-08-security/${NC}"
echo -e "  ├── ${CYAN}agent-09-performance/${NC}"
echo -e "  └── ${CYAN}agent-10-generalist/${NC}"
echo ""
echo -e "${GREEN}🎉 Tu Dream Team está listo para trabajar!${NC}"
echo ""
echo -e "${YELLOW}💡 Uso recomendado:${NC}"
echo "  - Cada agente tiene su propio directorio con skills especializadas"
echo "  - Usa el agente correspondiente según la tarea"
echo "  - El Generalist (Agente 10) puede ayudar en cualquier área"
echo "  - Revisa AGENT-PROFILE.md en cada directorio para más detalles"
echo ""
echo -e "${BLUE}📖 Comandos útiles:${NC}"
echo "  ./setup-dream-team.sh              # Reconfigurar todo el equipo"
echo "  ./setup-dream-team.sh ./mi-equipo  # Configurar en directorio específico"
echo ""

# Crear archivo de resumen global
cat > "$BASE_DIR/DREAM-TEAM-README.md" << EOF
# 🚀 DREAM TEAM - Equipo de 10 Agentes Especializados

Fecha de configuración: $(date)

## 👥 Agentes

### 1. 🏗️ The Architect
**Rol:** Arquitecto de Software
**Directorio:** \`agent-01-architect/\`
**Skills:** 19+ (Architecture, Patterns, System Design)

### 2. 🎨 The Frontend Master
**Rol:** Especialista Frontend
**Directorio:** \`agent-02-frontend/\`
**Skills:** 22+ (React, Vue, TypeScript, UI/UX)

### 3. ⚙️ The Backend Beast
**Rol:** Especialista Backend
**Directorio:** \`agent-03-backend/\`
**Skills:** 48+ (Node.js, Python, Go, Java, APIs)

### 4. 🚀 The DevOps Wizard
**Rol:** DevOps/Platform Engineer
**Directorio:** \`agent-04-devops/\`
**Skills:** 38+ (Kubernetes, CI/CD, Cloud, Monitoring)

### 5. 🛡️ The QA Guardian
**Rol:** Testing Specialist
**Directorio:** \`agent-05-qa/\`
**Skills:** 32+ (E2E, Performance, Visual, Security Testing)

### 6. 🔮 The Data Alchemist
**Rol:** Data/ML Engineer
**Directorio:** \`agent-06-data/\`
**Skills:** 41+ (Spark, ML, AI, MLOps, Vector DBs)

### 7. 📱 The Mobile Ninja
**Rol:** Mobile Developer
**Directorio:** \`agent-07-mobile/\`
**Skills:** 36+ (iOS, Android, React Native, Flutter)

### 8. 🔒 The Security Sentinel
**Rol:** Security Engineer
**Directorio:** \`agent-08-security/\`
**Skills:** 91+ (Web3, DevSecOps, Pentesting)

### 9. ⚡ The Performance Optimizer
**Rol:** Performance Engineer
**Directorio:** \`agent-09-performance/\`
**Skills:** 40+ (Performance Testing, Optimization)

### 10. 🌟 The Full-Stack Generalist
**Rol:** Comodín Full-Stack
**Directorio:** \`agent-10-generalist/\`
**Skills:** 27+ (Superpowers, Debugging, Planning)

---

## 📊 Estadísticas Totales

- **Total de Agentes:** 10
- **Total de Skills:** ~408+
- **Cobertura:** 99% de especializaciones técnicas

## 🎯 Flujo de Trabajo Recomendado

1. **The Architect** diseña el sistema
2. **The Frontend Master** y **The Backend Beast** desarrollan
3. **The QA Guardian** escribe tests
4. **The Security Sentinel** audita
5. **The DevOps Wizard** despliega
6. **The Performance Optimizer** optimiza
7. **The Data Alchemist** implementa ML/AI si es necesario
8. **The Mobile Ninja** crea apps móviles
9. **The Generalist** ayuda donde sea necesario

## 🚀 Comandos

\`\`\`bash
# Reconfigurar equipo completo
./setup-dream-team.sh

# Configurar en directorio específico
./setup-dream-team.sh ./mi-equipo
\`\`\`

## 📚 Recursos

- [skills.sh](https://skills.sh/) - Directorio de skills
- Cada agente tiene su propio AGENT-PROFILE.md
EOF

echo -e "${GREEN}📄 Resumen global guardado en:${NC} $BASE_DIR/DREAM-TEAM-README.md"
echo ""
