import React from 'react';
import type { Metadata } from 'next';

type Props = {
  params: { city: string };
};

function formatCity(city: string) {
  return city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = formatCity(params?.city || "your-city");

  return {
    title: `Mechanic Near Me in ${city}`,
    description: `Looking for a mechanic near you in ${city}? RapidFix offers doorstep car & bike service, repair, wash, and EV service in ${city}.`,
    keywords: [
      `mechanic near me in ${city}`,
      `car service in ${city}`,
      `bike service in ${city}`,
      `car repair in ${city}`,
      `bike repair in ${city}`,
      `EV service in ${city}`,
      `puncture repair in ${city}`,
      `battery replacement in ${city}`,
    ],
    alternates: {
      canonical: `https://rapidfixauto.in/mechanic-near-me-in-${params?.city}`,
    },
    openGraph: {
      title: `Mechanic Near Me in ${city} | RapidFixAuto`,
      description: `Doorstep car & bike service, repair, and wash in ${city}. Book RapidFix now.`,
      url: `https://rapidfixauto.in/mechanic-near-me-in-${params?.city}`,
    },
  };
}

export default function MechanicCityPage({ params }: Props) {
  const cityName = params?.city || 'Your City';

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Mechanic Near Me in {cityName.charAt(0).toUpperCase() + cityName.slice(1)}
      </h1>
      <p className="mt-4">
        RapidFix is now in {cityName} to provide top-tier automotive service.
      </p>
    </main>
  );
}