import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Custom plugin to inline CSS for Chrome extensions
const inlineCSS = () => {
  return {
    name: 'inline-css',
    generateBundle(options, bundle) {
      const cssFiles = Object.keys(bundle).filter(fileName => fileName.endsWith('.css'));
      const jsFiles = Object.keys(bundle).filter(fileName => fileName.endsWith('.js'));
      
      if (cssFiles.length > 0 && jsFiles.length > 0) {
        const cssContent = cssFiles.map(fileName => {
          const cssAsset = bundle[fileName];
          const content = cssAsset.source || cssAsset.code;
          delete bundle[fileName]; // Remove CSS file from bundle
          return content;
        }).join('\n');
        
        // Inject CSS into the main JS file
        const mainJsFile = jsFiles[0];
        const jsAsset = bundle[mainJsFile];
        const cssInjectionCode = `
(function() {
  const style = document.createElement('style');
  style.textContent = ${JSON.stringify(cssContent)};
  document.head.appendChild(style);
})();
`;
        jsAsset.code = cssInjectionCode + jsAsset.code;
      }
    }
  };
};

export default defineConfig({
  plugins: [react(), inlineCSS()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.tsx'),
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (assetInfo) => {
          // Force CSS to be inlined by not generating separate CSS files
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name].[ext]';
          }
          return '[name].[ext]';
        },
        format: 'iife',
        inlineDynamicImports: true
      }
    },
    copyPublicDir: false
  },
  base: './',
  server: {
    port: 3000,
    open: true,
  },
  publicDir: 'public'
});