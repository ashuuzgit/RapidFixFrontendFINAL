"use client";

import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map";
import { MapPin } from "lucide-react";

export function LocateUs() {
  const latitude = 28.5847634;
  const longitude = 77.4081356;

  return (
    <section className="bg-white border-t-2 border-b-2 border-black relative z-10 flex flex-col w-full">
      <div className="p-8 md:p-12 border-b-2 border-black text-center bg-black text-white">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">LOCATE US</h2>
      </div>
      <div className="w-full h-[50vh] min-h-[400px] relative">
          <Map 
            center={[longitude, latitude]} 
            zoom={15}
          >
            <MapControls position="bottom-right" />
            <MapMarker longitude={longitude} latitude={latitude}>
              <MarkerContent>
                <div className="flex items-center justify-center size-10 rounded-full bg-primary border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <MapPin className="text-white size-5" />
                </div>
              </MarkerContent>
              <MarkerPopup className="p-4 w-64">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight">
                    RapidFix Auto Repair
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sector 120, Noida, Uttar Pradesh 201301, India
                  </p>
                  <a 
                    href="https://www.google.com/maps/place/28%C2%B035'05.2%22N+77%C2%B024'29.3%22E/@28.5847634,77.4055607,17z/data=!3m1!4b1!4m4!3m3!8m2!3d28.5847634!4d77.4081356?hl=en&entry=ttu&g_ep=EgoyMDI2MDQyOC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-primary hover:underline text-sm font-medium"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </MarkerPopup>
            </MapMarker>
          </Map>
        </div>
    </section>
  );
}
