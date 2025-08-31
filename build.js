import { build } from 'esbuild';
import pathAlias from 'esbuild-plugin-path-alias';
import path from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Helper function to copy directory recursively
function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const files = readdirSync(src);
  
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Copy shared directory to dist for runtime access
console.log('Copying shared directory to dist...');
copyDir(path.resolve(__dirname, 'shared'), path.resolve(__dirname, 'dist/shared'));

// Build with path alias resolution
console.log('Building server with path resolution...');
await build({
  entryPoints: ['server/index.ts'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  plugins: [
    pathAlias({
      '@shared': path.resolve(__dirname, 'shared'),
      '@': path.resolve(__dirname, 'client/src'),
      '@assets': path.resolve(__dirname, 'attached_assets')
    })
  ]
}).then(() => {
  console.log('✅ Build completed successfully with path resolution!');
}).catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});