import { PDFDocument, StandardFonts, PDFFont } from 'pdf-lib';
import download from 'downloadjs';

// --- Layout Constants ---
const PAGE_MARGIN = 54; // Approx 0.75 inch
const FONT_SIZE_NAME = 22;
const FONT_SIZE_SECTION_HEADER = 12;
const FONT_SIZE_BODY = 11;
const LINE_HEIGHT_BODY = 14.5;
const SPACING_AFTER_PARAGRAPH = 10;
const BULLET_INDENT = 18;
const BULLET_TEXT_INDENT = 28;

/**
 * Helper to split text into lines that fit within a specific width
 */
const breakTextIntoLines = (
  text: string,
  size: number,
  font: PDFFont,
  maxWidth: number
): string[] => {
  if (!text) return [];

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = font.widthOfTextAtSize(`${currentLine} ${word}`, size);
    if (width < maxWidth) {
      currentLine += ` ${word}`;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

/**
 * Generates a Cover Letter PDF
 * Matches the Resume font (Times Roman) for a professional package.
 */
export const generateCoverLetterPDF = async (
  markdownContent: string,
  fileName: string = 'CoverLetter.pdf'
) => {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let currentY = height - PAGE_MARGIN;
  const contentWidth = width - PAGE_MARGIN * 2;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY - neededHeight < PAGE_MARGIN) {
      page = pdfDoc.addPage();
      currentY = height - PAGE_MARGIN;
    }
  };

  const lines = markdownContent.split('\n');

  for (const line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine) {
      currentY -= LINE_HEIGHT_BODY;
      continue;
    }

    // Headers (Name or Contact Info at top)
    if (cleanLine.startsWith('#')) {
      const text = cleanLine.replace(/^#+\s*/, '');
      // Determine if main title or subtitle based on # count
      const isMainTitle = cleanLine.startsWith('# ');
      const fontSize = isMainTitle ? FONT_SIZE_NAME : FONT_SIZE_SECTION_HEADER;
      const font = isMainTitle ? fontBold : fontRegular;

      checkPageBreak(fontSize + 20);

      // Left align for standard business letter format, or Center if it's the header
      // We'll default to left for strict letter format, but if it's the Name (first line), center it
      if (isMainTitle) {
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: currentY,
          size: fontSize,
          font: font,
        });
      } else {
        page.drawText(text, {
          x: PAGE_MARGIN,
          y: currentY,
          size: fontSize,
          font: font,
        });
      }

      currentY -= fontSize + 10;
      continue;
    }

    // Bullets in Cover Letter (Achievements)
    if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
      const bulletText = cleanLine.replace(/^[-*]\s*/, '').replace(/\*\*/g, '');
      const wrappedLines = breakTextIntoLines(
        bulletText,
        FONT_SIZE_BODY,
        fontRegular,
        contentWidth - BULLET_TEXT_INDENT
      );

      checkPageBreak(
        wrappedLines.length * LINE_HEIGHT_BODY + SPACING_AFTER_PARAGRAPH
      );

      page.drawText('•', {
        x: PAGE_MARGIN + BULLET_INDENT,
        y: currentY,
        size: FONT_SIZE_BODY,
        font: fontRegular,
      });

      let textY = currentY;
      for (const textLine of wrappedLines) {
        page.drawText(textLine, {
          x: PAGE_MARGIN + BULLET_TEXT_INDENT,
          y: textY,
          size: FONT_SIZE_BODY,
          font: fontRegular,
        });
        textY -= LINE_HEIGHT_BODY;
      }
      currentY = textY - 4;
      continue;
    }

    // Standard Paragraphs
    const wrappedLines = breakTextIntoLines(
      cleanLine.replace(/\*\*/g, ''),
      FONT_SIZE_BODY,
      fontRegular,
      contentWidth
    );
    checkPageBreak(
      wrappedLines.length * LINE_HEIGHT_BODY + SPACING_AFTER_PARAGRAPH
    );

    for (const textLine of wrappedLines) {
      page.drawText(textLine, {
        x: PAGE_MARGIN,
        y: currentY,
        size: FONT_SIZE_BODY,
        font: fontRegular,
      });
      currentY -= LINE_HEIGHT_BODY;
    }
    currentY -= SPACING_AFTER_PARAGRAPH;
  }

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, fileName, 'application/pdf');
};
