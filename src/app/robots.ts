import type { MetadataRoute } from "next";

// Demo/prototype deployment — block all crawlers so it can't be indexed and
// compete with the live site (trutravels.com) as duplicate content.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
