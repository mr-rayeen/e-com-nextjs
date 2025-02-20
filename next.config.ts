import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		domains: [
			"cdn.sanity.io",
			"www.animatedimages.org",
			"img.icons8.com",
		],
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	eslint:{
    ignoreDuringBuilds: true, //during builds
  }
};

export default nextConfig;
