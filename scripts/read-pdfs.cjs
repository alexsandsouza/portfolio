const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfPath = path.join(__dirname, 'public', 'fametro', 'Aula_04_Sistemas_Operacionais.pdf');
const txtPath = path.join(__dirname, 'public', 'fametro', 'Aula_04_Sistemas_Operacionais.txt');

async function processPdf() {
  if (fs.existsSync(pdfPath)) {
    console.log(`Processing: Aula_04_Sistemas_Operacionais.pdf`);
    let dataBuffer = fs.readFileSync(pdfPath);
    try {
      let data = await pdf(dataBuffer);
      fs.writeFileSync(txtPath, data.text);
      console.log(`Saved: Aula_04_Sistemas_Operacionais.txt`);
    } catch (err) {
      console.error(`Error processing PDF:`, err);
    }
  } else {
    console.error(`File not found: ${pdfPath}`);
  }
}

processPdf();
