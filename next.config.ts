import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        hostname:"gen.pollinations.ai",
        pathname:"/**",
        port:"",
        protocol:"https"
      }
    ]
  }
};

export default nextConfig;
