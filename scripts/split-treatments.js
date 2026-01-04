const fs = require('fs');
const path = require('path');

// Read the treatments file
const treatmentsPath = path.join(__dirname, '../src/data/treatments.ts');
const content = fs.readFileSync(treatmentsPath, 'utf-8');

// Extract the array content
const arrayMatch = content.match(/export const treatmentsData: Treatment\[\] = \[([\s\S]*)\];/);
if (!arrayMatch) {
  console.error('Could not find treatmentsData array');
  process.exit(1);
}

// Parse treatments by spaId
const treatmentsBySpaId = {};

// Split by treatment objects (each starts with '  {')
const treatmentsText = arrayMatch[1];
const treatmentObjects = [];
let currentTreatment = '';
let braceCount = 0;
let inTreatment = false;

for (let i = 0; i < treatmentsText.length; i++) {
  const char = treatmentsText[i];

  if (char === '{') {
    if (braceCount === 0) {
      inTreatment = true;
      currentTreatment = '';
    }
    braceCount++;
  }

  if (inTreatment) {
    currentTreatment += char;
  }

  if (char === '}') {
    braceCount--;
    if (braceCount === 0 && inTreatment) {
      treatmentObjects.push(currentTreatment.trim());
      inTreatment = false;
    }
  }
}

// Group by spaId
treatmentObjects.forEach(treatmentStr => {
  const spaIdMatch = treatmentStr.match(/spaId:\s*(\d+)/);
  if (spaIdMatch) {
    const spaId = parseInt(spaIdMatch[1]);
    if (!treatmentsBySpaId[spaId]) {
      treatmentsBySpaId[spaId] = [];
    }
    treatmentsBySpaId[spaId].push(treatmentStr);
  }
});

// Create treatments directory
const treatmentsDir = path.join(__dirname, '../src/data/treatments');
if (!fs.existsSync(treatmentsDir)) {
  fs.mkdirSync(treatmentsDir, { recursive: true });
}

// Write individual files
Object.keys(treatmentsBySpaId).sort((a, b) => parseInt(a) - parseInt(b)).forEach(spaId => {
  const treatments = treatmentsBySpaId[spaId];
  const fileName = `spa-${spaId}-treatments.ts`;
  const filePath = path.join(treatmentsDir, fileName);

  const fileContent = `import { Treatment } from '@/types/spa';

export const spa${spaId}Treatments: Treatment[] = [
${treatments.join(',\n')}
];
`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`Created ${fileName} with ${treatments.length} treatments`);
});

console.log('\n✅ Successfully split treatments into individual files!');
console.log(`📁 Files created in: src/data/treatments/`);
