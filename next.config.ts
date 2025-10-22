import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",                 // cualquier request a /api/*
        destination: "http://localhost:3001/api/:path*", // va al json-server
      },
    ];
  },
};

export default nextConfig;
