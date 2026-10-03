/**
 * Smitri_NER - i18n Completeness & Parity Checker
 * Compares all language dictionaries against English (baseline).
 * Verifies enabled vs planned languages, reports missing keys and completeness percentages.
 * 
 * Usage:
 *   node scripts/check-i18n.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');

const ENABLED_LANGUAGES = ['en', 'as', 'bn', 'hi'];
const PLANNED_LANGUAGES = ['mni', 'brx', 'kha', 'grx', 'miz', 'nag', 'trp', 'ne', 'adi'];

function checkTranslations() {
  if (!fs.existsSync(EN_PATH)) {
    console.error('❌ Baseline en.json not found in', LOCALES_DIR);
    process.exit(1);
  }

  const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  const enKeys = Object.keys(enData);
  const totalEnKeys = enKeys.length;

  console.log('='.repeat(70));
  console.log(`SMITRI_NER i18n Completeness Audit`);
  console.log(`Baseline English Keys: ${totalEnKeys}`);
  console.log('='.repeat(70));

  console.log('\n[ACTIVE & FULLY ENABLED LANGUAGES]');
  let hasMissingInActive = false;

  ENABLED_LANGUAGES.forEach((code) => {
    const filePath = path.join(LOCALES_DIR, `${code}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing file: ${code}.json`);
      hasMissingInActive = true;
      return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const missing = enKeys.filter((k) => !(k in data) || data[k] === '');
    const keysCount = Object.keys(data).length;
    const completeness = Math.round(((totalEnKeys - missing.length) / totalEnKeys) * 100);

    if (missing.length === 0) {
      console.log(`  ✓ ${code.toUpperCase().padEnd(4)}: ${keysCount} / ${totalEnKeys} keys (${completeness}%) - Fully Supported`);
    } else {
      hasMissingInActive = true;
      console.log(`  ⚠ ${code.toUpperCase().padEnd(4)}: ${keysCount} / ${totalEnKeys} keys (${completeness}%) - ${missing.length} missing`);
      console.log(`     Missing: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? '...' : ''}`);
    }
  });

  console.log('\n[PLANNED NORTH EAST REGIONAL DIALECTS (In Review / Coming Soon)]');
  PLANNED_LANGUAGES.forEach((code) => {
    const filePath = path.join(LOCALES_DIR, `${code}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⏳ ${code.toUpperCase().padEnd(4)}: File not initialized yet`);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keysCount = Object.keys(data).length;
    const hasAudio = !!data.voice_welcome;
    console.log(`  ⏳ ${code.toUpperCase().padEnd(4)}: ${keysCount} keys staged | Audio preview: ${hasAudio ? 'Ready' : 'Pending'} | Status: Coming Soon`);
  });

  console.log('\n' + '='.repeat(70));
  if (hasMissingInActive) {
    console.log('❌ Audit failed: Some active languages have missing keys.');
    process.exit(1);
  } else {
    console.log('✅ Audit passed: All active production languages have 100% key parity with English.');
    console.log('   Planned languages are clearly cataloged without misleading users.');
    console.log('='.repeat(70) + '\n');
  }
}

checkTranslations();
