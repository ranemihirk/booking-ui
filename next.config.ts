import type { NextConfig } from "next";
import dotenv from "dotenv";

// Load environment variables from .env.local (or .env)
dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // output: isProd ? "export" : undefined,
  // basePath: isProd ? "/parshuram-raorane" : "",
  // assetPrefix: isProd ? "/parshuram-raorane" : "",
  reactStrictMode: true,
  productionBrowserSourceMaps: true, // Enables logs in production
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for importing 'fs' or other Node.js modules in client components
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }

    // Ensure TypeScript files are properly resolved
    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
};

export default nextConfig;
