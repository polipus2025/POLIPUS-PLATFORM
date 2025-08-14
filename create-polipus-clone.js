import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

// Create a file to stream archive data to
const output = fs.createWriteStream('POLIPUS_CLONE.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log('✅ POLIPUS_CLONE.zip created successfully!');
  console.log('📦 Total bytes: ' + archive.pointer());
  console.log('🎯 Ready for download from file explorer');
});

// Handle errors
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files and directories to archive
console.log('🚀 Creating POLIPUS CLONE ZIP file...');

// Add essential project files
const filesToAdd = [
  'package.json',
  'tsconfig.json', 
  'vite.config.ts',
  'tailwind.config.ts',
  'components.json',
  'drizzle.config.ts',
  'postcss.config.js',
  'replit.md',
  '.replit'
];

filesToAdd.forEach(file => {
  if (fs.existsSync(file)) {
    archive.file(file, { name: file });
    console.log(`✓ Added: ${file}`);
  }
});

// Add directories
const dirsToAdd = ['client', 'server', 'shared', 'public'];

dirsToAdd.forEach(dir => {
  if (fs.existsSync(dir)) {
    archive.directory(dir, dir);
    console.log(`✓ Added directory: ${dir}/`);
  }
});

// Finalize the archive
archive.finalize();