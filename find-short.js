const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        searchDir(fullPath);
      }
    } else {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes('nextshort')) {
        console.log(`FOUND IN: ${fullPath}`);
        // Let's find exactly how many occurrences and lines
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes('nextshort')) {
            console.log(`  Line ${index + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

searchDir(__dirname);
