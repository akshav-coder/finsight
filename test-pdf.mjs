import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extract() {
  const data = new Uint8Array(fs.readFileSync('HDFC_Statement_March2025.pdf'));
  try {
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    console.log("SUCCESS. Length:", fullText.length);
    console.log(fullText.substring(0, 500));
  } catch (err) {
    console.error("ERROR:", err.name, err.message);
  }
}
extract();
