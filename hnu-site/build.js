const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, 'src');
const distFile = path.join(__dirname, 'script.js');

if (!fs.existsSync(srcDir)) {
  console.error('Error: src directory does not exist.');
  process.exit(1);
}

const files = fs.readdirSync(srcDir)
  .filter(f => f.endsWith('.js'))
  .sort();

console.log('Building script.js from', files.length, 'modules in src/...');

let bundle = `/* =========================================================================
 * أسرة طلاب من أجل مصر — جامعة حلوان الأهلية
 * Modular Bundle: Generated from src/
 * Total Modules: ${files.length}
 * Generated: ${new Date().toISOString()}
 * ========================================================================= */\n\n`;

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  bundle += `\n/* >>> MODULE: ${file} <<< */\n` + content + '\n';
});

fs.writeFileSync(distFile, bundle, 'utf8');

// Validate syntax
try {
  execSync(`node -c "${distFile}"`, { stdio: 'inherit' });
  const stats = fs.statSync(distFile);
  const lines = bundle.split('\n').length;
  console.log(`✅ Build successful! script.js generated (${lines} lines, ${(stats.size / 1024).toFixed(1)} KB).`);
} catch (err) {
  console.error('❌ Build failed: Syntax error in generated script.js');
  process.exit(1);
}
