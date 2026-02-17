#!/bin/bash

# ============================================================
# Instalador del Orquestador del Dream Team
# ============================================================
# Agrega una skill maestra que coordina los 15 agentes
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
echo -e "${MAGENTA}║  ${CYAN}🎭 DREAM TEAM ORCHESTRATOR${NC}                                   ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║  ${CYAN}Skill Maestra de Coordinación${NC}                                ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar estructura
if [ ! -d "$SKILLS_DIR" ]; then
    echo -e "${RED}❌ Error: No se encuentra el directorio de skills${NC}"
    echo "Ejecuta primero: ./install-dream-team-final.sh"
    exit 1
fi

echo -e "${BLUE}📁 Instalando Skill Orquestadora...${NC}"
echo ""

# Verificar que existe la skill
if [ ! -f "$SKILLS_DIR/dream-team-orchestrator/SKILL.md" ]; then
    echo -e "${RED}❌ Error: No se encuentra la skill orquestadora${NC}"
    echo "Asegúrate de que existe: .opencode/skills/dream-team-orchestrator/SKILL.md"
    exit 1
fi

echo -e "${GREEN}✓${NC} Skill orquestadora encontrada"
echo ""

# Crear configuración de OpenCode con el orquestador
echo -e "${BLUE}⚙️  Configurando OpenCode para usar el orquestador...${NC}"

cat > "$PROJECT_DIR/opencode.json" << 'EOF'
{
  "name": "Dream Team Project",
  "description": "Proyecto con 15 agentes especializados y orquestador maestro",
  
  "agents": {
    "default": {
      "systemPrompt": "You are the Dream Team Orchestrator - a master coordinator that analyzes tasks and delegates to 15 specialized agents. Always start by analyzing the complexity and requirements, then invoke the appropriate specialized skills. When a task involves multiple domains or is complex, activate the dream-team-orchestrator skill to plan and coordinate the workflow.",
      "tools": {
        "skill": true
      }
    },
    
    "orchestrator": {
      "systemPrompt": "You are the Dream Team Orchestrator. Your role is to:\n1. Analyze incoming tasks for complexity and required expertise\n2. Select the appropriate specialized agents from the 15 available\n3. Plan the optimal workflow (sequential, parallel, or hybrid)\n4. Coordinate execution between agents\n5. Integrate outputs into a cohesive solution\n\nAvailable agents:\n- Architect (design)\n- Frontend Master (UI/UX)\n- Backend Beast (APIs/databases)\n- DevOps Wizard (infrastructure)\n- QA Guardian (testing)\n- Data Alchemist (ML/AI)\n- Mobile Ninja (iOS/Android)\n- Security Sentinel (security)\n- Performance Optimizer (optimization)\n- Generalist (debugging/planning)\n- Algorithm Master (algorithms)\n- Game Architect (game dev)\n- Statistics Sage (statistics)\n- LLM Engineer (language models)\n- Compression Expert (compression)\n\nAlways start complex tasks by loading the dream-team-orchestrator skill.",
      "skills": ["dream-team-orchestrator"]
    }
  },
  
  "permissions": {
    "skill": {
      "*": "allow",
      "dream-team-orchestrator": "allow",
      "internal-*": "ask"
    }
  },
  
  "orchestrator": {
    "enabled": true,
    "auto_detect_complexity": true,
    "complexity_threshold": "medium",
    "max_parallel_agents": 4,
    "phases": {
      "analysis": true,
      "planning": true,
      "execution": true,
      "integration": true
    }
  }
}
EOF

echo -e "${GREEN}✓${NC} Configuración creada: ${CYAN}opencode.json${NC}"
echo ""

# Crear script de activación
cat > "$PROJECT_DIR/activate-orchestrator.sh" << 'EOF'
#!/bin/bash
# Script para activar el orquestador manualmente

echo "🎭 Activando Dream Team Orchestrator..."
echo ""
echo "Modos de uso:"
echo ""
echo "1. MODO AUTOMÁTICO (Recomendado):"
echo "   El orquestador detectará automáticamente tareas complejas"
echo "   y coordinará los agentes necesarios."
echo ""
echo "2. MODO MANUAL:"
echo "   Menciona explícitamente en tu prompt:"
echo "   > 'Usando el orquestador, crea una app full-stack'"
echo ""
echo "3. ACTIVAR PARA TODA LA SESIÓN:"
echo "   > opencode --agent orchestrator"
echo ""
echo "El orquestador analizará tu tarea y:"
echo "  ✓ Determinará la complejidad"
echo "  ✓ Seleccionará los agentes apropiados"
echo "  ✓ Planificará el flujo de trabajo"
echo "  ✓ Coordinará la ejecución"
echo ""
EOF

chmod +x "$PROJECT_DIR/activate-orchestrator.sh"

# Crear guía de uso
cat > "$PROJECT_DIR/ORCHESTRATOR-GUIDE.md" << 'EOF'
# 🎭 Dream Team Orchestrator - Guía de Uso

## ¿Qué es el Orquestador?

El **Dream Team Orchestrator** es una **skill maestra** que actúa como el "cerebro" del sistema. No reemplaza a los otros agentes, sino que **los coordina y dirige**.

## 🎯 Función Principal

```
Tú → Orquestador → Selecciona Agentes → Coordina Ejecución → Resultado Integrado
```

## 🚀 Cómo Usar

### Método 1: Detección Automática (Recomendado)

Simplemente escribe tu tarea y el orquestador detectará si es compleja:

```bash
opencode
> Crea una app de e-commerce con recomendaciones ML
```

**El orquestador detectará:**
- Múltiples dominios (web + ML)
- Alta complejidad
- Necesidad de múltiples agentes

**Acción automática:**
```
🎭 ORQUESTADOR ACTIVADO

Detectada tarea compleja: E-commerce + ML
Agentes seleccionados: 6
Plan generado...
```

### Método 2: Activación Manual

Menciona explícitamente el orquestador:

```bash
> Usando el orquestador, diseña un sistema de microservicios
```

### Método 3: Modo Orquestador Permanente

```bash
# Iniciar OpenCode en modo orquestador
opencode --agent orchestrator

# Ahora todas las tareas pasan por el orquestador
```

## 📊 Ejemplos de Orquestación

### Ejemplo 1: App Web Simple
```
Tú: "Crea un formulario de contacto"
Orquestador: "Tarea simple, delegando a Frontend Master directamente"
Resultado: ✅ Formulario React profesional
```

### Ejemplo 2: Sistema Complejo
```
Tú: "Plataforma de reservas con ML para precios dinámicos"

Orquestador:
┌─────────────────────────────────────────┐
│ 🎯 ORQUESTADOR ACTIVADO                 │
│                                         │
│ Complejidad: ⭐⭐⭐⭐⭐ Muy Alta           │
│ Agentes: 7                              │
│                                         │
│ 📋 PLAN:                                │
│ 1. 🏗️ Architect → Diseño sistema       │
│ 2. 🔮 Data/ML → Modelo de precios      │
│ 3. ⚙️ Backend → APIs                   │
│ 4. 🎨 Frontend → Dashboard             │
│ 5. 📊 Statistics → Análisis             │
│ 6. 🔒 Security → Auditoría              │
│ 7. 🛡️ QA → Testing                     │
└─────────────────────────────────────────┘

¿Proceder? (sí/no)
```

### Ejemplo 3: Videojuego
```
Tú: "Juego 2D tipo platformer en Godot"

Orquestador:
┌─────────────────────────────────────────┐
│ 🎮 GAME DEVELOPMENT DETECTED            │
│                                         │
│ Agente principal: Game Architect        │
│ Soporte: Algorithm Master (pathfinding) │
│                                         │
│ 📋 PLAN:                                │
│ 1. 🎮 Game Architect → Core mechanics   │
│ 2. 🧮 Algorithm Master → AI enemies     │
│ 3. 🎨 Frontend → UI/UX                  │
│ 4. ⚡ Performance → Optimización        │
│ 5. 🛡️ QA → Playtesting                  │
└─────────────────────────────────────────┘
```

## 🎪 Flujo de Trabajo

### Cuando el orquestador se activa:

1. **ANÁLISIS** (5-10 segundos)
   - Examina tu prompt
   - Detecta tecnologías mencionadas
   - Evalúa complejidad

2. **PLANIFICACIÓN** (5-10 segundos)
   - Selecciona agentes necesarios
   - Determina orden de ejecución
   - Identifica dependencias
   - Muestra plan al usuario

3. **EJECUCIÓN** (varios minutos)
   - Coordina agentes fase por fase
   - Pasa contexto entre agentes
   - Monitorea calidad

4. **INTEGRACIÓN** (1-2 minutos)
   - Combina outputs de todos los agentes
   - Verifica coherencia
   - Genera documentación

## 🛠️ Comandos Especiales

### Ver plan antes de ejecutar
```bash
> Orquestador, muestra el plan para: crear API REST
```

### Forzar agentes específicos
```bash
> Orquestador, usa Backend Beast y Security Sentinel para: auditoría API
```

### Ejecutar en paralelo
```bash
> Orquestador, modo paralelo: desarrollar frontend y backend simultáneamente
```

### Ver status del Dream Team
```bash
> Orquestador, status
```
Respuesta:
```
🎭 DREAM TEAM STATUS

Agentes disponibles: 15/15
Skills instaladas: 216

Última orquestación: hace 2 horas
Tareas completadas hoy: 3
Agentes más usados:
  1. Frontend Master (5 veces)
  2. Backend Beast (4 veces)
  3. Architect (3 veces)
```

## 🎓 Casos de Uso Avanzados

### Caso 1: Startup MVP Completo
```
Tú: "Necesito un MVP completo: app móvil + web + ML + backend"

Orquestador:
FASE 1 (Paralelo):
  ├─ Architect → Arquitectura general
  ├─ Security → Threat model inicial
  └─ Generalist → Plan de proyecto

FASE 2 (Paralelo):
  ├─ Backend Beast → APIs core
  ├─ Data Alchemist → ML pipeline
  └─ Mobile Ninja → App iOS/Android

FASE 3 (Secuencial):
  ├─ Frontend Master → Web app
  ├─ QA Guardian → Testing suite
  └─ Performance Optimizer → Optimización

FASE 4:
  └─ DevOps Wizard → CI/CD + deployment

Tiempo estimado: 45-60 minutos
```

### Caso 2: Sistema de IA Empresarial
```
Tú: "Sistema de procesamiento de documentos con NLP y RAG"

Orquestador:
FASE 1:
  ├─ Architect → Diseño de pipeline
  └─ LLM Engineer → Selección de modelos

FASE 2:
  ├─ Data Alchemist → Preparación de datos
  ├─ Statistics Sage → Análisis de corpus
  └─ Backend Beast → APIs de procesamiento

FASE 3:
  ├─ LLM Engineer → Implementación RAG
  ├─ Security Sentinel → Protección de PII
  └─ Compression Expert → Optimización de vectores

FASE 4:
  ├─ Frontend Master → Interface de usuario
  ├─ QA Guardian → Tests de calidad
  └─ Performance Optimizer → Latencia < 200ms
```

## 🚨 Cuándo NO usar el Orquestador

**No es necesario para:**
- ❌ Tareas de menos de 5 minutos
- ❌ Cambios simples en un archivo
- ❌ Debugging puntual
- ❌ Preguntas conceptuales

**El orquestador delegará directamente:**
- ✅ "¿Qué es una closure en JavaScript?" → Generalist
- ✅ "Arregla este error de sintaxis" → Generalist
- ✅ "Optimiza esta función" → Performance Optimizer directo

## 📈 Beneficios del Orquestador

1. **Eficiencia**: Aprovecha especialización de cada agente
2. **Calidad**: Cada parte del proyecto por un experto
3. **Coherencia**: Integración automática de componentes
4. **Visibilidad**: Sabes exactamente qué se está haciendo y por quién
5. **Escalabilidad**: Puede manejar proyectos de cualquier complejidad

## 🔧 Configuración Avanzada

En `opencode.json` puedes ajustar:

```json
{
  "orchestrator": {
    "auto_detect_complexity": true,
    "complexity_threshold": "medium",
    "max_parallel_agents": 4,
    "show_plan_before_execute": true,
    "require_approval": false
  }
}
```

## 🎬 Primeros Pasos

1. **Prueba simple:**
   ```bash
   > Orquestador, crea un componente React
   ```

2. **Prueba media:**
   ```bash
   > Orquestador, API REST con autenticación
   ```

3. **Prueba compleja:**
   ```bash
   > Orquestador, sistema de análisis de datos con ML
   ```

## 💡 Tips Pro

1. **Sé específico**: Menciona tecnologías y requisitos claros
2. **Indica prioridades**: "Rápido pero funcional" vs "Perfecto pero lento"
3. **Itera**: Usa el resultado de una orquestación como input de la siguiente
4. **Aprende**: Observa qué agentes selecciona para diferentes tipos de tareas
5. **Personaliza**: Puedes modificar el SKILL.md del orquestador para tus necesidades

---

**¡Tu Dream Team está listo para orquestar proyectos de cualquier escala!** 🚀
EOF

echo -e "${GREEN}✓${NC} Guía creada: ${CYAN}ORCHESTRATOR-GUIDE.md${NC}"
echo ""

# Actualizar README principal
cat >> "$PROJECT_DIR/DREAM-TEAM-SETUP.md" << 'EOF'

---

## 🎭 ORQUESTADOR DEL DREAM TEAM

### ¿Qué es?
Una **skill maestra** que coordina automáticamente los 15 agentes según la complejidad de la tarea.

### Cómo funciona:
```
Tu Tarea → Orquestador Analiza → Selecciona Agentes → Coordina Ejecución → Resultado Integrado
```

### Uso:
```bash
# El orquestador detecta automáticamente tareas complejas
opencode
> Crea una app de e-commerce con ML

# O actívalo manualmente
> Usando el orquestador, diseña un sistema distribuido
```

### Ver documentación completa:
- [ORCHESTRATOR-GUIDE.md](./ORCHESTRATOR-GUIDE.md)

### Ejemplo de salida:
```
🎭 ORQUESTADOR ACTIVADO

Complejidad: ⭐⭐⭐⭐⭐ Muy Alta
Agentes: 7

📋 PLAN DE EJECUCIÓN:
1. 🏗️ Architect → Diseño de sistema
2. 🔮 Data/ML → Modelos de ML
3. ⚙️ Backend → APIs
4. 🎨 Frontend → UI
5. 🔒 Security → Auditoría
6. 🛡️ QA → Testing
7. 🚀 DevOps → Deployment

¿Proceder? (sí/no)
```

EOF

# Mostrar resumen
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}║  ${GREEN}✅ ORQUESTADOR INSTALADO EXITOSAMENTE${NC}                        ${MAGENTA}║${NC}"
echo -e "${MAGENTA}║                                                                ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📦 Componentes instalados:${NC}"
echo -e "  ${GREEN}✓${NC} Skill: dream-team-orchestrator"
echo -e "  ${GREEN}✓${NC} Config: opencode.json (actualizado)"
echo -e "  ${GREEN}✓${NC} Guía: ORCHESTRATOR-GUIDE.md"
echo -e "  ${GREEN}✓${NC} Activador: activate-orchestrator.sh"
echo ""
echo -e "${BLUE}🎯 Cómo usar:${NC}"
echo -e "  ${CYAN}1.${NC} El orquestador detectará automáticamente tareas complejas"
echo -e "  ${CYAN}2.${NC} O menciona explícitamente: 'Usando el orquestador...'"
echo -e "  ${CYAN}3.${NC} Lee la guía completa: ${YELLOW}ORCHESTRATOR-GUIDE.md${NC}"
echo ""
echo -e "${YELLOW}💡 Ejemplo:${NC}"
echo -e "   ${CYAN}>${NC} Crea una app de e-commerce con recomendaciones ML"
echo -e "   ${CYAN}>${NC} Usando el orquestador, diseña un sistema de microservicios"
echo ""
echo -e "${GREEN}🚀 Tu Dream Team ahora tiene un cerebro coordinador!${NC}"
echo ""
