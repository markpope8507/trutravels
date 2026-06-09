import { countries } from "@/lib/data";
import { notFound } from "next/navigation";
import CountryPage from "@/components/country-page";
import { slugify } from "@/lib/utils";

export async function generateStaticParams() {
  return countries.map((c) => ({
    region: slugify(c.region),
    country: c.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; country: string }>;
}) {
  const { region, country } = await params;
  const found = countries.find((c) => c.id === country && slugify(c.region) === region);
  if (!found) return {};
  return {
    title: `${found.name} Tours — TruTravels`,
    description: `Explore ${found.name} with TruTravels. ${found.tagline}. Group adventures for 18-35s.`,
  };
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ region: string; country: string }>;
}) {
  const { region, country } = await params;
  const found = countries.find((c) => c.id === country && slugify(c.region) === region);
  if (!found) notFound();

  return <CountryPage country={found} />;
}
