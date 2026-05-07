import React from 'react';

export default function MechanicCityPage({ params }: { params: { city: string } }) {
  // Add a fallback in case params.city is missing during build time
  const cityName = params?.city || 'Your City';

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Mechanic Near Me in {cityName.charAt(0).toUpperCase() + cityName.slice(1)}
      </h1>
      <p className="mt-4">
        RapidFix is coming soon to {cityName} to provide top-tier automotive service.
      </p>
    </main>
  );
}