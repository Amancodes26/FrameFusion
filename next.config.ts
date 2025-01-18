import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        hostname:"image.pollinations.ai",
        pathname:"/**",
        port:"",
        protocol:"https"
      }
    ]
  }
};

export default nextConfig;
