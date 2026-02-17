# 🚀 Instalador Automático de Skills desde skills.sh

Este repositorio contiene scripts automatizados para instalar las skills de AI agents desde [skills.sh](https://skills.sh/).

## 📦 Archivos incluidos

- **`install-all-skills.sh`** - Script Bash para instalar todas las skills populares
- **`install-skills.py`** - Script Python con más opciones y control
- **`README.md`** - Este archivo

## 🚀 Uso rápido

### Opción 1: Script Bash (Simple)

```bash
# Instalar todas las skills en el directorio actual
./install-all-skills.sh

# Instalar en un directorio específico
./install-all-skills.sh ./mis-skills
```

### Opción 2: Script Python (Recomendado)

```bash
# Ver todas las opciones
python install-skills.py --help

# Instalar todas las skills
python install-skills.py --all

# Instalar en un directorio específico
python install-skills.py --all --dir ./skills

# Instalar solo una categoría
python install-skills.py --category vercel

# Simular instalación (ver qué instalaría sin ejecutar)
python install-skills.py --all --dry-run

# Ver categorías disponibles
python install-skills.py --list
```

## 📂 Categorías disponibles

El script Python organiza las skills en categorías:

| Categoría | Descripción | Cantidad |
|-----------|-------------|----------|
| `vercel` | Skills oficiales de Vercel | 8 |
| `anthropic` | Skills de Anthropic | 17 |
| `obra` | Superpowers de Obra | 15 |
| `marketing` | Marketing y SEO | 25 |
| `expo` | React Native / Expo | 9 |
| `react-native` | React Native adicionales | 2 |
| `backend` | Backend y autenticación | 5 |
| `browser` | Automatización de navegador | 5 |
| `design` | Diseño UI/UX | 2 |
| `wshobson` | Patrones y mejores prácticas | 22 |
| `antfu` | Vite, Vue, Nuxt | 12 |
| `vue` | Vue.js | 2 |
| `mobile` | iOS y Flutter | 2 |
| `shadcn` | Shadcn UI | 3 |
| `google-stitch` | Google Labs Stitch | 4 |
| `media` | Video y media | 1 |
| `ralph-tui` | Ralph TUI | 4 |
| `baoyu` | Baoyu skills | 14 |
| `others` | Otros skills útiles | 10 |

**Total: ~170+ skills populares**

## ⚙️ Opciones del script Python

```
--all              Instalar todas las skills
--category NAME    Instalar solo una categoría
--list             Listar categorías disponibles
--dir PATH         Directorio de instalación (default: ./skills)
--dry-run          Simular sin instalar
--sequential       Instalar una a una (más lento)
--workers N        Número de workers paralelos (default: 5)
```

## 🎯 Ejemplos de uso

### Instalar solo las skills de Vercel
```bash
python install-skills.py --category vercel
```

### Instalar skills de marketing
```bash
python install-skills.py --category marketing --dir ./marketing-skills
```

### Simular instalación completa
```bash
python install-skills.py --all --dry-run
```

### Instalar todo en paralelo con 10 workers
```bash
python install-skills.py --all --workers 10
```

### Instalar todo secuencialmente (más seguro)
```bash
python install-skills.py --all --sequential
```

## 📝 Requisitos

- **Node.js** (para ejecutar `npx skills`)
- **npm** o **npx** instalado
- **Python 3.7+** (solo para el script Python)

## ⚠️ Notas importantes

1. **Tiempo de instalación**: Instalar todas las skills puede tardar varios minutos
2. **Almacenamiento**: Cada skill ocupa poco espacio, pero en conjunto pueden ser varios MB
3. **Conexión**: Requiere conexión a internet para descargar desde GitHub/npm
4. **Errores**: Algunas skills pueden fallar si el repositorio no existe o hay problemas de red
5. **Permisos**: En Linux/Mac, asegúrate de que los scripts tengan permisos de ejecución:
   ```bash
   chmod +x install-all-skills.sh install-skills.py
   ```

## 🔍 Cómo funciona

Los scripts utilizan el CLI oficial de skills:
```bash
npx skills add <owner/repo> [--skill <skill-name>]
```

- Las skills se instalan en el directorio especificado
- Se crea un archivo `installed-skills.txt` con el resumen
- El proceso es completamente automático

## 🌐 Recursos

- **Sitio web**: https://skills.sh/
- **Documentación**: https://skills.sh/docs
- **Repositorio Vercel**: https://github.com/vercel-labs/agent-skills
- **Buscar skills**: Usa la skill `find-skills` después de instalar

## 🆘 Solución de problemas

### Error: "npx: command not found"
```bash
# Instalar Node.js primero
# En Ubuntu/Debian:
sudo apt-get install nodejs npm

# En Mac:
brew install node

# En Windows:
# Descargar desde https://nodejs.org/
```

### Error: "Permission denied"
```bash
chmod +x install-all-skills.sh install-skills.py
```

### Timeout en instalación
```bash
# Usar modo secuencial
python install-skills.py --all --sequential
```

## 📊 Estadísticas

- **Skills totales en skills.sh**: ~61,000+ (y creciendo)
- **Skills incluidas en este script**: ~170 populares
- **Tiempo estimado**: 5-15 minutos para todas

## 🤝 Contribuir

Si encuentras skills nuevas o quieres agregar categorías:
1. Edita el archivo `install-skills.py`
2. Agrega las skills a la categoría correspondiente
3. Envía un pull request

## 📄 Licencia

MIT - Libre para usar y modificar

---

**Creado con ❤️ para la comunidad de AI agents**

Para más información, visita: https://skills.sh/
