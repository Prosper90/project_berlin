'use client';

interface EventMapProps {
  latitude?: number;
  longitude?: number;
  venueName?: string;
  venueAddress?: string;
  city?: string;
}

export default function EventMap({
  latitude,
  longitude,
  venueName,
  venueAddress,
  city,
}: EventMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Build query string for the embed
  const query = latitude && longitude
    ? `${latitude},${longitude}`
    : encodeURIComponent([venueName, venueAddress, city].filter(Boolean).join(', '));

  if (!query) return null;

  const embedSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}&zoom=15`
    : `https://maps.google.com/maps?q=${query}&output=embed&z=15`;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <iframe
        title="Event location"
        src={embedSrc}
        width="100%"
        height="280"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block"
      />
    </div>
  );
}
