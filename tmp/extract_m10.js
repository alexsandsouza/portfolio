import fs from 'fs';
import pdf from 'pdf-parse';

const files = [
  'M10_Aula01_v3.pdf',
  'M10_Aula02_v3.pdf',
  'M10_Aula03_v3.pdf',
  'M10_Aula04_v3.pdf'
];

async function extract() {
  for (const file of files) {
    try {
      const path = `c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/public/hackersdobem/${file}`;
      if (!fs.existsSync(path)) {
        console.log(`File ${path} does not exist`);
        continue;
      }
      const dataBuffer = fs.readFileSync(path);
      const data = await pdf(dataBuffer);
      
      const outputPath = `c:/Users/alexs/OneDrive/Documentos/Alexsander_Farias/portfolio/public/hackersdobem/${file.replace('.pdf', '')}_text.txt`;
      fs.writeFileSync(outputPath, data.text);
      console.log(`✅ Extracted ${file} to ${outputPath}`);
    } catch (err) {
      console.log(`❌ Error processing ${file}: ${err.message}`);
    }
  }
}

extract();
