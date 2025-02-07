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
};

export default nextConfig;
