import { Suspense } from "react";
import Booking from "./Booking";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Service | Car & Bike Repair",
  description: "Book your car or bike service and repairs online with RapidFix. Choose your location, select services and get a free estimate.",
  alternates: { canonical: "https://rapidfixauto.in/booking" },
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Booking />
    </Suspense>
  );
}
