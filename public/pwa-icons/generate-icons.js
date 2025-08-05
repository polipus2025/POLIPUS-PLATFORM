// PWA Icon Generator Script
// This creates SVG icons for the Polipus Environmental Intelligence Platform

const fs = require('fs');
const path = require('path');

// Create icon directory if it doesn't exist
const iconDir = './public/pwa-icons';
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// SVG template for Polipus icon
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#gradient)" />
  
  <!-- Letter P -->
  <text x="${size/2}" y="${size/2 + size*0.15}" 
        text-anchor="middle" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${size*0.6}" 
        font-weight="bold" 
        fill="white">P</text>
        
  <!-- Environmental elements -->
  <circle cx="${size*0.25}" cy="${size*0.25}" r="${size*0.05}" fill="#10b981" opacity="0.8" />
  <circle cx="${size*0.75}" cy="${size*0.25}" r="${size*0.04}" fill="#10b981" opacity="0.6" />
  <circle cx="${size*0.75}" cy="${size*0.75}" r="${size*0.06}" fill="#10b981" opacity="0.7" />
  <circle cx="${size*0.25}" cy="${size*0.75}" r="${size*0.03}" fill="#10b981" opacity="0.9" />
</svg>
`;

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Generating Polipus PWA Icons...');

iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconDir, filename);
  
  fs.writeFileSync(filepath, svgContent.trim());
  console.log(`Generated: ${filename}`);
});

console.log('PWA Icons generated successfully!');
console.log('Note: For production, convert SVG files to PNG format for better compatibility.');