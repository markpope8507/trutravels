import { regionPages } from "@/lib/data";
import { notFound } from "next/navigation";
import RegionPage from "@/components/region-page";

export function generateStaticParams() {
  return regionPages.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const found = regionPages.find((r) => r.slug === region);
  if (!found) return {};
  return {
    title: `${found.name} Tours & Destinations — TruTravels`,
    description: `Explore ${found.name} with TruTravels. ${found.tagline}. Group adventures for 18-35s.`,
  };
}

export default async function RegionLandingPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const found = regionPages.find((r) => r.slug === region);
  if (!found) notFound();

  return <RegionPage region={found} />;
}
