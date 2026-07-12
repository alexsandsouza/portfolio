import fs from 'fs';
import pdf from 'pdf-parse';

const modules = ['M1', 'M2', 'M3', 'M4', 'M7', 'M8', 'M9'];
const aulas = ['01', '02', '03', '04'];

// Map names to actual filenames
const fileMap = {
  'M1_Aula01': 'M1_Aula01_v4',
  'M1_Aula02': 'M1_Aula02_v2',
  'M1_Aula03': 'M1_Aula03_v3',
  'M1_Aula04': 'M1_Aula04_v3',
  'M2_Aula01': 'M2_Aula01_v2',
  'M2_Aula02': 'M2_Aula02_v2',
  'M2_Aula03': 'M2_Aula03_v2',
  'M2_Aula04': 'M2_Aula04_v2',
  'M3_Aula01': 'M3_Aula01_v3',
  'M3_Aula02': 'M3_Aula02_v3',
  'M3_Aula03': 'M3_Aula03_v3',
  'M3_Aula04': 'M3_Aula04_v2',
  'M4_Aula01': 'M4_Aula01_v3',
  'M4_Aula02': 'M4_Aula02_V2',
  'M4_Aula03': 'M4_Aula03_v2',
  'M4_Aula04': 'M4_Aula04_v3',
  'M7_Aula01': 'M7_Aula01_v2',
  'M7_Aula02': 'M7_Aula02_v2',
  'M7_Aula03': 'M7_Aula03_v2',
  'M7_Aula04': 'M7_Aula04_v2',
  'M8_Aula01': 'M8_Aula01_v3',
  'M8_Aula02': 'M8_Aula02_v2',
  'M8_Aula03': 'M8_Aula03_v3',
  'M8_Aula04': 'M8_Aula04_v3',
  'M9_Aula01': 'M9_Aula01_v3',
  'M9_Aula02': 'M9_Aula02_v3',
  'M9_Aula03': 'M9_Aula03_v3',
  'M9_Aula04': 'M9_Aula04_v3',
};

async function extract() {
  for (const mod of modules) {
    for (const aula of aulas) {
      const key = `${mod}_Aula${aula}`;
      const filename = fileMap[key];
      if (!filename) { console.log(`Skipping ${key} - no mapping`); continue; }
      const file = `public/hackersdobem/${filename}.pdf`;
      const outFile = `public/hackersdobem/${key}.txt`;
      if (fs.existsSync(outFile)) { console.log(`Already exists: ${outFile}`); continue; }
      if (!fs.existsSync(file)) { console.log(`Not found: ${file}`); continue; }
      try {
        const dataBuffer = fs.readFileSync(file);
        const data = await pdf(dataBuffer);
        fs.writeFileSync(outFile, data.text);
        console.log(`OK: ${outFile}`);
      } catch (err) {
        console.error(`Error ${file}:`, err.message);
      }
    }
  }
  console.log('\nDone!');
}

extract();
