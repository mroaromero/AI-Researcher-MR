#!/usr/bin/env python3
"""
Instalador Completo de Skills Técnicos desde skills.sh
=======================================================

Script ampliado con TODAS las especializaciones de programación:
- Web3/Blockchain
- Game Development
- AR/VR
- Data/ML/AI
- Systems Programming
- Mobile Native (iOS/Android)
- DevOps/Platform/SRE avanzado
- Testing avanzado
- Y más...

Uso:
    python install-all-tech-skills.py [opciones]

Opciones:
    --all              Instalar TODAS las skills técnicas (~400+)
    --category X       Instalar categoría específica
    --list             Listar todas las categorías
    --dry-run          Simular instalación
    --dir PATH         Directorio de instalación
"""

import subprocess
import sys
import os
import argparse
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed


# Colores
class Colors:
    RED = "\033[0;31m"
    GREEN = "\033[0;32m"
    YELLOW = "\033[1;33m"
    BLUE = "\033[0;34m"
    CYAN = "\033[0;36m"
    MAGENTA = "\033[0;35m"
    NC = "\033[0m"


# ============================================================
# SKILLS ORGANIZADAS POR ESPECIALIZACIÓN TÉCNICA
# ============================================================

SKILLS_CATEGORIES = {
    # ========================================================
    # 1. DESARROLLO WEB (BÁSICO - YA INCLUIDO)
    # ========================================================
    "frontend-core": [
        ("vercel-labs/agent-skills", "react-best-practices"),
        ("vercel-labs/agent-skills", "web-design-guidelines"),
        ("vercel-labs/agent-skills", "composition-patterns"),
        ("vercel-labs/next-skills", "next-best-practices"),
        ("vercel-labs/next-skills", "next-cache-components"),
        ("vercel-labs/next-skills", "next-upgrade"),
        ("anthropics/skills", "frontend-design"),
        ("anthropics/skills", "canvas-design"),
    ],
    "backend-core": [
        ("vercel/ai", "ai-sdk"),
        ("supabase/agent-skills", "supabase-postgres-best-practices"),
        ("better-auth/skills", "better-auth-best-practices"),
        ("wshobson/agents", "nodejs-backend-patterns"),
        ("wshobson/agents", "fastapi-templates"),
        ("kadajett/agent-nestjs-skills", "nestjs-best-practices"),
        ("wshobson/agents", "api-design-principles"),
        ("wshobson/agents", "postgresql-table-design"),
    ],
    # ========================================================
    # 2. WEB3 / BLOCKCHAIN / WEB3
    # ========================================================
    "web3-blockchain": [
        # Ethereum & Smart Contracts
        ("eth-protocols/solidity-skills", "solidity-best-practices"),
        ("ethereum/ethereum-skills", "ethereum-development"),
        ("openzeppelin/skills", "contract-security"),
        ("hardhat/skills", "hardhat-toolbox"),
        ("foundry-rs/skills", "foundry-testing"),
        ("truffle/skills", "truffle-suite"),
        # Solana
        ("solana-labs/skills", "solana-development"),
        ("solana-labs/skills", "anchor-framework"),
        ("solana-labs/skills", "rust-for-solana"),
        # Rust Blockchain
        ("paritytech/skills", "substrate-development"),
        ("cosmos/sdk-skills", "cosmos-sdk"),
        # Web3 Frontend
        ("web3/skills", "web3js-integration"),
        ("ethers-io/skills", "ethersjs-guide"),
        ("wagmi/skills", "wagmi-react"),
        ("rainbow-me/skills", "rainbowkit-wallet"),
        # DeFi & NFTs
        ("uniswap/skills", "defi-integration"),
        ("aave/skills", "lending-protocols"),
        ("opensea/skills", "nft-development"),
        # Testing & Security
        ("trailofbits/skills", "smart-contract-security"),
        ("slither/skills", "static-analysis"),
        ("echidna/skills", "fuzzing-testing"),
    ],
    # ========================================================
    # 3. GAME DEVELOPMENT
    # ========================================================
    "game-dev": [
        # Unity
        ("unity-technologies/skills", "unity-development"),
        ("unity-technologies/skills", "unity-2d"),
        ("unity-technologies/skills", "unity-3d"),
        ("unity-technologies/skills", "unity-multiplayer"),
        # Unreal Engine
        ("epicgames/skills", "unreal-engine-5"),
        ("epicgames/skills", "blueprint-visual-scripting"),
        ("epicgames/skills", "unreal-cpp"),
        ("epicgames/skills", "unreal-multiplayer"),
        # Godot
        ("godotengine/skills", "godot-4"),
        ("godotengine/skills", "gdscript"),
        ("godotengine/skills", "godot-shaders"),
        # Game Design
        ("gdc/skills", "game-design-patterns"),
        ("gdc/skills", "level-design"),
        ("gdc/skills", "game-mechanics"),
        ("gdc/skills", "game-balance"),
        # Graphics & Shaders
        ("unity-technologies/skills", "shader-graph"),
        ("epicgames/skills", "material-editor"),
        ("thebookofshaders/skills", "shader-programming"),
        ("opengl/skills", "opengl-graphics"),
        ("vulkan/skills", "vulkan-api"),
        ("directx/skills", "directx-12"),
        # Audio
        ("fmod/skills", "fmod-audio"),
        ("wwise/skills", "wwise-integration"),
        # Physics
        ("nvidia/skills", "physx-engine"),
        ("bulletphysics/skills", "bullet-physics"),
        # AI for Games
        ("gdc/skills", "game-ai"),
        ("unity-technologies/skills", "unity-ml-agents"),
        # Multiplayer & Networking
        ("photon-engine/skills", "photon-unity"),
        ("mirror-networking/skills", "mirror-framework"),
        ("facepunch/skills", "steamworks-integration"),
    ],
    # ========================================================
    # 4. AR / VR / XR DEVELOPMENT
    # ========================================================
    "ar-vr-xr": [
        # Unity XR
        ("unity-technologies/skills", "unity-ar-foundation"),
        ("unity-technologies/skills", "unity-vr-development"),
        # ARKit (iOS)
        ("apple/skills", "arkit-development"),
        ("apple/skills", "reality-composer"),
        ("apple/skills", "realitykit"),
        # ARCore (Android)
        ("google/skills", "arcore-development"),
        ("google/skills", "arcore-geospatial"),
        # VR Headsets
        ("oculus/skills", "quest-development"),
        ("meta/skills", "meta-xr-sdk"),
        ("valve/skills", "steamvr-development"),
        ("htcvive/skills", "vive-wave-sdk"),
        # WebXR
        ("immersive-web/skills", "webxr-development"),
        ("threejs/skills", "threejs-ar-vr"),
        ("aframe/skills", "aframe-webvr"),
        # Mixed Reality
        ("microsoft/skills", "hololens-mrtk"),
        ("microsoft/skills", "mixed-reality-toolkit"),
        # Hand Tracking & Interaction
        ("ultraleap/skills", "hand-tracking"),
        ("meta/skills", "interaction-sdk"),
    ],
    # ========================================================
    # 5. DATA ENGINEERING & ML/AI
    # ========================================================
    "data-ml-ai": [
        # Data Engineering
        ("apache/spark-skills", "apache-spark"),
        ("apache/kafka-skills", "kafka-streaming"),
        ("apache/airflow-skills", "airflow-pipelines"),
        ("dbt-labs/skills", "dbt-transformations"),
        ("snowflake/skills", "snowflake-data"),
        ("databricks/skills", "databricks-platform"),
        ("fivetran/skills", "fivetran-elt"),
        ("stitch/skills", "stitch-replication"),
        # Python Data Stack
        ("pandas/skills", "pandas-analysis"),
        ("numpy/skills", "numpy-computing"),
        ("scipy/skills", "scipy-scientific"),
        ("jupyter/skills", "jupyter-notebooks"),
        ("plotly/skills", "plotly-visualization"),
        ("matplotlib/skills", "matplotlib-charts"),
        ("seaborn/skills", "seaborn-statistical"),
        # Machine Learning
        ("scikit-learn/skills", "sklearn-machine-learning"),
        ("tensorflow/skills", "tensorflow-development"),
        ("pytorch/skills", "pytorch-framework"),
        ("keras-team/skills", "keras-deep-learning"),
        ("huggingface/skills", "transformers-nlp"),
        ("langchain/skills", "langchain-framework"),
        ("openai/skills", "openai-api"),
        ("anthropic/skills", "anthropic-claude"),
        # MLOps
        ("mlflow/skills", "mlflow-tracking"),
        ("weights-and-biases/skills", "wandb-experiments"),
        ("kubeflow/skills", "kubeflow-pipelines"),
        ("bentoml/skills", "bentoml-serving"),
        ("ray-project/skills", "ray-distributed"),
        # Computer Vision
        ("opencv/skills", "opencv-computer-vision"),
        ("opencv/skills", "opencv-image-processing"),
        ("ultralytics/skills", "yolo-object-detection"),
        ("roboflow/skills", "roboflow-datasets"),
        # NLP
        ("spacy/skills", "spacy-nlp"),
        ("nltk/skills", "nltk-text"),
        ("gensim/skills", "gensim-topic-modeling"),
        # Vector Databases
        ("pinecone-io/skills", "pinecone-vectors"),
        ("weaviate/skills", "weaviate-search"),
        ("chroma-core/skills", "chroma-db"),
        ("qdrant/skills", "qdrant-vectors"),
        # Feature Stores
        ("feast-dev/skills", "feast-feature-store"),
        ("tecton-ai/skills", "tecton-features"),
    ],
    # ========================================================
    # 6. SYSTEMS PROGRAMMING / LOW-LEVEL
    # ========================================================
    "systems-programming": [
        # Rust
        ("rust-lang/skills", "rust-systems"),
        ("rust-lang/skills", "rust-memory-safety"),
        ("rust-lang/skills", "rust-async"),
        ("tokio-rs/skills", "tokio-async-runtime"),
        ("actix/skills", "actix-web"),
        ("rocket/skills", "rocket-framework"),
        # C/C++
        ("cpp/skills", "cpp-modern"),
        ("cpp/skills", "cpp-stl"),
        ("cpp/skills", "cpp-memory"),
        ("cpp/skills", "cpp-multithreading"),
        # Embedded Systems
        ("arduino/skills", "arduino-programming"),
        ("raspberrypi/skills", "raspberry-pi"),
        ("espressif/skills", "esp32-development"),
        ("zephyrproject/skills", "zephyr-rtos"),
        ("freertos/skills", "freertos-embedded"),
        ("arm/skills", "arm-cortex"),
        # OS Development
        ("osdev/skills", "os-development"),
        ("linux/skills", "linux-kernel"),
        ("bsd/skills", "bsd-systems"),
        # Compilers
        ("llvm/skills", "llvm-compiler"),
        ("gcc/skills", "gcc-toolchain"),
        # Assembly
        ("x86asm/skills", "x86-assembly"),
        ("armasm/skills", "arm-assembly"),
    ],
    # ========================================================
    # 7. MOBILE NATIVE
    # ========================================================
    "mobile-native": [
        # iOS Native
        ("apple/skills", "swift-development"),
        ("apple/skills", "swiftui-framework"),
        ("apple/skills", "uikit-development"),
        ("apple/skills", "combine-framework"),
        ("apple/skills", "core-data"),
        ("apple/skills", "core-animation"),
        ("apple/skills", "ios-concurrency"),
        ("apple/skills", "xcode-tools"),
        ("apple/skills", "app-store-deployment"),
        # Android Native
        ("android/skills", "kotlin-development"),
        ("android/skills", "jetpack-compose"),
        ("android/skills", "android-jetpack"),
        ("android/skills", "kotlin-coroutines"),
        ("android/skills", "android-architecture"),
        ("android/skills", "room-database"),
        ("android/skills", "workmanager"),
        ("android/skills", "play-store-deployment"),
        # Cross-Platform
        ("flutter/skills", "flutter-development"),
        ("flutter/skills", "flutter-state-management"),
        ("flutter/skills", "flutter-testing"),
        ("kotlinlang/skills", "kotlin-multiplatform"),
        # Mobile Testing
        ("maestro/skills", "maestro-e2e-testing"),
        ("detox/skills", "detox-testing"),
        ("appium/skills", "appium-automation"),
        # Push Notifications
        ("onesignal/skills", "onesignal-push"),
        ("firebase/skills", "firebase-cloud-messaging"),
    ],
    # ========================================================
    # 8. DEVOPS / PLATFORM / SRE AVANZADO
    # ========================================================
    "devops-platform": [
        # Container Orchestration
        ("kubernetes/skills", "kubernetes-admin"),
        ("kubernetes/skills", "helm-charts"),
        ("kubernetes/skills", "kustomize"),
        ("istio/skills", "istio-service-mesh"),
        ("linkerd/skills", "linkerd-service-mesh"),
        ("hashicorp/skills", "consul-service-discovery"),
        ("hashicorp/skills", "vault-secrets"),
        # CI/CD Avanzado
        ("jenkins/skills", "jenkins-pipelines"),
        ("gitlab/skills", "gitlab-ci"),
        ("github/skills", "github-actions"),
        ("circleci/skills", "circleci-workflows"),
        ("argoproj/skills", "argo-cd"),
        ("argoproj/skills", "argo-workflows"),
        ("tekton/skills", "tekton-pipelines"),
        ("spinnaker/skills", "spinnaker-cd"),
        # Infrastructure as Code
        ("hashicorp/skills", "terraform-iac"),
        ("pulumi/skills", "pulumi-infrastructure"),
        ("aws/skills", "aws-cdk"),
        ("google/skills", "google-deployment-manager"),
        ("azure/skills", "azure-arm-templates"),
        # Cloud Native
        ("cncf/skills", "cloud-native-patterns"),
        ("envoyproxy/skills", "envoy-proxy"),
        ("traefik/skills", "traefik-ingress"),
        ("nginx/skills", "nginx-configuration"),
        ("haproxy/skills", "haproxy-load-balancing"),
        # Monitoring & Observability
        ("prometheus/skills", "prometheus-monitoring"),
        ("grafana/skills", "grafana-dashboards"),
        ("jaegertracing/skills", "jaeger-tracing"),
        ("opentelemetry/skills", "otel-observability"),
        ("datadog/skills", "datadog-monitoring"),
        ("newrelic/skills", "newrelic-apm"),
        # SRE & Chaos Engineering
        ("netflix/skills", "chaos-engineering"),
        ("gremlin/skills", "gremlin-chaos"),
        ("litmuschaos/skills", "litmus-chaos"),
        # Security
        ("snyk/skills", "snyk-security"),
        ("aquasecurity/skills", "trivy-scanning"),
        ("anchore/skills", "anchore-security"),
        ("falco/skills", "falco-threat-detection"),
    ],
    # ========================================================
    # 9. TESTING AVANZADO
    # ========================================================
    "testing-advanced": [
        # Test Automation
        ("selenium/skills", "selenium-webdriver"),
        ("cypress-io/skills", "cypress-testing"),
        ("playwright/skills", "playwright-e2e"),
        ("webdriverio/skills", "webdriverio"),
        ("testcafe/skills", "testcafe-testing"),
        ("nightwatchjs/skills", "nightwatch-testing"),
        # API Testing
        ("postman/skills", "postman-api-testing"),
        ("rest-assured/skills", "rest-assured-java"),
        ("karate/skills", "karate-dsl"),
        ("soapui/skills", "soapui-testing"),
        # Performance Testing
        ("gatling/skills", "gatling-performance"),
        ("jmeter/skills", "jmeter-load-testing"),
        ("k6/skills", "k6-load-testing"),
        ("artillery/skills", "artillery-load"),
        ("locust/skills", "locust-python"),
        # Test Management
        ("cucumber/skills", "cucumber-bdd"),
        ("behave/skills", "behave-python-bdd"),
        ("pytest/skills", "pytest-advanced"),
        ("jestjs/skills", "jest-testing"),
        ("testing-library/skills", "testing-library"),
        ("mswjs/skills", "mock-service-worker"),
        # Visual Testing
        ("percy/skills", "percy-visual-testing"),
        ("chromatic/skills", "chromatic-storybook"),
        ("applitools/skills", "applitools-eyes"),
        # Contract Testing
        ("pact-foundation/skills", "pact-contract-testing"),
        ("spring-cloud/skills", "spring-contracts"),
        # Mutation Testing
        ("stryker-mutator/skills", "stryker-mutation"),
        ("infection/skills", "infection-php"),
        # Security Testing
        ("owasp/skills", "owasp-zap"),
        ("burp/skills", "burp-suite"),
        ("nmap/skills", "nmap-scanning"),
        ("sqlmap/skills", "sqlmap-injection"),
    ],
    # ========================================================
    # 10. LENGUAJES Y FRAMEWORKS ADICIONALES
    # ========================================================
    "languages-frameworks": [
        # Go
        ("golang/skills", "go-development"),
        ("golang/skills", "go-concurrency"),
        ("golang/skills", "go-microservices"),
        ("gin-gonic/skills", "gin-framework"),
        ("labstack/skills", "echo-framework"),
        ("grpc-ecosystem/skills", "grpc-go"),
        # Java
        ("spring/skills", "spring-boot"),
        ("spring/skills", "spring-data"),
        ("spring/skills", "spring-security"),
        ("spring/skills", "spring-cloud"),
        ("spring/skills", "spring-webflux"),
        ("quarkusio/skills", "quarkus-framework"),
        ("micronaut/skills", "micronaut-framework"),
        ("hibernate/skills", "hibernate-orm"),
        ("gradle/skills", "gradle-build"),
        ("maven/skills", "maven-build"),
        # .NET
        ("dotnet/skills", "dotnet-core"),
        ("dotnet/skills", "aspnet-core"),
        ("dotnet/skills", "entity-framework"),
        ("dotnet/skills", "blazor-framework"),
        ("dotnet/skills", "xamarin-mobile"),
        ("dotnet/skills", "nuget-packages"),
        # PHP
        ("laravel/skills", "laravel-framework"),
        ("symfony/skills", "symfony-framework"),
        ("composer/skills", "composer-dependency"),
        # Ruby
        ("rails/skills", "ruby-on-rails"),
        ("sinatra/skills", "sinatra-framework"),
        ("bundler/skills", "bundler-ruby"),
        # Elixir
        ("elixir-lang/skills", "elixir-development"),
        ("phoenixframework/skills", "phoenix-framework"),
        ("phoenixframework/skills", "liveview"),
        # Scala
        ("scala/scala-skills", "scala-development"),
        ("playframework/skills", "play-framework"),
        ("akka/skills", "akka-actors"),
        # Haskell
        ("haskell/skills", "haskell-functional"),
        ("yesodweb/skills", "yesod-framework"),
        ("servant/skills", "servant-api"),
        # Clojure
        ("clojure/clojure-skills", "clojure-development"),
        # Perl
        ("perl/perl-skills", "perl-scripting"),
        # Lua
        ("lua/lua-skills", "lua-scripting"),
    ],
    # ========================================================
    # 11. ESPECIALIDADES ADICIONALES
    # ========================================================
    "specialized-tech": [
        # Microservices
        ("microservices/skills", "microservices-patterns"),
        ("microservices/skills", "api-gateway"),
        ("microservices/skills", "event-driven"),
        ("microservices/skills", "cqrs-pattern"),
        ("microservices/skills", "saga-pattern"),
        # Message Queues
        ("rabbitmq/skills", "rabbitmq-messaging"),
        ("apache/activemq-skills", "activemq"),
        ("nats-io/skills", "nats-messaging"),
        ("redis/skills", "redis-pubsub"),
        # GraphQL
        ("graphql/skills", "graphql-api"),
        ("apollographql/skills", "apollo-client"),
        ("apollographql/skills", "apollo-server"),
        ("hasura/skills", "hasura-graphql"),
        # gRPC
        ("grpc-ecosystem/skills", "grpc-framework"),
        ("protocolbuffers/skills", "protobuf"),
        # Real-time
        ("socketio/skills", "socketio-realtime"),
        ("ably/skills", "ably-realtime"),
        ("pusher/skills", "pusher-channels"),
        # Documentation
        ("swagger-api/skills", "openapi-swagger"),
        ("readmeio/skills", "readme-documentation"),
        ("gitbookio/skills", "gitbook-docs"),
        ("docusaurus/skills", "docusaurus-site"),
        ("mkdocs/skills", "mkdocs-material"),
        # CMS/Headless
        ("strapi/skills", "strapi-cms"),
        ("sanity-io/skills", "sanity-studio"),
        ("contentful/skills", "contentful-cms"),
        ("prismicio/skills", "prismic-cms"),
        # E-commerce
        ("shopify/skills", "shopify-development"),
        ("woocommerce/skills", "woocommerce"),
        ("magento/skills", "magento-development"),
        # Search
        ("elastic/skills", "elasticsearch"),
        ("algolia/skills", "algolia-search"),
        ("typesense/skills", "typesense-search"),
        ("meilisearch/skills", "meilisearch"),
        # CDN/Edge
        ("cloudflare/skills", "cloudflare-workers"),
        ("fastly/skills", "fastly-edge"),
        ("akamai/skills", "akamai-edge"),
        # Video/Streaming
        ("muxinc/skills", "mux-video"),
        ("cloudflare/skills", "cloudflare-stream"),
        ("aws/skills", "aws-media-convert"),
        # PDF Generation
        ("puppeteer/skills", "puppeteer-pdf"),
        ("wkhtmltopdf/skills", "wkhtmltopdf"),
        ("react-pdf/skills", "react-pdf"),
        # Email
        ("sendgrid/skills", "sendgrid-email"),
        ("mailgun/skills", "mailgun-api"),
        ("resend/skills", "resend-email"),
        # Maps/Location
        ("google/skills", "google-maps-api"),
        ("mapbox/skills", "mapbox-gl"),
        ("leaflet/skills", "leaflet-maps"),
        # Testing Tools
        ("faker-js/skills", "faker-data"),
        ("factory-bot/skills", "factory-fixtures"),
        ("vcrpy/skills", "vcr-recording"),
    ],
    # ========================================================
    # 12. EXISTENTES (Para mantener compatibilidad)
    # ========================================================
    "vercel-main": [
        ("vercel-labs/agent-skills", None),  # Instala todo el repo
    ],
    "obra-superpowers": [
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
    ],
    "wshobson-patterns": [
        ("wshobson/agents", "tailwind-design-system"),
        ("wshobson/agents", "typescript-advanced-types"),
        ("wshobson/agents", "api-design-principles"),
        ("wshobson/agents", "architecture-patterns"),
        ("wshobson/agents", "nextjs-app-router-patterns"),
        ("wshobson/agents", "prompt-engineering-patterns"),
        ("wshobson/agents", "python-testing-patterns"),
        ("wshobson/agents", "responsive-design"),
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
    "antfu-ecosystem": [
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
    "mobile-cross": [
        ("expo/skills", "building-native-ui"),
        ("expo/skills", "native-data-fetching"),
        ("expo/skills", "upgrading-expo"),
        ("expo/skills", "expo-dev-client"),
        ("expo/skills", "expo-deployment"),
        ("expo/skills", "expo-tailwind-setup"),
        ("expo/skills", "expo-api-routes"),
        ("expo/skills", "expo-cicd-workflows"),
        ("expo/skills", "use-dom"),
        ("flutter/skills", "flutter-development"),
    ],
    "vue-specialized": [
        ("hyf0/vue-skills", "vue-debug-guides"),
        ("hyf0/vue-skills", "vue-best-practices"),
    ],
    "tools-utilities": [
        ("firecrawl/cli", "firecrawl"),
        ("browser-use/browser-use", "browser-use"),
        ("inference-sh-0/skills", "agent-tools"),
        ("inference-sh-0/skills", "agent-browser"),
        ("squirrelscan/skills", "audit-website"),
        ("remotion-dev/skills", "remotion-best-practices"),
        ("othmanadi/planning-with-files", "planning-with-files"),
        ("benjitaylor/agentation", "agentation"),
    ],
    "google-stitch": [
        ("google-labs-code/stitch-skills", "react:components"),
        ("google-labs-code/stitch-skills", "design-md"),
        ("google-labs-code/stitch-skills", "stitch-loop"),
        ("google-labs-code/stitch-skills", "enhance-prompt"),
        ("google-labs-code/stitch-skills", "shadcn-ui"),
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
        print(f"{Colors.CYAN}[DRY-RUN]{Colors.NC} {display_name}")
        return True, display_name

    try:
        result = subprocess.run(
            cmd.split(), capture_output=True, text=True, timeout=60, cwd=skills_dir
        )

        if result.returncode == 0:
            print(f"{Colors.GREEN}✓{Colors.NC} {display_name}")
            return True, display_name
        else:
            print(f"{Colors.RED}✗{Colors.NC} {display_name}")
            return False, display_name
    except subprocess.TimeoutExpired:
        print(f"{Colors.RED}⏱{Colors.NC} Timeout: {display_name}")
        return False, display_name
    except Exception as e:
        print(f"{Colors.RED}✗{Colors.NC} Error: {display_name}")
        return False, display_name


def install_category(
    category, parallel=True, dry_run=False, skills_dir=".", max_workers=5
):
    """Instala todas las skills de una categoría"""
    if category not in SKILLS_CATEGORIES:
        print(f"{Colors.RED}Categoría '{category}' no existe{Colors.NC}")
        return 0, 0

    skills = SKILLS_CATEGORIES[category]
    print(f"\n{Colors.BLUE}📦 {category.upper()} ({len(skills)} skills){Colors.NC}\n")

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
    total_skills = sum(len(skills) for skills in SKILLS_CATEGORIES.values())

    print(
        f"\n{Colors.MAGENTA}🚀 Instalando {total_skills} skills técnicas...{Colors.NC}\n"
    )

    for category in SKILLS_CATEGORIES:
        installed, failed = install_category(
            category, parallel, dry_run, skills_dir, max_workers
        )
        total_installed += installed
        total_failed += failed

    return total_installed, total_failed


def list_categories():
    """Lista todas las categorías disponibles"""
    print(f"\n{Colors.BLUE}📚 CATEGORÍAS TÉCNICAS DISPONIBLES:{Colors.NC}\n")

    categories_by_type = {
        "Desarrollo Web": ["frontend-core", "backend-core", "vercel-main"],
        "Web3/Blockchain": ["web3-blockchain"],
        "Game Development": ["game-dev"],
        "AR/VR/XR": ["ar-vr-xr"],
        "Data/ML/AI": ["data-ml-ai"],
        "Systems Programming": ["systems-programming"],
        "Mobile": ["mobile-native", "mobile-cross"],
        "DevOps/Platform/SRE": ["devops-platform"],
        "Testing Avanzado": ["testing-advanced"],
        "Lenguajes/Frameworks": ["languages-frameworks"],
        "Especialidades": ["specialized-tech"],
        "Mejores Prácticas": [
            "obra-superpowers",
            "wshobson-patterns",
            "antfu-ecosystem",
        ],
        "Otros": ["vue-specialized", "tools-utilities", "google-stitch"],
    }

    for group, cats in categories_by_type.items():
        print(f"\n{Colors.CYAN}▸ {group}:{Colors.NC}")
        for cat in cats:
            if cat in SKILLS_CATEGORIES:
                count = len(SKILLS_CATEGORIES[cat])
                print(
                    f"  {Colors.GREEN}•{Colors.NC} {cat:<25} {Colors.YELLOW}({count} skills){Colors.NC}"
                )

    total = sum(len(skills) for skills in SKILLS_CATEGORIES.values())
    print(f"\n{Colors.MAGENTA}Total: {total} skills técnicas{Colors.NC}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Instalador completo de skills técnicos",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=f"""
{Colors.CYAN}EJEMPLOS:{Colors.NC}

  Instalar TODO (400+ skills):
    python install-all-tech-skills.py --all

  Instalar solo Web3/Blockchain:
    python install-all-tech-skills.py --category web3-blockchain

  Instalar Game Development:
    python install-all-tech-skills.py --category game-dev

  Ver todas las categorías:
    python install-all-tech-skills.py --list

  Simular instalación:
    python install-all-tech-skills.py --all --dry-run

  Instalar en directorio específico:
    python install-all-tech-skills.py --all --dir ./tech-skills
        """,
    )

    parser.add_argument(
        "--all", action="store_true", help="Instalar TODAS las skills (~400+)"
    )
    parser.add_argument("--category", type=str, help="Instalar categoría específica")
    parser.add_argument("--list", action="store_true", help="Listar categorías")
    parser.add_argument("--dry-run", action="store_true", help="Simular sin instalar")
    parser.add_argument(
        "--dir", type=str, default="./tech-skills", help="Directorio de instalación"
    )
    parser.add_argument(
        "--sequential", action="store_true", help="Instalar secuencialmente"
    )
    parser.add_argument(
        "--workers", type=int, default=5, help="Workers paralelos (default: 5)"
    )

    args = parser.parse_args()

    # Banner
    print(f"""
{Colors.BLUE}╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  {Colors.CYAN}🏢 INSTALADOR COMPLETO DE SKILLS TÉCNICAS{Colors.BLUE}                     ║
║                                                                ║
║  {Colors.YELLOW}Web3 • Game Dev • AR/VR • ML/AI • Systems • Mobile • DevOps{Colors.BLUE}  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝{Colors.NC}
""")

    if args.list:
        list_categories()
        return

    os.makedirs(args.dir, exist_ok=True)
    print(f"{Colors.YELLOW}📁 Directorio:{Colors.NC} {args.dir}\n")

    if args.dry_run:
        print(
            f"{Colors.CYAN}🔍 MODO SIMULACIÓN - Solo mostrando qué se instalaría{Colors.NC}\n"
        )

    parallel = not args.sequential

    start_time = datetime.now()

    if args.all:
        installed, failed = install_all(parallel, args.dry_run, args.dir, args.workers)
    elif args.category:
        installed, failed = install_category(
            args.category, parallel, args.dry_run, args.dir, args.workers
        )
    else:
        print(f"{Colors.YELLOW}⚠️  No se especificó acción{Colors.NC}")
        print(
            f"Use {Colors.CYAN}--all{Colors.NC} o {Colors.CYAN}--category <nombre>{Colors.NC}"
        )
        print(f"Use {Colors.CYAN}--list{Colors.NC} para ver categorías\n")
        parser.print_help()
        return

    elapsed = datetime.now() - start_time

    # Resumen
    print(f"\n{Colors.BLUE}{'=' * 60}{Colors.NC}")
    print(f"{Colors.GREEN}✅ INSTALACIÓN COMPLETADA{Colors.NC}")
    print(f"{Colors.BLUE}{'=' * 60}{Colors.NC}\n")
    print(f"  {Colors.GREEN}✓ Exitosas:{Colors.NC}  {installed}")
    print(f"  {Colors.RED}✗ Fallidas:{Colors.NC}  {failed}")
    print(f"  {Colors.YELLOW}⏱ Tiempo:{Colors.NC}   {elapsed}")
    print(
        f"\n{Colors.YELLOW}💡 Tip:{Colors.NC} Usa --dry-run para simular antes de instalar todo"
    )

    # Guardar resumen
    if not args.dry_run:
        summary_file = os.path.join(args.dir, "tech-skills-report.txt")
        with open(summary_file, "w") as f:
            f.write(f"""Technical Skills Installation Report
{"=" * 60}
Fecha: {datetime.now()}
Directorio: {args.dir}

Skills instaladas: {installed}
Skills fallidas: {failed}
Tiempo: {elapsed}

CATEGORÍAS DISPONIBLES:
- Web3/Blockchain
- Game Development  
- AR/VR/XR
- Data/ML/AI
- Systems Programming
- Mobile Native & Cross-platform
- DevOps/Platform/SRE
- Testing Avanzado
- Lenguajes y Frameworks
- Especialidades Técnicas

Para más skills:
  https://skills.sh/
""")
        print(f"\n{Colors.GREEN}📝 Reporte guardado:{Colors.NC} {summary_file}")

    print()


if __name__ == "__main__":
    main()
