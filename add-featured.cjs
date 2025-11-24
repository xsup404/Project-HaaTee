const fs = require('fs');
const path = require('path');

const propertiesPath = path.join(__dirname, 'src/data/properties.json');

// Read properties
const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));

// Sort by views DESC and get top 3
const topThree = properties
  .sort((a, b) => (b.views || 0) - (a.views || 0))
  .slice(0, 3)
  .map(p => p.id);

console.log('Top 3 properties by views:', topThree);
console.log('Top 3 view counts:', properties
  .sort((a, b) => (b.views || 0) - (a.views || 0))
  .slice(0, 3)
  .map(p => `ID: ${p.id}, Views: ${p.views}`));

// Add featured flag to top 3
const updated = properties.map(prop => ({
  ...prop,
  featured: topThree.includes(prop.id)
}));

// Write back
fs.writeFileSync(propertiesPath, JSON.stringify(updated, null, 2));

console.log('✅ Added featured flag to top 3 properties');
