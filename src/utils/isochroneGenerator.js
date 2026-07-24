// Spatial Isochrone Engine - Dynamically projects micro-zone candidates around user anchor locations

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Destination point given distance & bearing from origin
function computeRadialPoint(lat, lng, distKm, bearingDeg) {
  const R = 6371; // Earth radius km
  const brng = deg2rad(bearingDeg);
  const lat1 = deg2rad(lat);
  const lon1 = deg2rad(lng);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distKm / R) +
    Math.cos(lat1) * Math.sin(distKm / R) * Math.cos(brng)
  );

  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(distKm / R) * Math.cos(lat1),
    Math.cos(distKm / R) - Math.sin(lat1) * Math.sin(lat2)
  );

  return {
    lat: lat2 * (180 / Math.PI),
    lng: lon2 * (180 / Math.PI)
  };
}

const RADIAL_BEARINGS = [
  { name: "North Corridor", angle: 0, sector: "North" },
  { name: "Northeast Pocket", angle: 45, sector: "East" },
  { name: "East Side Hub", angle: 90, sector: "East" },
  { name: "Southeast Lakeshore", angle: 135, sector: "South" },
  { name: "South Waterfront", angle: 180, sector: "South" },
  { name: "Southwest Bay", angle: 225, sector: "West" },
  { name: "West End Village", angle: 270, sector: "West" },
  { name: "Northwest Parklands", angle: 315, sector: "North" }
];

export function generateDynamicIsochroneZones(anchorLoc, userPreferences) {
  if (!anchorLoc || !anchorLoc.lat || !anchorLoc.lng) return [];

  const transitMode = userPreferences?.transitMode || 'transit';
  const idealMinutes = userPreferences?.idealCommuteMinutes || 30;
  const profile = userPreferences?.profile || 'single_professional';
  const lifestyle = userPreferences?.lifestyle || {};

  // Radius distances in km to project based on transport mode
  let radiusDistances = [2.5, 6.0, 11.0];
  if (transitMode === 'driving') radiusDistances = [4.0, 10.0, 18.0];
  if (transitMode === 'walking') radiusDistances = [0.8, 1.8, 3.2];

  const dynamicZones = [];

  radiusDistances.forEach((distKm, idx) => {
    // Select bearings to avoid crowding
    const stepBearings = RADIAL_BEARINGS.filter((_, bIdx) => (bIdx + idx) % 2 === 0);

    stepBearings.forEach((bearing) => {
      const coords = computeRadialPoint(anchorLoc.lat, anchorLoc.lng, distKm, bearing.angle);

      // Estimate travel time from anchor
      let estMinutes = 60;
      if (transitMode === 'driving') estMinutes = (distKm * 2.2) + 4;
      if (transitMode === 'transit') estMinutes = (distKm * 4.2) + 8;
      if (transitMode === 'walking') estMinutes = distKm * 12;

      const roundedMins = Math.round(estMinutes);
      const isWithinBuffer = roundedMins <= idealMinutes;

      // Base score calculation
      const commuteFactor = Math.max(40, 100 - (roundedMins * 1.8));
      const walkFactor = Math.max(5, 10 - Math.floor(distKm * 0.4));
      
      const rawScore = Math.round((commuteFactor * 0.6) + (walkFactor * 10 * 0.4));
      const matchScore = Math.min(98, Math.max(52, rawScore));

      const isochroneBufferBadge = isWithinBuffer
        ? `🎯 Within ${roundedMins}-min Isochrone Buffer`
        : `⏱️ ${roundedMins}-min Commute (${roundedMins - idealMinutes}m over target)`;

      const zoneName = `${bearing.name} (${distKm.toFixed(1)} km)`;

      dynamicZones.push({
        id: `dynamic-isochrone-${bearing.angle}-${distKm}`,
        geojsonId: null,
        isDynamicArea: true,
        name: zoneName,
        city: `Buffer Zone (${bearing.sector})`,
        lat: coords.lat,
        lng: coords.lng,
        priceBracket: distKm < 5 ? "$$$$ (High)" : "$$$ (Mid-High)",
        avgRent: `$${Math.round(2100 + (10 - distKm) * 50)}/mo`,
        avgBuy: `$${Math.round(750000 + (10 - distKm) * 30000)}`,
        student_suitability: 8,
        single_professional_suitability: 8,
        family_suitability: 8,
        senior_suitability: 7,
        description: `Dynamically projected spatial micro-cluster located ${distKm.toFixed(1)} km from your anchor (${anchorLoc.address || 'Location'}). Offers an estimated ${roundedMins}-minute ${transitMode} commute.`,
        tags: ["Isochrone Buffer", "Dynamic Match", `${roundedMins}m Commute`, bearing.sector],
        amenities: {
          cafes_restaurants: Math.max(5, Math.floor(9 - distKm * 0.3)),
          gyms: 7,
          malls_shopping: 7,
          parks_nature: Math.min(10, Math.floor(6 + distKm * 0.3)),
          peace_quiet: Math.min(10, Math.floor(5 + distKm * 0.4)),
          family_friendly: 8,
          libraries_civic: 7,
          premium_groceries: 7,
          budget_groceries: 8,
          dog_parks: 8
        },
        transit: {
          walkability: walkFactor,
          transit_quality: Math.max(5, Math.floor(9 - distKm * 0.3)),
          highway_access: 8
        },
        commutes: {
          "anchor": { transit: roundedMins, driving: Math.round(roundedMins * 0.6) }
        },
        realtorLink: `https://www.realtor.ca/real-estate-listings?address=Toronto, ON`,
        zoloLink: `https://www.zolo.ca/toronto-real-estate`,
        houseSigmaLink: `https://www.housesigma.com`,
        localSpots: ["Local Park", "Transit Station", "Neighbourhood Retail", "Community Centre"],
        pros: [`Direct ${roundedMins}m ${transitMode} buffer`, "Optimal geographical access", "Dynamic suitability match"],
        cons: ["Calculated spatial pocket", "Verify local streetfront density"],
        subScores: {
          lifeStage: 80,
          commute: Math.min(100, Math.round(commuteFactor)),
          amenities: 75,
          walkability: walkFactor * 10
        },
        matchScore,
        closestEstTime: roundedMins,
        isWithinIsochroneBuffer: isWithinBuffer,
        isochroneBufferBadge,
        matchReasons: [
          `Situated ${distKm.toFixed(1)} km from your search anchor`,
          `Estimated ${roundedMins}-minute ${transitMode} commute`,
          isWithinBuffer ? `Falls strictly inside your target ${idealMinutes}-minute isochrone` : `Outside ideal target by ${roundedMins - idealMinutes} mins`
        ],
        listings: [
          {
            id: `dyn-r1-${bearing.angle}`,
            title: `Modern Suite in ${bearing.name}`,
            price: `$${Math.round(1950 + distKm * 20)}/mo`,
            priceNum: 1950,
            tenure: "rent",
            type: "Condo",
            beds: 1,
            baths: 1,
            sqft: 600,
            parking: true,
            address: `Near ${zoneName}, GTA`,
            imgUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60"
          }
        ]
      });
    });
  });

  return dynamicZones;
}
