import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Demo/prototype — send a noindex header on every response so search engines
  // never index this deployment (prevents duplicate content vs trutravels.com).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
        ],
      },
    ];
  },
};

export default nextConfig;
