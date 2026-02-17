#!/bin/bash

# ============================================================
# Instalador Automático de Skills desde skills.sh
# ============================================================
# Este script instala las skills más populares y permite
# instalar todas las skills de un repositorio específico
# ============================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio donde se guardarán las skills
SKILLS_DIR="${1:-./skills}"
mkdir -p "$SKILLS_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Instalador de Skills - skills.sh${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Directorio de instalación: ${GREEN}$SKILLS_DIR${NC}"
echo ""

# Contador de skills instaladas
INSTALLED=0
FAILED=0

# Función para instalar una skill
install_skill() {
    local repo="$1"
    local skill_name="$2"
    
    echo -e "${YELLOW}Instalando:${NC} $repo${skill_name:+/$skill_name}"
    
    if [ -n "$skill_name" ]; then
        if npx skills add "$repo" --skill "$skill_name" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} Instalado: $repo/$skill_name"
            ((INSTALLED++))
        else
            echo -e "${RED}✗${NC} Error instalando: $repo/$skill_name"
            ((FAILED++))
        fi
    else
        if npx skills add "$repo" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} Instalado: $repo"
            ((INSTALLED++))
        else
            echo -e "${RED}✗${NC} Error instalando: $repo"
            ((FAILED++))
        fi
    fi
}

# ============================================================
# SKILLS PRINCIPALES (Más populares según skills.sh)
# ============================================================

echo -e "${BLUE}Instalando skills principales...${NC}"
echo ""

# 1. Vercel Labs - Colección principal de agent skills
install_skill "vercel-labs/agent-skills"

# 2. Skill para encontrar más skills
install_skill "vercel-labs/skills" "find-skills"

# 3. Next.js skills
install_skill "vercel-labs/next-skills" "next-best-practices"
install_skill "vercel-labs/next-skills" "next-cache-components"
install_skill "vercel-labs/next-skills" "next-upgrade"

# 4. AI SDK
install_skill "vercel/ai" "ai-sdk"

# 5. Turborepo
install_skill "vercel/turborepo" "turborepo"

# 6. Anthropic skills
install_skill "anthropics/skills" "frontend-design"
install_skill "anthropics/skills" "skill-creator"
install_skill "anthropics/skills" "mcp-builder"
install_skill "anthropics/skills" "webapp-testing"
install_skill "anthropics/skills" "canvas-design"
install_skill "anthropics/skills" "brand-guidelines"
install_skill "anthropics/skills" "pdf"
install_skill "anthropics/skills" "pptx"
install_skill "anthropics/skills" "docx"
install_skill "anthropics/skills" "xlsx"
install_skill "anthropics/skills" "algorithmic-art"
install_skill "anthropics/skills" "web-artifacts-builder"
install_skill "anthropics/skills" "theme-factory"
install_skill "anthropics/skills" "internal-comms"
install_skill "anthropics/skills" "slack-gif-creator"
install_skill "anthropics/skills" "doc-coauthoring"
install_skill "anthropics/skills" "template-skill"

# 7. Obra Superpowers
install_skill "obra/superpowers" "brainstorming"
install_skill "obra/superpowers" "systematic-debugging"
install_skill "obra/superpowers" "writing-plans"
install_skill "obra/superpowers" "test-driven-development"
install_skill "obra/superpowers" "executing-plans"
install_skill "obra/superpowers" "requesting-code-review"
install_skill "obra/superpowers" "using-superpowers"
install_skill "obra/superpowers" "subagent-driven-development"
install_skill "obra/superpowers" "verification-before-completion"
install_skill "obra/superpowers" "using-git-worktrees"
install_skill "obra/superpowers" "receiving-code-review"
install_skill "obra/superpowers" "finishing-a-development-branch"
install_skill "obra/superpowers" "writing-skills"
install_skill "obra/superpowers" "dispatching-parallel-agents"

# 8. Marketing skills
install_skill "coreyhaines31/marketingskills" "seo-audit"
install_skill "coreyhaines31/marketingskills" "copywriting"
install_skill "coreyhaines31/marketingskills" "marketing-psychology"
install_skill "coreyhaines31/marketingskills" "programmatic-seo"
install_skill "coreyhaines31/marketingskills" "content-strategy"
install_skill "coreyhaines31/marketingskills" "product-marketing-context"
install_skill "coreyhaines31/marketingskills" "marketing-ideas"
install_skill "coreyhaines31/marketingskills" "copy-editing"
install_skill "coreyhaines31/marketingskills" "social-content"
install_skill "coreyhaines31/marketingskills" "pricing-strategy"
install_skill "coreyhaines31/marketingskills" "page-cro"
install_skill "coreyhaines31/marketingskills" "launch-strategy"
install_skill "coreyhaines31/marketingskills" "analytics-tracking"
install_skill "coreyhaines31/marketingskills" "schema-markup"
install_skill "coreyhaines31/marketingskills" "form-cro"
install_skill "coreyhaines31/marketingskills" "onboarding-cro"
install_skill "coreyhaines31/marketingskills" "competitor-alternatives"
install_skill "coreyhaines31/marketingskills" "referral-program"
install_skill "coreyhaines31/marketingskills" "paid-ads"
install_skill "coreyhaines31/marketingskills" "email-sequence"
install_skill "coreyhaines31/marketingskills" "ab-test-setup"
install_skill "coreyhaines31/marketingskills" "free-tool-strategy"
install_skill "coreyhaines31/marketingskills" "signup-flow-cro"
install_skill "coreyhaines31/marketingskills" "paywall-upgrade-cro"
install_skill "coreyhaines31/marketingskills" "popup-cro"

# 9. Expo/React Native
install_skill "expo/skills" "building-native-ui"
install_skill "expo/skills" "native-data-fetching"
install_skill "expo/skills" "upgrading-expo"
install_skill "expo/skills" "expo-dev-client"
install_skill "expo/skills" "expo-deployment"
install_skill "expo/skills" "expo-tailwind-setup"
install_skill "expo/skills" "expo-api-routes"
install_skill "expo/skills" "expo-cicd-workflows"
install_skill "expo/skills" "use-dom"

# 10. Supabase
install_skill "supabase/agent-skills" "supabase-postgres-best-practices"

# 11. Better Auth
install_skill "better-auth/skills" "better-auth-best-practices"
install_skill "better-auth/skills" "create-auth-skill"

# 12. Remotion
install_skill "remotion-dev/skills" "remotion-best-practices"

# 13. Browser automation
install_skill "browser-use/browser-use" "browser-use"
install_skill "vercel-labs/agent-browser" "agent-browser"
install_skill "inference-sh-0/skills" "agent-tools"
install_skill "inference-sh-0/skills" "agent-browser"

# 14. Website audit
install_skill "squirrelscan/skills" "audit-website"

# 15. UI/UX Pro
install_skill "nextlevelbuilder/ui-ux-pro-max-skill" "ui-ux-pro-max"

# 16. Design Systems
install_skill "wshobson/agents" "tailwind-design-system"
install_skill "wshobson/agents" "typescript-advanced-types"
install_skill "wshobson/agents" "api-design-principles"
install_skill "wshobson/agents" "nodejs-backend-patterns"
install_skill "wshobson/agents" "python-performance-optimization"
install_skill "wshobson/agents" "architecture-patterns"
install_skill "wshobson/agents" "nextjs-app-router-patterns"
install_skill "wshobson/agents" "prompt-engineering-patterns"
install_skill "wshobson/agents" "python-testing-patterns"
install_skill "wshobson/agents" "responsive-design"
install_skill "wshobson/agents" "fastapi-templates"
install_skill "wshobson/agents" "e2e-testing-patterns"
install_skill "wshobson/agents" "error-handling-patterns"
install_skill "wshobson/agents" "sql-optimization-patterns"
install_skill "wshobson/agents" "github-actions-templates"
install_skill "wshobson/agents" "javascript-testing-patterns"
install_skill "wshobson/agents" "design-system-patterns"
install_skill "wshobson/agents" "mobile-ios-design"
install_skill "wshobson/agents" "mobile-android-design"
install_skill "wshobson/agents" "code-review-excellence"
install_skill "wshobson/agents" "postgresql-table-design"
install_skill "wshobson/agents" "async-python-patterns"

# 17. Antfu skills
install_skill "antfu/skills" "vite"
install_skill "antfu/skills" "vue"
install_skill "antfu/skills" "vitest"
install_skill "antfu/skills" "pnpm"
install_skill "antfu/skills" "vue-best-practices"
install_skill "antfu/skills" "vueuse-functions"
install_skill "antfu/skills" "pinia"
install_skill "antfu/skills" "web-design-guidelines"
install_skill "antfu/skills" "nuxt"
install_skill "antfu/skills" "vitepress"
install_skill "antfu/skills" "unocss"
install_skill "antfu/skills" "antfu"

# 18. React Native (Callstack)
install_skill "callstackincubator/agent-skills" "react-native-best-practices"

# 19. SwiftUI
install_skill "avdlee/swiftui-agent-skill" "swiftui-expert-skill"

# 20. NestJS
install_skill "kadajett/agent-nestjs-skills" "nestjs-best-practices"

# 21. Vue
install_skill "hyf0/vue-skills" "vue-debug-guides"
install_skill "hyf0/vue-skills" "vue-best-practices"

# 22. Firecrawl
install_skill "firecrawl/cli" "firecrawl"

# 23. Convex
install_skill "waynesutton/convexskills" "convex"

# 24. Shadcn UI
install_skill "giuseppe-trisciuoglio/developer-kit" "shadcn-ui"
install_skill "jezweb/claude-skills" "tailwind-v4-shadcn"
install_skill "google-labs-code/stitch-skills" "shadcn-ui"

# 25. Google Labs Stitch
install_skill "google-labs-code/stitch-skills" "react:components"
install_skill "google-labs-code/stitch-skills" "design-md"
install_skill "google-labs-code/stitch-skills" "stitch-loop"
install_skill "google-labs-code/stitch-skills" "enhance-prompt"

# 26. Ralph TUI
install_skill "subsy/ralph-tui" "ralph-tui-prd"
install_skill "subsy/ralph-tui" "ralph-tui-create-json"
install_skill "subsy/ralph-tui" "ralph-tui-create-beads"
install_skill "subsy/ralph-tui" "ralph-tui-create-beads-rust"

# 27. Baoyu
install_skill "jimliu/baoyu-skills" "baoyu-post-to-x"
install_skill "jimliu/baoyu-skills" "baoyu-slide-deck"
install_skill "jimliu/baoyu-skills" "baoyu-article-illustrator"
install_skill "jimliu/baoyu-skills" "release-skills"
install_skill "jimliu/baoyu-skills" "baoyu-cover-image"
install_skill "jimliu/baoyu-skills" "baoyu-danger-x-to-markdown"
install_skill "jimliu/baoyu-skills" "baoyu-xhs-images"
install_skill "jimliu/baoyu-skills" "baoyu-comic"
install_skill "jimliu/baoyu-skills" "baoyu-post-to-wechat"
install_skill "jimliu/baoyu-skills" "baoyu-image-gen"
install_skill "jimliu/baoyu-skills" "baoyu-compress-image"
install_skill "jimliu/baoyu-skills" "baoyu-infographic"
install_skill "jimliu/baoyu-skills" "baoyu-danger-gemini-web"
install_skill "jimliu/baoyu-skills" "baoyu-url-to-markdown"

# 28. Otros populares
install_skill "madteacher/mad-agents-skills" "flutter-animations"
install_skill "othmanadi/planning-with-files" "planning-with-files"
install_skill "op7418/humanizer-zh" "humanizer-zh"
install_skill "benjitaylor/agentation" "agentation"
install_skill "resciencelab/opc-skills" "seo-geo"
install_skill "magicseek/nblm" "nblm"
install_skill "napoleond/clawdirect" "clawdirect"
install_skill "napoleond/instaclaw" "instaclaw"
install_skill "napoleond/clawdirect" "clawdirect-dev"
install_skill "obra/episodic-memory" "remembering-conversations"
install_skill "dammyjay93/interface-design" "interface-design"
install_skill "aiskillstore/marketplace" "skill-installer"
install_skill "evgyur/find-skills" "find-skills"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Instalación completada!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Skills instaladas exitosamente: ${GREEN}$INSTALLED${NC}"
echo -e "Skills con errores: ${RED}$FAILED${NC}"
echo ""
echo -e "${YELLOW}Nota:${NC} Algunas skills pueden requerir configuración adicional."
echo -e "Revisa la documentación de cada skill en ${BLUE}https://skills.sh/${NC}"
echo ""

# Crear archivo de resumen
cat > "$SKILLS_DIR/installed-skills.txt" << EOF
Skills Installation Report
==========================
Fecha: $(date)
Directorio: $SKILLS_DIR

Total instaladas: $INSTALLED
Total con errores: $FAILED

Para instalar más skills individualmente:
  npx skills add <owner/repo>

Para buscar nuevas skills:
  npx skills add vercel-labs/skills --skill find-skills

Lista completa de skills disponibles:
  https://skills.sh/
EOF

echo -e "Resumen guardado en: ${GREEN}$SKILLS_DIR/installed-skills.txt${NC}"
