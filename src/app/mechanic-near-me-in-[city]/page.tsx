
import React from 'react';

export default function MechanicCityPage({ params }: { params: { city: string } }) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Mechanic Near Me in {params.city.charAt(0).toUpperCase() + params.city.slice(1)}
      </h1>
      <p className="mt-4">
        RapidFix is coming soon to this location to provide top-tier automotive service.
      </p>
    </main>
  );
}