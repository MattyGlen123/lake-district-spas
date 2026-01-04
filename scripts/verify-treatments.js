// Simple verification script to check the treatments data structure
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying treatment file structure...\n');

const treatmentsDir = path.join(__dirname, '../src/data/treatments');

// Check if directory exists
if (!fs.existsSync(treatmentsDir)) {
  console.error('❌ Treatments directory not found!');
  process.exit(1);
}

// Check individual spa files
const expectedFiles = [1, 2, 3, 4, 5, 6, 7, 8].map(id => `spa-${id}-treatments.ts`);
let allFilesExist = true;
let totalTreatments = 0;

expectedFiles.forEach(filename => {
  const filePath = path.join(treatmentsDir, filename);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const spaId = filename.match(/spa-(\d+)/)[1];

    // Count treatments in this file
    const treatmentCount = (content.match(/spaId:/g) || []).length;
    totalTreatments += treatmentCount;

    // Check that all spaIds in the file match the filename
    const wrongSpaIds = content.match(/spaId:\s*(\d+)/g)?.filter(match => {
      const id = match.match(/\d+/)[0];
      return id !== spaId;
    });

    if (wrongSpaIds && wrongSpaIds.length > 0) {
      console.error(`❌ ${filename}: Contains treatments with wrong spaId!`);
      allFilesExist = false;
    } else {
      console.log(`✅ ${filename}: ${treatmentCount} treatments`);
    }
  } else {
    console.error(`❌ Missing: ${filename}`);
    allFilesExist = false;
  }
});

// Check index file
const indexPath = path.join(treatmentsDir, 'index.ts');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  // Verify it exports the functions we need
  if (indexContent.includes('export function getTreatmentsBySpaId') &&
      indexContent.includes('export function getAllTreatments')) {
    console.log('✅ index.ts: Exports required functions');
  } else {
    console.error('❌ index.ts: Missing required exports');
    allFilesExist = false;
  }
} else {
  console.error('❌ Missing: index.ts');
  allFilesExist = false;
}

console.log(`\n📊 Total treatments: ${totalTreatments}`);

if (allFilesExist) {
  console.log('\n✅ All treatment files are properly structured!');
  process.exit(0);
} else {
  console.log('\n❌ Some issues found with treatment files');
  process.exit(1);
}
