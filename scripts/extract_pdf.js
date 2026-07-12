import fs from 'fs';
import pdf from 'pdf-parse';

const files = [
  'public/hackersdobem/M12_Aula01_v2.pdf',
  'public/hackersdobem/M12_Aula02_v2.pdf',
  'public/hackersdobem/M12_Aula03_v2.pdf',
  'public/hackersdobem/M12_Aula04_v2.pdf'
];

async function extract() {
  for (const file of files) {
    try {
      const dataBuffer = fs.readFileSync(file);
      const data = await pdf(dataBuffer);
      fs.writeFileSync(`${file.replace('.pdf', '.txt')}`, data.text);
      console.log(`Extracted: ${file}`);
    } catch (err) {
      console.error(`Error reading ${file}:`, err.message);
    }
  }
}

extract();
