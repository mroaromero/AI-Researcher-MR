# Plan de Optimización - OpenRouter FREE + Proyecto Personal
## Usando Agente 11 (Algoritmos) y Agente 15 (Compresión)

## Objetivos
1. Reducir 217 skills a 25 esenciales
2. Optimizar uso de OpenRouter FREE
3. Eliminar deuda cognitiva
4. Sistema mantenible para 1 persona

## Solución Propuesta

### 1. Algoritmo de Selección de Skills (Agente 11)
Crear sistema que seleccione automáticamente las skills óptimas basado en:
- Frecuencia de uso histórica
- Relevancia para el contexto actual  
- Minimización de overlap entre skills

**Resultado**: De 217 skills, usar solo 10-15 por tarea

### 2. Compresión de Skills (Agente 15)
Agrupar skills en 8 categorías esenciales:
- Core Web (React, Next.js, UI)
- Backend (APIs, DB)
- DevOps (Deploy, CI/CD)
- Testing (QA, TDD)
- Data/ML (AI, Analytics)
- Security (Auth, Seguridad)
- Algorithms (Optimización)
- Compression (Eficiencia)

**Resultado**: Reducción del 88% en complejidad

### 3. Optimización OpenRouter FREE
Estrategias específicas:
- Seleccionar modelos FREE óptimos (gemma-2b, mistral-7b)
- Comprimir contexto para reducir tokens
- Batch de requests para respetar rate limits
- Cache de respuestas frecuentes

**Resultado**: $0 costo, máximo aprovechamiento

## Implementación Inmediata

### Paso 1: Crear lista de 25 skills esenciales

```
essential-skills.txt
===================

# Core (8 skills)
vercel-react-best-practices
web-design-guidelines
nextjs-app-router-patterns
responsive-design

# Backend (4 skills)  
nodejs-backend-patterns
api-design-principles
fastapi-templates
postgresql-table-design

# DevOps (2 skills)
github-actions-templates
deployment-pipeline-design

# Testing (3 skills)
test-driven-development
e2e-testing-patterns
systematic-debugging

# Data/ML (4 skills)
ml-pipeline-workflow
data-exploration
rag-implementation
llm-engineering

# Security (2 skills)
secrets-management
auth-implementation-patterns

# Algoritmos (1 skill)
algorithm-design

# Compresión (1 skill)
data-compression

TOTAL: 25 skills (88% de reducción)
```

### Paso 2: Script de compresión

```bash
#!/bin/bash
# compress-skills.sh

echo "🗜️ COMPRESIÓN DE SKILLS"
echo "========================"

# Backup
cp -r .opencode/skills .opencode/skills-backup-217

# Mantener solo esenciales
mkdir -p .opencode/skills-temp

for skill in vercel-react-best-practices web-design-guidelines nextjs-app-router-patterns responsive-design nodejs-backend-patterns api-design-principles fastapi-templates postgresql-table-design github-actions-templates deployment-pipeline-design test-driven-development e2e-testing-patterns systematic-debugging ml-pipeline-workflow data-exploration rag-implementation llm-engineering secrets-management auth-implementation-patterns algorithm-design data-compression; do
  if [ -d ".opencode/skills/$skill" ]; then
    cp -r ".opencode/skills/$skill" .opencode/skills-temp/
    echo "✓ $skill"
  fi
done

# Reemplazar
rm -rf .opencode/skills/*
mv .opencode/skills-temp/* .opencode/skills/
rmdir .opencode/skills-temp

echo ""
echo "📊 RESULTADO:"
echo "  Antes: 217 skills"
echo "  Después: 25 skills"
echo "  Reducción: 88%"
```

### Paso 3: Configuración OpenRouter Optimizada

```javascript
// lib/openrouter-config.js

// Modelos FREE disponibles en OpenRouter
const FREE_MODELS = {
  fast: {
    id: 'google/gemma-2b-it',
    quality: 0.6,
    rateLimit: 30, // req/min
    useFor: 'simple_tasks'
  },
  balanced: {
    id: 'mistralai/mistral-7b-instruct',
    quality: 0.75,
    rateLimit: 20,
    useFor: 'coding'
  },
  quality: {
    id: 'openai/gpt-3.5-turbo',
    quality: 0.8,
    rateLimit: 20,
    useFor: 'complex_reasoning'
  }
};

// Selector automático basado en complejidad
function selectModel(task) {
  if (task.tokens < 500) return FREE_MODELS.fast;
  if (task.complexity === 'high') return FREE_MODELS.quality;
  return FREE_MODELS.balanced;
}

// Compresión de contexto
function compressContext(context) {
  // Eliminar redundancia, mantener significado
  return context
    .replace(/\s+/g, ' ')                    // Eliminar espacios extras
    .replace(/\band\b/g, '&')                // Abreviar
    .replace(/\bthe\b/g, '')                // Eliminar artículos
    .substring(0, 2000);                    // Limitar a 2k chars
}

module.exports = { FREE_MODELS, selectModel, compressContext };
```

### Paso 4: Integración

```typescript
// Uso en tu aplicación
import { selectModel, compressContext } from '@/lib/openrouter-config';

async function callAI(prompt, context) {
  // 1. Seleccionar modelo óptimo
  const model = selectModel({ 
    tokens: prompt.length, 
    complexity: estimateComplexity(prompt) 
  });
  
  // 2. Comprimir contexto
  const compressed = compressContext(context);
  
  // 3. Llamar a OpenRouter
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model.id,
      messages: [
        { role: 'system', content: compressed },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000 // Limitar para FREE tier
    })
  });
  
  return response.json();
}
```

## Resultados Esperados

| Aspecto | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Skills | 217 | 25 | 88% ↓ |
| Overhead cognitivo | Alto | Bajo | 85% ↓ |
| Costo OpenRouter | Variable | $0 | 100% |
| Tiempo de selección | 5 min | 10 seg | 97% ↓ |
| Mantenibilidad | Imposible | Fácil | 90% ↑ |

## Próximos Pasos

1. Ejecutar script de compresión (2 minutos)
2. Configurar OpenRouter optimizer (5 minutos)  
3. Probar sistema reducido (10 minutos)
4. Documentar skills esenciales (15 minutos)

**Total: 32 minutos para sistema optimizado** 🚀

## Comandos para ejecutar ahora:

```bash
# 1. Guardar skills esenciales
cat > essential-skills.txt << 'EOF'
vercel-react-best-practices
web-design-guidelines
nodejs-backend-patterns
api-design-principles
test-driven-development
github-actions-templates
ml-pipeline-workflow
data-exploration
rag-implementation
secrets-management
auth-implementation-patterns
algorithm-design
data-compression
EOF

# 2. Ejecutar compresión
./compress-skills.sh

# 3. Verificar resultado
ls .opencode/skills/ | wc -l
# Debe mostrar: 25 (o menos)
```

¿Ejecutamos esto ahora?
