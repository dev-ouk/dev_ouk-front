import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.solved.ac",
      },
    ],
  },
};

export default nextConfig;
