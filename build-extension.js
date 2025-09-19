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
            width: 320px;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
            color: #ffffff;
            margin: 0;
            border-radius: 16px;
            overflow: hidden;
        }
        
        .container {
            padding: 24px;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            position: relative;
        }
        
        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.005) 100%);
            pointer-events: none;
        }
        
        h2 {
            margin: 0 0 24px 0;
            font-size: 24px;
            font-weight: 700;
            text-align: center;
            background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .title-icon {
            width: 28px;
            height: 28px;
            filter: brightness(1.2) contrast(1.2);
        }
        
        .setting {
            margin-bottom: 20px;
        }
        
        .setting:last-of-type {
            margin-bottom: 16px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 14px;
            color: #e5e5e5;
        }
        
        select {
            width: 100%;
            padding: 12px 16px;
            border: none;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            font-size: 14px;
            color: #ffffff;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        select:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
        }
        
        select:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.25);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
        }
        
        option {
            background: #2d2d2d;
            color: #ffffff;
            padding: 8px;
        }
        
        .switch-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 8px;
            padding: 12px 16px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.3s ease;
        }
        
        .switch-label {
            margin: 0;
            font-size: 14px;
            font-weight: 500;
            color: #f0f0f0;
            user-select: none;
            flex: 1;
        }
        
        /* Hide default checkbox */
        .switch-input {
            display: none;
        }
        
        /* Custom toggle switch */
        .switch {
            position: relative;
            width: 44px;
            height: 24px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .switch:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        .switch::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 18px;
            height: 18px;
            background: linear-gradient(145deg, #ffffff 0%, #e5e5e5 100%);
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .switch-input:checked + .switch {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.4);
        }
        
        .switch-input:checked + .switch::before {
            transform: translateX(20px);
            background: linear-gradient(145deg, #ffffff 0%, #f8f8f8 100%);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .info {
            text-align: center;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            margin-top: 20px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>
            <img src="./icons/icon-128.png" alt="Lingua Tab" class="title-icon">
            <span>Lingua Tab</span>
        </h2>
        
        <div class="setting">
            <label for="language">Choose your language:</label>
            <select id="language">
                <option value="pt">🇵🇹 Portuguese</option>
                <option value="uk">🇺🇦 Ukrainian</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="fr">🇫🇷 French</option>
                <option value="de">🇩🇪 German</option>
                <option value="it">🇮🇹 Italian</option>
                <option value="ja">🇯🇵 Japanese</option>
            </select>
        </div>
        
        <div class="setting">
            <label>Animation Settings:</label>
            <div class="switch-container">
                <label for="pauseAnimation" class="switch-label">⏸️ Pause animation</label>
                <input type="checkbox" id="pauseAnimation" class="switch-input">
                <div class="switch"></div>
            </div>
            <div class="switch-container">
                <label for="hideAnimation" class="switch-label">🚫 Hide animation</label>
                <input type="checkbox" id="hideAnimation" class="switch-input">
                <div class="switch"></div>
            </div>
        </div>
        
        <div class="setting">
            <label>Japanese Settings:</label>
            <div class="switch-container">
                <label for="showFurigana" class="switch-label">🔤 Show furigana (ひらがな)</label>
                <input type="checkbox" id="showFurigana" class="switch-input">
                <div class="switch"></div>
            </div>
        </div>
        
        <div class="info">
            Open a new tab to see your daily word!
        </div>
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

// Copy icons
console.log('Copying icons...');
const iconFiles = ['icon-16.png', 'icon-32.png', 'icon-48.png', 'icon-128.png'];
let iconsCopied = 0;
iconFiles.forEach(iconFile => {
  const sourcePath = `icons/${iconFile}`;
  const destPath = `dist/icons/${iconFile}`;
  if (existsSync(sourcePath)) {
    copyFileSync(sourcePath, destPath);
    iconsCopied++;
  } else {
    console.log(`⚠️ Icon not found: ${sourcePath}`);
  }
});
console.log(`✅ Copied ${iconsCopied}/${iconFiles.length} icon files`);

// Final verification of all files
console.log('\n🔍 Final file verification:');
const requiredFiles = ['index.html', 'main.js', 'manifest.json', 'popup.html', 'popup.js'];
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

