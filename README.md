# AI ResearchMR - Multi-Agent MCP Server

Based on the JSON engines for Scientific Research ("Asesor Investigacion"), this MCP Server provides a specialized multi-agent system to guide you through your thesis or research paper.

## 🚀 Features v1.0

-   **Multi-Agent Architecture**:
    -   **Orchestrator**: Manages workflow with **Auto-Routing** (detects quantitative/qualitative paths automatically).
    -   **Methodologist**: 
        -   Advises on designs (Experimental, Non-experimental, **Mixed Methods**).
        -   Calculates **Sample Sizes** with precise Z-scores (90%, 95%, 99%).
        -   **Golden Rule Validation**: Prevents methodologically inconsistent combinations.
    -   **Hypothesis Expert**: Formulates variables and hypotheses (Descriptive, Correlational, Causal, **Qualitative**).
    -   **Reviewer**: Generates **Boolean Search Queries** and guides PRISMA reviews.
    -   **Writer**: 
        -   Drafts specialized sections for **Theses, Essays, and Scientific Papers**.
        -   Provides **Academic Connectors** to improve text flow.
-   **State Persistence**: Auto-saves progress in `research_state.json`.
-   **Resource Access**: raw JSON engine access via `research://engine/<name>`.

## 🔌 Integrations

-   **Google NotebookLM**: The server includes specific guidance (`assets/notebooklm_tool.json`) for integrating with the `notebooklm-mcp` server to ground your research in specific documents.

## 📦 Installation

This project is already built in `C:\Users\Admin\Desktop\Asesor Investigacion\JSON\ai-research-mr`.

### Configure Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "research-mr": {
      "command": "node",
      "args": [
        "C:\\Users\\Admin\\Desktop\\Asesor Investigacion\\JSON\\ai-research-mr\\build\\index.js"
      ]
    }
  }
}
```

## 🛠️ Usage

1.  **Start a Chat**: Open Claude or your MCP client.
2.  **Initialize**: Ask "Start a new research project".
3.  **Explore**:
    -   "My study is Qualitative." -> *System auto-routes to qualitative steps.*
    -   "Calculate sample for 5000 people at 99% confidence."
    -   "Give me a hypothesis for 'Teacher Resilience' in 'Rural Context'." -> *Generates Qualitative Hypothesis.*
    -   "Give me standard deviations connectors." -> *Writer provides list.*

## 📂 Project Structure

-   `src/agents/`: specialized interaction logic.
-   `src/managers/`: state and resource handling.
-   `assets/`: JSON Knowledge Base (The "Brain").
-   `research_state.json`: user session tracking.
