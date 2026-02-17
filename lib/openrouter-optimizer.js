/**
 * OpenRouter FREE Tier Optimizer
 * Configuración optimizada para uso gratuito de OpenRouter
 * con algoritmos de selección y compresión de contexto
 */

// Modelos disponibles en OpenRouter FREE tier
const FREE_MODELS = {
  // Modelo rápido - para tareas simples
  fast: {
    id: 'google/gemma-2b-it',
    name: 'Gemma 2B',
    quality: 0.6,
    speed: 0.9,
    rateLimit: 30, // requests per minute
    contextWindow: 8192,
    bestFor: ['simple_qa', 'summarization', 'classification']
  },
  
  // Modelo equilibrado - para código
  balanced: {
    id: 'mistralai/mistral-7b-instruct',
    name: 'Mistral 7B',
    quality: 0.75,
    speed: 0.7,
    rateLimit: 20,
    contextWindow: 8192,
    bestFor: ['coding', 'debugging', 'explanation']
  },
  
  // Modelo calidad - para razonamiento complejo
  quality: {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    quality: 0.85,
    speed: 0.6,
    rateLimit: 20,
    contextWindow: 4096,
    bestFor: ['complex_reasoning', 'architecture', 'planning']
  }
};

/**
 * Algoritmo de selección de modelo basado en complejidad
 * Agente 11: Algorithm Master
 */
function selectOptimalModel(task) {
  const { complexity, contextLength, type } = task;
  
  // Filtrar por contexto
  const viableModels = Object.values(FREE_MODELS).filter(
    model => model.contextWindow >= contextLength
  );
  
  if (viableModels.length === 0) {
    // Comprimir contexto si es necesario
    return { ...FREE_MODELS.fast, compress: true };
  }
  
  // Seleccionar según complejidad
  if (complexity === 'low' || type === 'simple_qa') {
    return FREE_MODELS.fast;
  }
  
  if (complexity === 'high' || type === 'architecture') {
    return FREE_MODELS.quality;
  }
  
  return FREE_MODELS.balanced;
}

/**
 * Compresión de contexto para minimizar tokens
 * Agente 15: Compression Expert
 */
function compressContext(context, maxLength = 2000) {
  if (!context || context.length <= maxLength) {
    return context;
  }
  
  // Estrategias de compresión
  let compressed = context;
  
  // 1. Eliminar espacios múltiples
  compressed = compressed.replace(/\s+/g, ' ');
  
  // 2. Eliminar comentarios si es código
  compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, '');
  compressed = compressed.replace(/\/\/.*$/gm, '');
  
  // 3. Abreviar términos comunes
  const abbreviations = {
    'application': 'app',
    'function': 'fn',
    'component': 'comp',
    'authentication': 'auth',
    'authorization': 'authz',
    'database': 'db',
    'application programming interface': 'API',
    'user interface': 'UI'
  };
  
  Object.entries(abbreviations).forEach(([full, short]) => {
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    compressed = compressed.replace(regex, short);
  });
  
  // 4. Truncar manteniendo inicio y final importantes
  if (compressed.length > maxLength) {
    const start = compressed.substring(0, maxLength * 0.7);
    const end = compressed.substring(compressed.length - maxLength * 0.3);
    compressed = start + '\n...\n' + end;
  }
  
  return compressed;
}

/**
 * Rate limiter para respetar límites de OpenRouter
 */
class RateLimiter {
  constructor() {
    this.requests = [];
    this.maxRequests = 20; // Conservative limit
    this.windowMs = 60000; // 1 minute
  }
  
  async throttle() {
    const now = Date.now();
    
    // Limpiar requests antiguos
    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    );
    
    // Si estamos cerca del límite, esperar
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      
      if (waitTime > 0) {
        console.log(`Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)}s...`);
        await sleep(waitTime);
      }
    }
    
    // Registrar request
    this.requests.push(now);
  }
}

/**
 * Función principal para llamar a OpenRouter
 */
async function callOpenRouter(prompt, context = '', options = {}) {
  const rateLimiter = new RateLimiter();
  await rateLimiter.throttle();
  
  // 1. Comprimir contexto
  const compressedContext = compressContext(context);
  
  // 2. Seleccionar modelo óptimo
  const model = selectOptimalModel({
    complexity: options.complexity || 'medium',
    contextLength: compressedContext.length,
    type: options.type || 'general'
  });
  
  // 3. Preparar mensajes
  const messages = [
    {
      role: 'system',
      content: compressedContext || 'You are a helpful coding assistant.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];
  
  // 4. Llamar a OpenRouter
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Research MR'
      },
      body: JSON.stringify({
        model: model.id,
        messages: messages,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: model.name,
      usage: data.usage,
      compressed: compressedContext.length < context.length
    };
    
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    throw error;
  }
}

// Exportar para uso en aplicación
module.exports = {
  FREE_MODELS,
  selectOptimalModel,
  compressContext,
  callOpenRouter,
  RateLimiter
};
