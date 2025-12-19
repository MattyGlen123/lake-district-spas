const fs = require('fs');
const path = require('path');

// Read CSV file
const csvPath = path.join(__dirname, '../../../lake-district-spas-database-corrected.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (simple parser - handles quoted fields)
function parseCSV(text) {
  const lines = text.split('\n').filter(line => line.trim());
  const headers = lines[1].split(',').map(h => h.trim());

  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

// Convert spa name to kebab-case ID
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Normalize Yes/No values
function normalizeYesNo(value) {
  if (!value) return false;
  const upper = value.toUpperCase();
  return upper.includes('YES') || upper === 'Y';
}

// Map CSV business model to TypeScript BusinessModel
function mapBusinessModel(csvModel, dayPassAvailable, hotelGuestAccess, hotelGuestPrice) {
  const model = (csvModel || '').toUpperCase();
  const access = (hotelGuestAccess || '').toUpperCase();
  const price = (hotelGuestPrice || '').toUpperCase();

  // Priority order for business model detection
  if (model.includes('IN-ROOM')) {
    return 'guests-only'; // Special case: in-room spa suites
  }
  if (model.includes('EXCLUSIVE') && (model.includes('HOTEL-GUEST-ONLY') || model.includes('GUESTS ONLY'))) {
    return 'guests-only';
  }
  if (model.includes('DUAL FACILITY') || model.includes('HYBRID') || (model.includes('EXCLUSIVE') && model.includes('PUBLIC ACCESS'))) {
    return 'hybrid';
  }
  if (model.includes('PUBLIC ACCESS')) {
    // Check if hotel guests pay extra
    if (price.includes('NOT INCLUDED') || price.includes('PAY SEPARATELY') || price.includes('PAY EXTRA') || price.includes('EXTRA CHARGE') || price.includes('25% OFF')) {
      return 'paid-extra';
    }
    // If day passes available, it's day-passes
    if (normalizeYesNo(dayPassAvailable)) {
      return 'day-passes';
    }
    return 'day-passes';
  }
  if (model.includes('HOTEL AMENITY')) {
    // Check for "Paid extra" explicitly
    if (model.includes('PAID EXTRA') || model.includes('(PAID EXTRA)')) {
      return 'paid-extra';
    }
    // Check for "Swim Club" or "FREE" in model
    if (model.includes('SWIM CLUB') || model.includes('FREE FOR HOTEL GUESTS')) {
      return 'free-with-booking';
    }
    // Check hotel guest access and price
    if ((access.includes('FREE') || access.includes('INCLUDED')) && !price.includes('PAY') && !price.includes('NOT INCLUDED') && !price.includes('EXTRA')) {
      return 'free-with-booking';
    }
    // If price says "not included" or "pay", it's paid extra
    if (price.includes('NOT INCLUDED') || price.includes('PAY') || price.includes('EXTRA')) {
      return 'paid-extra';
    }
    // Default for HOTEL AMENITY is free-with-booking
    return 'free-with-booking';
  }
  if (model.includes('PUBLIC MEMBERSHIP')) {
    return 'day-passes';
  }

  return 'free-with-booking'; // default
}

// Generate business model text
function generateBusinessModelText(csvModel, dayPassAvailable, dayPassPrice, hotelGuestAccess, hotelGuestPrice) {
  const model = csvModel.toUpperCase();
  const access = (hotelGuestAccess || '').toUpperCase();
  const price = (hotelGuestPrice || '').toUpperCase();

  if (model.includes('EXCLUSIVE HOTEL-GUEST-ONLY')) {
    return 'Exclusive to hotel guests only';
  }
  if (model.includes('DUAL FACILITY')) {
    return 'Free leisure facilities, premium spa upgrade available';
  }
  if (price.includes('NOT INCLUDED') || price.includes('PAY SEPARATELY') || price.includes('PAY EXTRA')) {
    if (price.includes('NOT INCLUDED')) {
      return 'Spa costs extra for hotel guests';
    }
    return `Spa costs extra: ${hotelGuestPrice}`;
  }
  if (access.includes('FREE') || access.includes('INCLUDED')) {
    if (dayPassAvailable === 'YES' && dayPassPrice) {
      return `Spa included with room, day passes ${dayPassPrice}`;
    } else if (dayPassAvailable === 'YES') {
      return 'Spa included with room, day passes available';
    }
    return 'Spa included with all room bookings';
  }

  return 'Spa access varies by room type';
}

// Extract thermal facilities
function extractThermalFacilities(row) {
  const facilities = [];

  const sauna = row['Finnish Sauna'] || '';
  // Check if it's a NO value (whole word or at start, not part of another word)
  const isNo = sauna.toUpperCase().trim() === 'NO' || sauna.toUpperCase().trim().startsWith('NO ') || sauna.toUpperCase().trim().startsWith('NO,') || sauna.toUpperCase().trim().startsWith('NO)');
  if (normalizeYesNo(sauna) && !isNo) {
    let details = sauna.replace(/^YES\s*-\s*/i, '').replace(/^YES\s*/i, '').replace(/^Yes\s*-\s*/i, '').replace(/^Yes\s*/i, '').trim();
    // Remove leading/trailing dashes and clean up
    details = details.replace(/^-\s*/, '').trim();
    const detailsIsNo = details.toUpperCase().trim() === 'NO' || details.toUpperCase().trim().startsWith('NO ') || details.toUpperCase().trim().startsWith('NO,') || details.toUpperCase().trim().startsWith('NO)');
    if (details && !detailsIsNo && !details.includes('(NO')) {
      facilities.push({ name: 'Finnish Sauna', details: details || 'Traditional Finnish sauna' });
    } else if (normalizeYesNo(sauna) && !isNo) {
      facilities.push({ name: 'Finnish Sauna', details: 'Traditional Finnish sauna' });
    }
  }

  const extractFacility = (fieldName, displayName, defaultDetail) => {
    const value = row[fieldName] || '';
    const isNo = value.toUpperCase().trim() === 'NO' || value.toUpperCase().trim().startsWith('NO ') || value.toUpperCase().trim().startsWith('NO,') || value.toUpperCase().trim().startsWith('NO)');
    if (normalizeYesNo(value) && !isNo) {
      let details = value.replace(/^YES\s*-\s*/i, '').replace(/^YES\s*/i, '').replace(/^Yes\s*-\s*/i, '').replace(/^Yes\s*/i, '').trim();
      const detailsIsNo = details.toUpperCase().trim() === 'NO' || details.toUpperCase().trim().startsWith('NO ') || details.toUpperCase().trim().startsWith('NO,') || details.toUpperCase().trim().startsWith('NO)');
      // Skip if it says "NO" or contains "(NO" or similar
      if (details && !detailsIsNo && !details.includes('(NO')) {
        facilities.push({ name: displayName, details: details || defaultDetail });
      } else if (normalizeYesNo(value) && !isNo) {
        facilities.push({ name: displayName, details: defaultDetail });
      }
    }
  };

  extractFacility('Laconium', 'Laconium', 'Gentle heat therapy');
  extractFacility('Salt Steam Room', 'Salt Steam Room', 'Salt therapy steam room');
  extractFacility('Crystal Steam Room', 'Crystal Steam Room', 'Crystal therapy steam room');
  extractFacility('Aroma Steam Room', 'Aroma Steam Room', 'Aromatherapy steam room');
  extractFacility('Herbal Lounge', 'Herbal Lounge', 'Herbal relaxation space');
  extractFacility('Ice Room', 'Ice Room', 'Cool down experience');
  extractFacility('Experience Showers', 'Experience Showers', 'Multi-sensory shower experience');

  return facilities;
}

// Extract pool features
function extractPoolFeatures(row) {
  const features = [];

  const extractPool = (fieldName, displayName, defaultDetail) => {
    const value = row[fieldName] || '';
    if (normalizeYesNo(value) && !value.toUpperCase().includes('NO')) {
      let details = value.replace(/^YES\s*-\s*/i, '').replace(/^YES\s*/i, '').replace(/^Yes\s*-\s*/i, '').replace(/^Yes\s*/i, '').trim();
      if (details && !details.toUpperCase().includes('NO') && !details.includes('(NO')) {
        features.push({ name: displayName, details: details || defaultDetail });
      } else if (normalizeYesNo(value)) {
        features.push({ name: displayName, details: defaultDetail });
      }
    }
  };

  // Indoor Pool
  if (normalizeYesNo(row['Indoor Pool']) && !row['Indoor Pool'].toUpperCase().includes('NO')) {
    let details = (row['Indoor Pool'] || '').replace(/^YES\s*-\s*/i, '').replace(/^YES\s*/i, '').replace(/^Yes\s*-\s*/i, '').replace(/^Yes\s*/i, '').trim();
    // If no details, try to get from Pool Size
    if (!details && row['Pool Size'] && row['Pool Size'] !== 'Not specified' && row['Pool Size'] !== 'N/A') {
      details = row['Pool Size'];
    }
    if (details && !details.toUpperCase().includes('NO')) {
      features.push({ name: 'Indoor Pool', details: details || 'Indoor swimming pool' });
    } else if (normalizeYesNo(row['Indoor Pool'])) {
      features.push({ name: 'Indoor Pool', details: 'Indoor swimming pool' });
    }
  }

  extractPool('Outdoor Pool', 'Outdoor Pool', 'Outdoor swimming pool');
  extractPool('Hydrotherapy Pool', 'Hydrotherapy Pool', 'Hydrotherapy pool');
  extractPool('Vitality Pool', 'Vitality Pool', 'Vitality pool with jets');
  extractPool('Swim-Through Pool', 'Swim-Through Pool', 'Indoor-to-outdoor swim-through');
  extractPool('Jacuzzi/Hot Tub', 'Hot Tub', 'Hot tub or jacuzzi');

  return features;
}

// Build access policy
function buildAccessPolicy(row) {
  const policy = [];

  // Hotel guest access
  if (row['Hotel Guest Access'] && row['Hotel Guest Access'] !== 'N/A') {
    const access = row['Hotel Guest Access'];
    const price = row['Hotel Guest Price'];

    if (access.includes('FREE') || access.includes('Included')) {
      policy.push(`Spa included with room booking`);
    } else if (price && !price.includes('NOT included')) {
      policy.push(`Hotel guests: ${price}`);
    } else {
      policy.push(`Hotel guest access: ${access}`);
    }
  }

  // Day passes
  const dayPassAvail = normalizeYesNo(row['Day Pass Available']);
  if (dayPassAvail) {
    const price = row['Day Pass Price'];
    if (price && price !== 'N/A' && price.trim()) {
      policy.push(`Day passes: ${price}`);
    } else {
      policy.push(`Day passes: Available`);
    }
  } else if (row['Day Pass Available'] && (row['Day Pass Available'].toUpperCase().includes('NO') || row['Day Pass Available'].includes('Not offered'))) {
    policy.push(`Day passes: Not available`);
  }

  // Booking
  if (row['Booking Required'] && row['Booking Required'] !== 'NO') {
    const booking = row['Booking Required'].replace('YES - ', '').replace('YES', '').trim();
    policy.push(`Pre-booking: ${booking || 'Recommended'}`);
  }

  // Age restriction
  if (row['Age Restriction'] && row['Age Restriction'] !== 'Not specified') {
    policy.push(`Age restriction: ${row['Age Restriction']}`);
  }

  // Spa hours
  if (row['Spa Hours'] && row['Spa Hours'] !== 'Not specified') {
    policy.push(`Spa hours: ${row['Spa Hours']}`);
  }

  return policy;
}

// Build key features
function buildKeyFeatures(row) {
  const features = [];

  // Business model summary
  const modelText = generateBusinessModelText(
    row['Business Model'],
    row['Day Pass Available'],
    row['Day Pass Price'],
    row['Hotel Guest Access'],
    row['Hotel Guest Price']
  );
  features.push(modelText);

  // Awards
  if (row['Awards'] && row['Awards'] !== 'Not specified') {
    features.push(`Award: ${row['Awards']}`);
  }

  // Notable facilities
  const poolSize = row['Pool Size'];
  if (poolSize && poolSize !== 'Not specified') {
    features.push(`${poolSize} pool`);
  }

  // Treatment rooms
  if (row['Treatment Rooms'] && row['Treatment Rooms'] !== 'Not specified' && row['Treatment Rooms'] !== 'N/A') {
    let rooms = row['Treatment Rooms'].replace(/^YES\s*-\s*/i, '').replace(/^YES\s*/i, '').replace(/^Yes\s*-\s*/i, '').replace(/^Yes\s*/i, '').trim();
    if (rooms && !rooms.toLowerCase().includes('treatment rooms') && !rooms.toLowerCase().includes('rooms')) {
      features.push(`${rooms} treatment rooms`);
    } else if (rooms && rooms.toLowerCase().includes('treatment rooms')) {
      features.push(rooms);
    } else if (normalizeYesNo(row['Treatment Rooms'])) {
      features.push('Treatment rooms available');
    }
  }

  return features.slice(0, 5); // Limit to 5 key features
}

// Build good to know
function buildGoodToKnow(row) {
  const items = [];

  // What to bring
  if (row['What to Bring'] && row['What to Bring'] !== 'Not specified') {
    items.push(`What to bring: ${row['What to Bring']}`);
  }

  // Parking
  if (row['Parking'] && row['Parking'] !== 'Not specified') {
    items.push(`Parking: ${row['Parking']}`);
  }

  // Dog friendly
  if (row['Dog Friendly'] && row['Dog Friendly'] !== 'NO' && row['Dog Friendly'] !== 'Not specified') {
    items.push(`Dog-friendly: ${row['Dog Friendly']}`);
  }

  // Treatment range
  if (row['Treatment Range'] && row['Treatment Range'] !== 'Not specified') {
    items.push(`Treatments: ${row['Treatment Range']}`);
  }

  // Unique features (first part)
  if (row['Unique Features']) {
    const unique = row['Unique Features'].split(',')[0];
    if (unique) {
      items.push(unique.trim());
    }
  }

  return items.slice(0, 4); // Limit to 4 items
}

// Check if value is explicitly NO (not just containing "no" as part of another word)
function isExplicitlyNo(value) {
  if (!value) return false;
  const upper = value.toUpperCase().trim();
  return upper === 'NO' || upper.startsWith('NO ') || upper.startsWith('NO,') || upper.startsWith('NO)') || upper.startsWith('NO(');
}

// Determine facilities boolean flags
function determineFacilities(row) {
  const sauna = normalizeYesNo(row['Finnish Sauna']) && !isExplicitlyNo(row['Finnish Sauna']);
  const steamRoom = (normalizeYesNo(row['Salt Steam Room']) && !isExplicitlyNo(row['Salt Steam Room'])) ||
    (normalizeYesNo(row['Crystal Steam Room']) && !isExplicitlyNo(row['Crystal Steam Room'])) ||
    (normalizeYesNo(row['Aroma Steam Room']) && !isExplicitlyNo(row['Aroma Steam Room']));
  const iceRoom = normalizeYesNo(row['Ice Room']) && !isExplicitlyNo(row['Ice Room']);
  const hotTub = normalizeYesNo(row['Jacuzzi/Hot Tub']) && !isExplicitlyNo(row['Jacuzzi/Hot Tub']);

  // Check if pool is 15m+
  const poolSize = row['Pool Size'];
  let poolOver15m = false;
  if (poolSize && poolSize !== 'Not specified') {
    // Try to extract size from Pool Size column
    const match = poolSize.match(/(\d+)m/);
    if (match && parseInt(match[1]) >= 15) {
      poolOver15m = true;
    }
  }
  // Also check Indoor Pool, Outdoor Pool, Hydrotherapy Pool descriptions for size
  const indoorPool = row['Indoor Pool'] || '';
  const outdoorPool = row['Outdoor Pool'] || '';
  const hydroPool = row['Hydrotherapy Pool'] || '';
  const allPoolText = `${indoorPool} ${outdoorPool} ${hydroPool}`;
  const poolMatch = allPoolText.match(/(\d+)m/);
  if (poolMatch && parseInt(poolMatch[1]) >= 15) {
    poolOver15m = true;
  }

  // Thermal suite = multiple thermal facilities
  const thermalCount = [
    sauna,
    steamRoom,
    iceRoom,
    normalizeYesNo(row['Laconium']),
    normalizeYesNo(row['Herbal Lounge'])
  ].filter(Boolean).length;
  const thermalSuite = thermalCount >= 2;

  return {
    sauna,
    steamRoom,
    iceRoom,
    hotTub,
    poolOver15m,
    thermalSuite,
  };
}

// Extract primary location (for filtering)
function extractPrimaryLocation(location) {
  // Extract the main location name before parentheses
  const match = location.match(/^([^,\(]+)/);
  if (match) {
    return match[1].trim();
  }
  return location;
}

// Main conversion function
function convertCSVToTypeScript() {
  const rows = parseCSV(csvContent);
  const spas = [];
  const locationsSet = new Set(['All Locations']);
  const seenNames = new Set(); // Track duplicates

  rows.forEach((row) => {
    // Skip duplicates - use the more complete entry (later one)
    const spaName = row['Spa Name'];
    if (seenNames.has(spaName)) {
      return; // Skip duplicate
    }
    seenNames.add(spaName);
    const primaryLocation = extractPrimaryLocation(row['Location']);
    locationsSet.add(primaryLocation);

    // Normalize day pass available
    const dayPassAvailable = normalizeYesNo(row['Day Pass Available']) ? 'YES' : (row['Day Pass Available'] || 'NO');

    const businessModel = mapBusinessModel(
      row['Business Model'],
      dayPassAvailable,
      row['Hotel Guest Access'],
      row['Hotel Guest Price']
    );

    const spa = {
      id: toKebabCase(row['Spa Name']),
      name: row['Spa Name'],
      location: primaryLocation,
      websiteUrl: row['Website'] && row['Website'] !== 'Check booking sites' && row['Website'] !== 'Check website'
        ? (row['Website'].startsWith('http') ? row['Website'] : `https://${row['Website']}`)
        : '#',
      businessModel,
      businessModelText: generateBusinessModelText(
        row['Business Model'],
        dayPassAvailable,
        row['Day Pass Price'],
        row['Hotel Guest Access'],
        row['Hotel Guest Price']
      ),
      imageUrl: `/spa-${toKebabCase(row['Spa Name'])}.jpg`,
      keyFeatures: buildKeyFeatures(row),
      thermalFacilities: extractThermalFacilities(row),
      poolFeatures: extractPoolFeatures(row),
      accessPolicy: buildAccessPolicy(row),
      goodToKnow: buildGoodToKnow(row),
      facilities: determineFacilities(row),
    };

    spas.push(spa);
  });

  // Generate locations array
  const locations = Array.from(locationsSet).sort();

  return { spas, locations };
}

// Generate TypeScript code
function generateTypeScriptCode() {
  const { spas, locations } = convertCSVToTypeScript();

  let code = `import { Spa } from '@/types/spa';\n\n`;
  code += `export const spaData: Spa[] = [\n`;

  spas.forEach((spa, index) => {
    code += `  {\n`;
    code += `    id: '${spa.id}',\n`;
    code += `    name: '${spa.name.replace(/'/g, "\\'")}',\n`;
    code += `    location: '${spa.location.replace(/'/g, "\\'")}',\n`;
    code += `    websiteUrl: '${spa.websiteUrl}',\n`;
    code += `    businessModel: '${spa.businessModel}',\n`;
    code += `    businessModelText: '${spa.businessModelText.replace(/'/g, "\\'")}',\n`;
    code += `    imageUrl: '${spa.imageUrl}',\n`;
    code += `    keyFeatures: [\n`;
    spa.keyFeatures.forEach(feature => {
      code += `      '${feature.replace(/'/g, "\\'")}',\n`;
    });
    code += `    ],\n`;
    code += `    thermalFacilities: [\n`;
    spa.thermalFacilities.forEach(facility => {
      code += `      { name: '${facility.name.replace(/'/g, "\\'")}', details: '${facility.details.replace(/'/g, "\\'")}' },\n`;
    });
    code += `    ],\n`;
    code += `    poolFeatures: [\n`;
    spa.poolFeatures.forEach(pool => {
      code += `      { name: '${pool.name.replace(/'/g, "\\'")}', details: '${pool.details.replace(/'/g, "\\'")}' },\n`;
    });
    code += `    ],\n`;
    code += `    accessPolicy: [\n`;
    spa.accessPolicy.forEach(policy => {
      code += `      '${policy.replace(/'/g, "\\'")}',\n`;
    });
    code += `    ],\n`;
    code += `    goodToKnow: [\n`;
    spa.goodToKnow.forEach(item => {
      code += `      '${item.replace(/'/g, "\\'")}',\n`;
    });
    code += `    ],\n`;
    code += `    facilities: {\n`;
    code += `      sauna: ${spa.facilities.sauna},\n`;
    code += `      steamRoom: ${spa.facilities.steamRoom},\n`;
    code += `      iceRoom: ${spa.facilities.iceRoom},\n`;
    code += `      hotTub: ${spa.facilities.hotTub},\n`;
    code += `      poolOver15m: ${spa.facilities.poolOver15m},\n`;
    code += `      thermalSuite: ${spa.facilities.thermalSuite},\n`;
    code += `    },\n`;
    code += `  }${index < spas.length - 1 ? ',' : ''}\n`;
  });

  code += `];\n\n`;
  code += `export const locations = [\n`;
  locations.forEach((loc, index) => {
    code += `  '${loc}'${index < locations.length - 1 ? ',' : ''}\n`;
  });
  code += `];\n\n`;
  code += `export const facilityOptions = [\n`;
  code += `  { key: 'sauna', label: 'Sauna' },\n`;
  code += `  { key: 'steamRoom', label: 'Steam Room' },\n`;
  code += `  { key: 'iceRoom', label: 'Ice Room' },\n`;
  code += `  { key: 'hotTub', label: 'Hot Tub' },\n`;
  code += `  { key: 'poolOver15m', label: 'Pool 15m+' },\n`;
  code += `  { key: 'thermalSuite', label: 'Thermal Suite' },\n`;
  code += `] as const;\n`;

  return code;
}

// Run the conversion
try {
  const tsCode = generateTypeScriptCode();
  console.log(tsCode);
} catch (error) {
  console.error('Error converting CSV:', error);
  process.exit(1);
}
