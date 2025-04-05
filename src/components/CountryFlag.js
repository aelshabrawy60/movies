export default function CountryFlag({ country }) {
  // Map country names to their ISO 3166-1 alpha-2 codes
  const countryToCode = {
    'United States': 'us',
    'United Kingdom': 'gb',
    'Germany': 'de',
    'France': 'fr',
    'Spain': 'es',
    'Italy': 'it',
    'Canada': 'ca',
    'Australia': 'au',
    // Add more mappings as needed
  };

  const code = countryToCode[country]?.toLowerCase() || 'unknown';
  const flagUrl = `https://flagcdn.com/w40/${code}.png`;

  return (
    <div className="flex items-center space-x-2">
      <img
        src={flagUrl}
        alt={`${country} flag`}
        className="w-6 h-4 rounded object-cover"
      />
      <span className="text-gray-200 font-medium">{country}</span>
    </div>
  );
}
