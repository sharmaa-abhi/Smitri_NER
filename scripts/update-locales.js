/**
 * Smitri_NER - Locales Sync & Audit Utility
 * Validates and syncs translation keys across all 13 supported regional languages.
 * 
 * Usage:
 *   node scripts/update-locales.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');

function main() {
  if (!fs.existsSync(EN_PATH)) {
    console.error('Error: en.json not found in', LOCALES_DIR);
    process.exit(1);
  }

  const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  const enKeys = Object.keys(enData);
  console.log(`Found ${enKeys.length} baseline keys in en.json\n`);

  const files = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json') && f !== 'en.json');

  let hasDiscrepancy = false;

  files.forEach((file) => {
    const filePath = path.join(LOCALES_DIR, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const keys = Object.keys(data);
      const missing = enKeys.filter((k) => !(k in data));
      const extra = keys.filter((k) => !(k in enData));

      if (missing.length === 0 && extra.length === 0) {
        console.log(`✅ ${file.padEnd(12)}: Perfectly synced (${keys.length} keys)`);
      } else {
        hasDiscrepancy = true;
        console.log(`⚠️  ${file.padEnd(12)}: Total ${keys.length} keys | Missing: ${missing.length} | Extra: ${extra.length}`);
        if (missing.length > 0) {
          console.log(`    Missing keys in ${file}:`, missing.slice(0, 5).join(', ') + (missing.length > 5 ? '...' : ''));
        }
      }
    } catch (err) {
      console.error(`❌ Error parsing ${file}:`, err.message);
    }
  });

  console.log('\nAudit complete.');
}

main();
