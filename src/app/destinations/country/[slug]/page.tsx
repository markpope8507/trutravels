import { countries } from "@/lib/data";
import { notFound } from "next/navigation";
import CountryPage from "@/components/country-page";

export async function generateStaticParams() {
  return countries.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = countries.find((c) => c.id === slug);
  if (!country) return {};
  return {
    title: `${country.name} Tours — TruTravels`,
    description: `Explore ${country.name} with TruTravels. ${country.tagline}. Group adventures for 18-35s.`,
  };
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = countries.find((c) => c.id === slug);
  if (!country) notFound();

  return <CountryPage country={country} />;
}
