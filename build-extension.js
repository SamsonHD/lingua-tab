import { copyFileSync, mkdirSync, existsSync, writeFileSync, readFileSync, rmSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { glob } from 'glob';

// Build the project
console.log('Building the project...');
execSync('npm run build', { stdio: 'inherit' });

// Inline CSS into JavaScript
console.log('Inlining CSS into JavaScript...');
const cssFiles = glob.sync('dist/**/*.css');
const jsFiles = glob.sync('dist/**/*.js');

if (cssFiles.length > 0 && jsFiles.length > 0) {
  // Read all CSS content
  const cssContent = cssFiles.map(file => readFileSync(file, 'utf8')).join('\n');
  
  // Read main JS file
  const mainJsFile = jsFiles.find(file => file.includes('main.js')) || jsFiles[0];
  const jsContent = readFileSync(mainJsFile, 'utf8');
  
  // Create CSS injection code
  const cssInjectionCode = `
(function() {
  const style = document.createElement('style');
  style.textContent = ${JSON.stringify(cssContent)};
  document.head.appendChild(style);
})();
`;
  
  // Write combined JS file
  writeFileSync(mainJsFile, cssInjectionCode + jsContent);
  
  // Remove CSS files and assets directory
  cssFiles.forEach(file => rmSync(file));
  if (existsSync('dist/assets')) {
    rmSync('dist/assets', { recursive: true, force: true });
  }
  
  console.log('CSS successfully inlined into JavaScript');
}

// Create icons directory in dist if it doesn't exist
if (!existsSync('dist/icons')) {
  mkdirSync('dist/icons', { recursive: true });
}

// Create index.html for Chrome extension (overwrite any existing file)
console.log('Creating index.html for Chrome extension...');
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LinguaTab</title>
</head>
<body>
  <div id="root"></div>
  <script src="./main.js"></script>
</body>
</html>`;

// Force overwrite the index.html file
writeFileSync('dist/index.html', indexHtml);
console.log('✅ index.html created successfully');

// Verify the file was written correctly
const writtenContent = readFileSync('dist/index.html', 'utf8');
console.log('📝 Verification - index.html content:');
console.log(writtenContent);

// Create popup.html for Chrome extension
console.log('Creating popup.html for Chrome extension...');
const popupHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            width: 300px;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
        }
        h2 {
            margin: 0 0 15px 0;
            font-size: 18px;
            text-align: center;
        }
        .setting {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        select {
            width: 100%;
            padding: 8px;
            border: none;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.9);
            font-size: 14px;
        }
        .info {
            text-align: center;
            font-size: 12px;
            opacity: 0.8;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <h2>🌍 LinguaTab</h2>
    
    <div class="setting">
        <label for="language">Choose your language:</label>
        <select id="language">
            <option value="es">🇪🇸 Spanish</option>
            <option value="fr">🇫🇷 French</option>
            <option value="de">🇩🇪 German</option>
            <option value="it">🇮🇹 Italian</option>
            <option value="pt">🇵🇹 Portuguese</option>
        </select>
    </div>
    
    <div class="info">
        Open a new tab to see your daily word!
    </div>
    
    <script src="./popup.js"></script>
</body>
</html>`;

writeFileSync('dist/popup.html', popupHtml);

// Copy manifest.json to dist
console.log('Copying manifest.json...');
copyFileSync('manifest.json', 'dist/manifest.json');

// Copy popup files to dist
console.log('Copying popup files...');
copyFileSync('popup.js', 'dist/popup.js');
copyFileSync('popup-analytics.js', 'dist/popup-analytics.js');

// Copy dictionaries to dist
console.log('Copying dictionaries...');
const dictSrc = 'src/dictionaries';
if (existsSync(dictSrc)) {
  if (!existsSync('dist/dictionaries')) {
    mkdirSync('dist/dictionaries', { recursive: true });
  }
  const dictFiles = glob.sync(`${dictSrc}/*.json`);
  for (const file of dictFiles) {
    const filename = file.split('/').pop();
    if (filename) {
      copyFileSync(file, `dist/dictionaries/${filename}`);
    }
  }
  console.log(`✅ Copied ${glob.sync(`${dictSrc}/*.json`).length} dictionary files`);
} else {
  console.log('ℹ️ No dictionaries directory found. Skipping.');
}

// Copy icons (you'll need to create these)
console.log('Note: Make sure to create icon files in the icons/ directory');
console.log('Required icons: icon-16.png, icon-32.png, icon-48.png, icon-128.png');

// Final verification of all files
console.log('\n🔍 Final file verification:');
const requiredFiles = ['index.html', 'main.js', 'manifest.json', 'popup.html', 'popup.js', 'popup-analytics.js'];
for (const file of requiredFiles) {
  const filePath = `dist/${file}`;
  if (existsSync(filePath)) {
    const stats = statSync(filePath);
    console.log(`✅ ${file} - ${Math.round(stats.size / 1024)}KB`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
  }
}

// Verify dictionaries exist
const distDicts = glob.sync('dist/dictionaries/*.json');
if (distDicts.length > 0) {
  console.log(`✅ Dictionaries present: ${distDicts.length} files`);
} else {
  console.log('❌ No dictionaries found in dist/dictionaries');
}

console.log('\n🎉 Chrome extension built successfully in dist/ directory!');
console.log('📁 Extension files are ready for installation');
console.log('\nTo install:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked" and select the dist/ directory');
console.log('4. Make sure to select the DIST directory, not the project root!');
