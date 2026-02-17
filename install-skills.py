#!/usr/bin/env python3
"""
Instalador Automático de Skills desde skills.sh
===============================================

Este script instala las skills más populares desde skills.sh
Puedes instalar todas o seleccionar categorías específicas.

Uso:
    python install-skills.py [opciones]

Opciones:
    --all           Instalar todas las skills (puede tardar mucho)
    --category X    Instalar solo una categoría específica
    --list          Listar categorías disponibles
    --dry-run       Simular instalación sin ejecutar comandos
    --dir PATH      Directorio de instalación (default: ./skills)

Ejemplos:
    python install-skills.py --all
    python install-skills.py --category vercel
    python install-skills.py --category marketing --dir ./my-skills
"""

import subprocess
import sys
import os
import argparse
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import json


# Colores para terminal
class Colors:
    RED = "\033[0;31m"
    GREEN = "\033[0;32m"
    YELLOW = "\033[1;33m"
    BLUE = "\033[0;34m"
    CYAN = "\033[0;36m"
    NC = "\033[0m"


# Skills organizadas por categorías
SKILLS_CATEGORIES = {
    "vercel": [
        ("vercel-labs/agent-skills", None),
        ("vercel-labs/skills", "find-skills"),
        ("vercel-labs/next-skills", "next-best-practices"),
        ("vercel-labs/next-skills", "next-cache-components"),
        ("vercel-labs/next-skills", "next-upgrade"),
        ("vercel/ai", "ai-sdk"),
        ("vercel/turborepo", "turborepo"),
        ("vercel-labs/agent-browser", "agent-browser"),
    ],
    "anthropic": [
        ("anthropics/skills", "frontend-design"),
        ("anthropics/skills", "skill-creator"),
        ("anthropics/skills", "mcp-builder"),
        ("anthropics/skills", "webapp-testing"),
        ("anthropics/skills", "canvas-design"),
        ("anthropics/skills", "brand-guidelines"),
        ("anthropics/skills", "pdf"),
        ("anthropics/skills", "pptx"),
        ("anthropics/skills", "docx"),
        ("anthropics/skills", "xlsx"),
        ("anthropics/skills", "algorithmic-art"),
        ("anthropics/skills", "web-artifacts-builder"),
        ("anthropics/skills", "theme-factory"),
        ("anthropics/skills", "internal-comms"),
        ("anthropics/skills", "slack-gif-creator"),
        ("anthropics/skills", "doc-coauthoring"),
        ("anthropics/skills", "template-skill"),
    ],
    "obra": [
        ("obra/superpowers", "brainstorming"),
        ("obra/superpowers", "systematic-debugging"),
        ("obra/superpowers", "writing-plans"),
        ("obra/superpowers", "test-driven-development"),
        ("obra/superpowers", "executing-plans"),
        ("obra/superpowers", "requesting-code-review"),
        ("obra/superpowers", "using-superpowers"),
        ("obra/superpowers", "subagent-driven-development"),
        ("obra/superpowers", "verification-before-completion"),
        ("obra/superpowers", "using-git-worktrees"),
        ("obra/superpowers", "receiving-code-review"),
        ("obra/superpowers", "finishing-a-development-branch"),
        ("obra/superpowers", "writing-skills"),
        ("obra/superpowers", "dispatching-parallel-agents"),
        ("obra/episodic-memory", "remembering-conversations"),
    ],
    "marketing": [
        ("coreyhaines31/marketingskills", "seo-audit"),
        ("coreyhaines31/marketingskills", "copywriting"),
        ("coreyhaines31/marketingskills", "marketing-psychology"),
        ("coreyhaines31/marketingskills", "programmatic-seo"),
        ("coreyhaines31/marketingskills", "content-strategy"),
        ("coreyhaines31/marketingskills", "product-marketing-context"),
        ("coreyhaines31/marketingskills", "marketing-ideas"),
        ("coreyhaines31/marketingskills", "copy-editing"),
        ("coreyhaines31/marketingskills", "social-content"),
        ("coreyhaines31/marketingskills", "pricing-strategy"),
        ("coreyhaines31/marketingskills", "page-cro"),
        ("coreyhaines31/marketingskills", "launch-strategy"),
        ("coreyhaines31/marketingskills", "analytics-tracking"),
        ("coreyhaines31/marketingskills", "schema-markup"),
        ("coreyhaines31/marketingskills", "form-cro"),
        ("coreyhaines31/marketingskills", "onboarding-cro"),
        ("coreyhaines31/marketingskills", "competitor-alternatives"),
        ("coreyhaines31/marketingskills", "referral-program"),
        ("coreyhaines31/marketingskills", "paid-ads"),
        ("coreyhaines31/marketingskills", "email-sequence"),
        ("coreyhaines31/marketingskills", "ab-test-setup"),
        ("coreyhaines31/marketingskills", "free-tool-strategy"),
        ("coreyhaines31/marketingskills", "signup-flow-cro"),
        ("coreyhaines31/marketingskills", "paywall-upgrade-cro"),
        ("coreyhaines31/marketingskills", "popup-cro"),
    ],
    "expo": [
        ("expo/skills", "building-native-ui"),
        ("expo/skills", "native-data-fetching"),
        ("expo/skills", "upgrading-expo"),
        ("expo/skills", "expo-dev-client"),
        ("expo/skills", "expo-deployment"),
        ("expo/skills", "expo-tailwind-setup"),
        ("expo/skills", "expo-api-routes"),
        ("expo/skills", "expo-cicd-workflows"),
        ("expo/skills", "use-dom"),
    ],
    "react-native": [
        ("callstackincubator/agent-skills", "react-native-best-practices"),
        ("vercel-labs/agent-skills", "vercel-react-native-skills"),
    ],
    "backend": [
        ("supabase/agent-skills", "supabase-postgres-best-practices"),
        ("better-auth/skills", "better-auth-best-practices"),
        ("better-auth/skills", "create-auth-skill"),
        ("waynesutton/convexskills", "convex"),
        ("kadajett/agent-nestjs-skills", "nestjs-best-practices"),
    ],
    "browser": [
        ("browser-use/browser-use", "browser-use"),
        ("inference-sh-0/skills", "agent-tools"),
        ("inference-sh-0/skills", "agent-browser"),
        ("squirrelscan/skills", "audit-website"),
        ("firecrawl/cli", "firecrawl"),
    ],
    "design": [
        ("nextlevelbuilder/ui-ux-pro-max-skill", "ui-ux-pro-max"),
        ("dammyjay93/interface-design", "interface-design"),
    ],
    "wshobson": [
        ("wshobson/agents", "tailwind-design-system"),
        ("wshobson/agents", "typescript-advanced-types"),
        ("wshobson/agents", "api-design-principles"),
        ("wshobson/agents", "nodejs-backend-patterns"),
        ("wshobson/agents", "python-performance-optimization"),
        ("wshobson/agents", "architecture-patterns"),
        ("wshobson/agents", "nextjs-app-router-patterns"),
        ("wshobson/agents", "prompt-engineering-patterns"),
        ("wshobson/agents", "python-testing-patterns"),
        ("wshobson/agents", "responsive-design"),
        ("wshobson/agents", "fastapi-templates"),
        ("wshobson/agents", "e2e-testing-patterns"),
        ("wshobson/agents", "error-handling-patterns"),
        ("wshobson/agents", "sql-optimization-patterns"),
        ("wshobson/agents", "github-actions-templates"),
        ("wshobson/agents", "javascript-testing-patterns"),
        ("wshobson/agents", "design-system-patterns"),
        ("wshobson/agents", "mobile-ios-design"),
        ("wshobson/agents", "mobile-android-design"),
        ("wshobson/agents", "code-review-excellence"),
        ("wshobson/agents", "postgresql-table-design"),
        ("wshobson/agents", "async-python-patterns"),
    ],
    "antfu": [
        ("antfu/skills", "vite"),
        ("antfu/skills", "vue"),
        ("antfu/skills", "vitest"),
        ("antfu/skills", "pnpm"),
        ("antfu/skills", "vue-best-practices"),
        ("antfu/skills", "vueuse-functions"),
        ("antfu/skills", "pinia"),
        ("antfu/skills", "web-design-guidelines"),
        ("antfu/skills", "nuxt"),
        ("antfu/skills", "vitepress"),
        ("antfu/skills", "unocss"),
        ("antfu/skills", "antfu"),
    ],
    "vue": [
        ("hyf0/vue-skills", "vue-debug-guides"),
        ("hyf0/vue-skills", "vue-best-practices"),
    ],
    "mobile": [
        ("avdlee/swiftui-agent-skill", "swiftui-expert-skill"),
        ("madteacher/mad-agents-skills", "flutter-animations"),
    ],
    "shadcn": [
        ("giuseppe-trisciuoglio/developer-kit", "shadcn-ui"),
        ("jezweb/claude-skills", "tailwind-v4-shadcn"),
        ("google-labs-code/stitch-skills", "shadcn-ui"),
    ],
    "google-stitch": [
        ("google-labs-code/stitch-skills", "react:components"),
        ("google-labs-code/stitch-skills", "design-md"),
        ("google-labs-code/stitch-skills", "stitch-loop"),
        ("google-labs-code/stitch-skills", "enhance-prompt"),
    ],
    "media": [
        ("remotion-dev/skills", "remotion-best-practices"),
    ],
    "ralph-tui": [
        ("subsy/ralph-tui", "ralph-tui-prd"),
        ("subsy/ralph-tui", "ralph-tui-create-json"),
        ("subsy/ralph-tui", "ralph-tui-create-beads"),
        ("subsy/ralph-tui", "ralph-tui-create-beads-rust"),
    ],
    "baoyu": [
        ("jimliu/baoyu-skills", "baoyu-post-to-x"),
        ("jimliu/baoyu-skills", "baoyu-slide-deck"),
        ("jimliu/baoyu-skills", "baoyu-article-illustrator"),
        ("jimliu/baoyu-skills", "release-skills"),
        ("jimliu/baoyu-skills", "baoyu-cover-image"),
        ("jimliu/baoyu-skills", "baoyu-danger-x-to-markdown"),
        ("jimliu/baoyu-skills", "baoyu-xhs-images"),
        ("jimliu/baoyu-skills", "baoyu-comic"),
        ("jimliu/baoyu-skills", "baoyu-post-to-wechat"),
        ("jimliu/baoyu-skills", "baoyu-image-gen"),
        ("jimliu/baoyu-skills", "baoyu-compress-image"),
        ("jimliu/baoyu-skills", "baoyu-infographic"),
        ("jimliu/baoyu-skills", "baoyu-danger-gemini-web"),
        ("jimliu/baoyu-skills", "baoyu-url-to-markdown"),
    ],
    "others": [
        ("othmanadi/planning-with-files", "planning-with-files"),
        ("op7418/humanizer-zh", "humanizer-zh"),
        ("benjitaylor/agentation", "agentation"),
        ("resciencelab/opc-skills", "seo-geo"),
        ("magicseek/nblm", "nblm"),
        ("napoleond/clawdirect", "clawdirect"),
        ("napoleond/instaclaw", "instaclaw"),
        ("napoleond/clawdirect", "clawdirect-dev"),
        ("aiskillstore/marketplace", "skill-installer"),
        ("evgyur/find-skills", "find-skills"),
    ],
}


def install_skill(repo, skill_name, dry_run=False, skills_dir="."):
    """Instala una skill individual"""
    if skill_name:
        cmd = f"npx skills add {repo} --skill {skill_name}"
        display_name = f"{repo}/{skill_name}"
    else:
        cmd = f"npx skills add {repo}"
        display_name = repo

    if dry_run:
        print(f"{Colors.CYAN}[DRY-RUN]{Colors.NC} Simulando: {cmd}")
        return True, display_name

    try:
        result = subprocess.run(
            cmd.split(), capture_output=True, text=True, timeout=60, cwd=skills_dir
        )

        if result.returncode == 0:
            print(f"{Colors.GREEN}✓{Colors.NC} Instalado: {display_name}")
            return True, display_name
        else:
            print(f"{Colors.RED}✗{Colors.NC} Error: {display_name}")
            if result.stderr:
                print(f"   {Colors.RED}{result.stderr[:100]}{Colors.NC}")
            return False, display_name
    except subprocess.TimeoutExpired:
        print(f"{Colors.RED}✗{Colors.NC} Timeout: {display_name}")
        return False, display_name
    except Exception as e:
        print(f"{Colors.RED}✗{Colors.NC} Excepción: {display_name} - {str(e)[:50]}")
        return False, display_name


def install_category(
    category, parallel=True, dry_run=False, skills_dir=".", max_workers=5
):
    """Instala todas las skills de una categoría"""
    if category not in SKILLS_CATEGORIES:
        print(f"{Colors.RED}Error: Categoría '{category}' no encontrada{Colors.NC}")
        return 0, 0

    skills = SKILLS_CATEGORIES[category]
    print(
        f"\n{Colors.BLUE}Instalando categoría: {category} ({len(skills)} skills){Colors.NC}\n"
    )

    installed = 0
    failed = 0

    if parallel:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [
                executor.submit(install_skill, repo, skill, dry_run, skills_dir)
                for repo, skill in skills
            ]

            for future in as_completed(futures):
                success, name = future.result()
                if success:
                    installed += 1
                else:
                    failed += 1
    else:
        for repo, skill in skills:
            success, name = install_skill(repo, skill, dry_run, skills_dir)
            if success:
                installed += 1
            else:
                failed += 1

    return installed, failed


def install_all(parallel=True, dry_run=False, skills_dir=".", max_workers=5):
    """Instala todas las skills de todas las categorías"""
    total_installed = 0
    total_failed = 0

    for category in SKILLS_CATEGORIES:
        installed, failed = install_category(
            category, parallel, dry_run, skills_dir, max_workers
        )
        total_installed += installed
        total_failed += failed

    return total_installed, total_failed


def list_categories():
    """Lista todas las categorías disponibles"""
    print(f"\n{Colors.BLUE}Categorías disponibles:{Colors.NC}\n")
    for category, skills in SKILLS_CATEGORIES.items():
        print(f"  {Colors.CYAN}{category}{Colors.NC}: {len(skills)} skills")
    print(
        f"\n{Colors.YELLOW}Total:{Colors.NC} {sum(len(skills) for skills in SKILLS_CATEGORIES.values())} skills"
    )


def main():
    parser = argparse.ArgumentParser(
        description="Instalador automático de skills desde skills.sh",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python install-skills.py --all                    # Instalar todo
  python install-skills.py --category vercel        # Solo categoría vercel
  python install-skills.py --list                   # Ver categorías
  python install-skills.py --all --dry-run          # Simular instalación
  python install-skills.py --all --dir ./skills     # Directorio específico
        """,
    )

    parser.add_argument("--all", action="store_true", help="Instalar todas las skills")
    parser.add_argument(
        "--category", type=str, help="Instalar solo una categoría específica"
    )
    parser.add_argument(
        "--list", action="store_true", help="Listar categorías disponibles"
    )
    parser.add_argument("--dry-run", action="store_true", help="Simular sin instalar")
    parser.add_argument(
        "--dir",
        type=str,
        default="./skills",
        help="Directorio de instalación (default: ./skills)",
    )
    parser.add_argument(
        "--sequential",
        action="store_true",
        help="Instalar secuencialmente (más lento pero más seguro)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=5,
        help="Número de workers paralelos (default: 5)",
    )

    args = parser.parse_args()

    # Banner
    print(f"""
{Colors.BLUE}╔══════════════════════════════════════════════════════════╗
║                                                          ║
║     {Colors.CYAN}Instalador Automático de Skills - skills.sh{Colors.BLUE}         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝{Colors.NC}
""")

    if args.list:
        list_categories()
        return

    # Crear directorio
    os.makedirs(args.dir, exist_ok=True)
    print(f"{Colors.YELLOW}Directorio de instalación:{Colors.NC} {args.dir}\n")

    if args.dry_run:
        print(f"{Colors.CYAN}MODO SIMULACIÓN - No se instalará nada{Colors.NC}\n")

    parallel = not args.sequential

    start_time = datetime.now()

    if args.all:
        print(f"{Colors.BLUE}Instalando TODAS las skills...{Colors.NC}\n")
        installed, failed = install_all(parallel, args.dry_run, args.dir, args.workers)
    elif args.category:
        installed, failed = install_category(
            args.category, parallel, args.dry_run, args.dir, args.workers
        )
    else:
        print(
            f"{Colors.YELLOW}No se especificó acción. Use --all o --category{Colors.NC}"
        )
        print(f"Use --list para ver categorías disponibles")
        parser.print_help()
        return

    elapsed = datetime.now() - start_time

    # Resumen
    print(f"\n{Colors.BLUE}{'=' * 50}{Colors.NC}")
    print(f"{Colors.GREEN}✓ Instalación completada!{Colors.NC}")
    print(f"{Colors.BLUE}{'=' * 50}{Colors.NC}\n")
    print(f"  {Colors.GREEN}Exitosas:{Colors.NC} {installed}")
    print(f"  {Colors.RED}Fallidas:{Colors.NC} {failed}")
    print(f"  {Colors.YELLOW}Tiempo:{Colors.NC} {elapsed}")
    print(
        f"\n{Colors.YELLOW}Nota:{Colors.NC} Algunas skills pueden requerir configuración adicional."
    )

    # Guardar resumen
    if not args.dry_run:
        summary_file = os.path.join(args.dir, "installed-skills.txt")
        with open(summary_file, "w") as f:
            f.write(f"""Skills Installation Report
{"=" * 50}
Fecha: {datetime.now()}
Directorio: {args.dir}

Total instaladas: {installed}
Total fallidas: {failed}
Tiempo: {elapsed}

Para instalar más skills individualmente:
  npx skills add <owner/repo>

Para buscar nuevas skills:
  npx skills add vercel-labs/skills --skill find-skills

Lista completa:
  https://skills.sh/
""")
        print(f"\n{Colors.GREEN}Resumen guardado en:{Colors.NC} {summary_file}")


if __name__ == "__main__":
    main()
