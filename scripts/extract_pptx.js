const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, '../tmp/pptx_extracted/ppt/slides');
const files = fs.readdirSync(slidesDir)
  .filter(f => f.startsWith('slide') && f.endsWith('.xml'))
  .sort((a, b) => {
    const numA = parseInt(a.replace('slide', '').replace('.xml', ''), 10);
    const numB = parseInt(b.replace('slide', '').replace('.xml', ''), 10);
    return numA - numB;
  });

let fullText = '';

files.forEach(file => {
  const content = fs.readFileSync(path.join(slidesDir, file), 'utf8');
  // extract all text inside <a:t>...</a:t>
  const matches = content.match(/<a:t[^>]*>(.*?)<\/a:t>/g) || [];
  const slideText = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
  fullText += `\n\n--- SLIDE ${file} ---\n${slideText}`;
});

fs.writeFileSync(path.join(__dirname, '../tmp/slides_content.txt'), fullText, 'utf8');
console.log(`Extracted ${files.length} slides to tmp/slides_content.txt`);
