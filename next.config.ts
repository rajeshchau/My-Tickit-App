import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "hallowed-barracuda-218.convex.cloud", protocol: "https" },
    ],
  },
};

export default nextConfig;
