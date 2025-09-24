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

// Copy popup.html for Chrome extension (using current design system version)
console.log('Copying popup.html with design system...');
if (existsSync('popup.html')) {
  copyFileSync('popup.html', 'dist/popup.html');
  console.log('✅ popup.html copied successfully');
  
  // Verify design system classes are present
  const popupContent = readFileSync('popup.html', 'utf8');
  const hasDesignSystem = popupContent.includes('design-select') || popupContent.includes('switch-container');
  if (hasDesignSystem) {
    console.log('✅ Design system classes detected in popup.html');
  } else {
    console.log('⚠️ Design system classes not found in popup.html');
  }
} else {
  console.log('❌ popup.html not found in project root');
}

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

// Copy design system components (if needed for extension)
console.log('Checking for design system components...');
const uiSrc = 'src/components/ui';
if (existsSync(uiSrc)) {
  console.log('ℹ️ Design system components found in src/components/ui');
  console.log('ℹ️ Note: UI components are bundled into main.js during build process');
} else {
  console.log('ℹ️ No UI components directory found. Skipping.');
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

