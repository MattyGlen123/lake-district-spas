# Conversion Scripts

This folder contains scripts and output files for converting CSV data to TypeScript.

## Files

- **`convert-csv-to-ts.js`** - Main conversion script that reads the CSV file and generates TypeScript spa data
- **`converted-spas*.ts`** - Output files from previous conversion runs

## Usage

Run the conversion script from the project root:

```bash
node scripts/convert-csv-to-ts.js > scripts/converted-spas-output.ts
```

The script expects the CSV file to be located at:
`/Users/matty/Desktop/lake-district-spas-database-corrected.csv`

## Output

The script generates TypeScript code that matches the `Spa` interface defined in `src/types/spa.ts`. The output can be copied directly into `src/data/spas.ts`.
