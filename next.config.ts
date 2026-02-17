import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["@modelcontextprotocol/sdk", "pdf-parse", "mammoth"],
} as any;

export default nextConfig;
