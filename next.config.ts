import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent webpack from bundling native Node.js modules used in API routes
  serverExternalPackages: ['onnxruntime-node', 'sharp'],
};

export default nextConfig;
