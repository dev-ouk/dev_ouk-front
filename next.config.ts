import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.solved.ac",
      },
      {
        protocol: "https",
        hostname: "contents.kyobobook.co.kr",
      },
    ],
  },
};

export default nextConfig;
