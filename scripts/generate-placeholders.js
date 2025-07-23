const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const properties = [
  { id: 1, title: 'Luxury Penthouse' },
  { id: 2, title: 'Modern Villa' },
  { id: 3, title: 'Waterfront Condo' },
  { id: 4, title: 'Historic Townhouse' },
  { id: 5, title: 'Luxury Apartment' },
  { id: 6, title: 'Modern Office' }
];

const outputDir = path.join(__dirname, '../public/images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

properties.forEach(property => {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, 800, 600);

  // Add text
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#374151';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(property.title, 400, 250);

  ctx.font = '24px Arial';
  ctx.fillStyle = '#6B7280';
  ctx.fillText(`Property ID: ${property.id}`, 400, 320);

  // Save image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(outputDir, `property${property.id}.jpg`), buffer);
});

console.log('Placeholder images generated successfully!'); 