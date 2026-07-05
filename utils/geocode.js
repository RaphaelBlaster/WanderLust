// Geocoding utility using Nominatim
const fetch = require("node-fetch");

module.exports.geocode = async (location) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "wanderlust-app" }
  });
  const data = await res.json();
  if (!data || data.length === 0) return { lat: 0, lng: 0 };
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon)
  };
};
