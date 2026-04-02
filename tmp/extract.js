const fs = require('fs');
const pdf = require('c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/node_modules/pdf-parse');

const files = [
  'M6_Aula03_v2.pdf',
  'M6_Aula04_v2.pdf',
  'M7_Aula01_v2.pdf',
  'M7_Aula02_v2.pdf'
];

async function extract() {
  for (const file of files) {
    try {
      const path = `c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/public/hackersdobem/${file}`;
      if (!fs.existsSync(path)) {
        console.error(`File ${path} does not exist`);
        continue;
      }
      const dataBuffer = fs.readFileSync(path);
      const data = await pdf(dataBuffer);
      
      const outputPath = `c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/public/hackersdobem/${file.replace('.pdf', '.txt')}`;
      fs.writeFileSync(outputPath, data.text);
      console.log(`Extracted ${file} to ${outputPath}`);
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }
}

extract();
