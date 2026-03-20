'use client';

import { useEffect, useRef, useState } from 'react';

export interface PlaceResult {
  venue_name: string;
  venue_address: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: PlaceResult) => void;
  label?: string;
  placeholder?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google: any;
    initGoogleMaps?: () => void;
  }
}

export default function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  label = 'Venue Address',
  placeholder = 'e.g. Rheinsberger Str. 76-77, Berlin',
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  // Load the Google Maps script once
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    if (window.google?.maps?.places) {
      setReady(true);
      return;
    }

    if (document.getElementById('google-maps-script')) return;

    window.initGoogleMaps = () => setReady(true);

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  // Attach autocomplete once the script is ready
  useEffect(() => {
    if (!ready || !inputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ['establishment', 'geocode'], componentRestrictions: { country: [] } },
    );

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current!.getPlace();
      if (!place.geometry?.location) return;

      const components: any[] = place.address_components ?? [];
      const get = (type: string) =>
        components.find((c: any) => c.types.includes(type))?.long_name ?? '';

      const city =
        get('locality') || get('administrative_area_level_2') || get('administrative_area_level_1') || 'Berlin';

      // Build a clean street address (without city/country)
      const streetNumber = get('street_number');
      const route = get('route');
      const streetAddress = [streetNumber, route].filter(Boolean).join(' ') || place.formatted_address || '';

      const result: PlaceResult = {
        venue_name: place.name ?? '',
        venue_address: streetAddress,
        city,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };

      onChange(streetAddress);
      onPlaceSelect(result);
    });
  }, [ready, onChange, onPlaceSelect]);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-muted">{label}</label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm text-white placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">
            (autocomplete disabled — add API key)
          </span>
        )}
      </div>
    </div>
  );
}
