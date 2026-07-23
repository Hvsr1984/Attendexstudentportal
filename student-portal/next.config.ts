import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["shared", "attendex-shared"],
};

export default nextConfig;
