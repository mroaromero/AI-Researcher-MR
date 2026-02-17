#!/bin/bash

# Script de compresión de skills - CONTRA LABS Optimización
# Reduce 217 skills a 25 esenciales

echo "🗜️  COMPRESIÓN DE SKILLS - CONTRA LABS"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="C:\Users\Admin\Desktop\ai-research-mr"
SKILLS_DIR="$PROJECT_DIR/.opencode/skills"

# Verificar directorio
if [ ! -d "$SKILLS_DIR" ]; then
    echo "❌ Error: No se encuentra $SKILLS_DIR"
    exit 1
fi

# Contar skills actuales
current_count=$(ls -1 "$SKILLS_DIR" | wc -l)
echo -e "${BLUE}Skills actuales:${NC} $current_count"
echo ""

# Lista de 25 skills esenciales
declare -a ESSENTIAL_SKILLS=(
    # Core Web (5)
    "vercel-react-best-practices"
    "web-design-guidelines"
    "nextjs-app-router-patterns"
    "responsive-design"
    "tailwind-design-system"
    
    # Backend (4)
    "nodejs-backend-patterns"
    "api-design-principles"
    "fastapi-templates"
    "postgresql-table-design"
    
    # DevOps (2)
    "github-actions-templates"
    "deployment-pipeline-design"
    
    # Testing (3)
    "test-driven-development"
    "e2e-testing-patterns"
    "systematic-debugging"
    
    # Data/ML (4)
    "ml-pipeline-workflow"
    "data-exploration"
    "rag-implementation"
    "llm-engineering"
    
    # Security (2)
    "secrets-management"
    "auth-implementation-patterns"
    
    # Algoritmos & Compresión (3)
    "algorithm-design"
    "data-compression"
    "python-performance-optimization"
    
    # Orquestador (1)
    "dream-team-orchestrator"
    "contra-labs-orchestrator"
)

echo -e "${YELLOW}Paso 1:${NC} Creando backup de skills originales..."
backup_dir="$PROJECT_DIR/.opencode/skills-backup-$(date +%Y%m%d-%H%M%S)"
cp -r "$SKILLS_DIR" "$backup_dir"
echo -e "${GREEN}✓${NC} Backup creado: $backup_dir"
echo ""

echo -e "${YELLOW}Paso 2:${NC} Creando directorio temporal..."
temp_dir="$PROJECT_DIR/.opencode/skills-temp-$$"
mkdir -p "$temp_dir"
echo -e "${GREEN}✓${NC} Directorio temporal creado"
echo ""

echo -e "${YELLOW}Paso 3:${NC} Copiando skills esenciales..."
copied=0
failed=0

for skill in "${ESSENTIAL_SKILLS[@]}"; do
    if [ -d "$SKILLS_DIR/$skill" ]; then
        cp -r "$SKILLS_DIR/$skill" "$temp_dir/"
        echo -e "  ${GREEN}✓${NC} $skill"
        ((copied++))
    else
        echo -e "  ${YELLOW}⚠${NC} $skill (no encontrado)"
        ((failed++))
    fi
done

echo ""
echo -e "${GREEN}Copiados:${NC} $copied | ${YELLOW}No encontrados:${NC} $failed"
echo ""

echo -e "${YELLOW}Paso 4:${NC} Reemplazando skills..."
# Eliminar skills actuales
rm -rf "$SKILLS_DIR"/*

# Mover skills esenciales
mv "$temp_dir"/* "$SKILLS_DIR/"

# Limpiar directorio temporal
rmdir "$temp_dir" 2>/dev/null || true

echo -e "${GREEN}✓${NC} Skills reemplazados"
echo ""

echo -e "${YELLOW}Paso 5:${NC} Verificando resultado..."
new_count=$(ls -1 "$SKILLS_DIR" | wc -l)
reduction=$((100 - (new_count * 100 / current_count)))

echo ""
echo "📊 RESULTADOS:"
echo "================"
echo -e "  ${BLUE}Skills originales:${NC} $current_count"
echo -e "  ${GREEN}Skills esenciales:${NC} $new_count"
echo -e "  ${YELLOW}Reducción:${NC} $reduction%"
echo -e "  ${GREEN}Overhead cognitivo:${NC} Mínimo"
echo ""

# Crear resumen
cat > "$PROJECT_DIR/SKILLS-OPTIMIZATION-RESULT.txt" << EOF
OPTIMIZACIÓN DE SKILLS - RESULTADOS
====================================
Fecha: $(date)
Proyecto: ai-research-mr

ESTADÍSTICAS:
- Skills originales: $current_count
- Skills esenciales: $new_count
- Reducción: $reduction%
- Backup: $backup_dir

SKILLS ESENCIALES MANTENIDAS:
$(ls -1 "$SKILLS_DIR")

BENEFICIOS:
✓ 88% menos de complejidad
✓ Selección de skills instantánea
✓ Overhead cognitivo mínimo
✓ Mantenible por 1 persona
✓ Optimizado para OpenRouter FREE

PRÓXIMOS PASOS:
1. Configurar OpenRouter optimizer
2. Probar sistema reducido
3. Documentar skills seleccionadas
EOF

echo -e "${GREEN}✓${NC} Resumen guardado: SKILLS-OPTIMIZATION-RESULT.txt"
echo ""

echo -e "${BLUE}Skills disponibles:${NC}"
ls -1 "$SKILLS_DIR" | nl
echo ""

echo -e "${GREEN}🎉 Optimización completada!${NC}"
echo ""
echo "Tu sistema ahora tiene solo $new_count skills esenciales."
echo "Listo para usar con OpenRouter FREE de manera eficiente."
