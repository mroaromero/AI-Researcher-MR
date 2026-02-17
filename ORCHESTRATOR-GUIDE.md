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
