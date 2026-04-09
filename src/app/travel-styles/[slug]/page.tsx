import { Suspense } from "react";
import { trips, TravelStyle, travelStyleConfig } from "@/lib/data";
import { notFound } from "next/navigation";
import TravelStylePage from "@/components/travel-style-page";

const slugToStyle: Record<string, TravelStyle> = {
  classic: "classic",
  backpacker: "backpacker",
  flashpacker: "flashpacker",
  "multi-country": "multi_country",
  "limited-edition": "limited_edition",
};

export async function generateStaticParams() {
  return Object.keys(slugToStyle).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const style = slugToStyle[slug];
  if (!style) return {};
  const config = travelStyleConfig[style];
  return {
    title: `${config.label} Trips — TruTravels`,
    description: config.description,
  };
}

export default async function TravelStyleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const style = slugToStyle[slug];
  if (!style) notFound();

  return (
    <Suspense>
      <TravelStylePage style={style} trips={trips} />
    </Suspense>
  );
}
