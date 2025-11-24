
import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';
import download from 'downloadjs';

// --- Layout Constants ---
const PAGE_MARGIN = 54; // Approx 0.75 inch
const FONT_SIZE_NAME = 22;
const FONT_SIZE_SECTION_HEADER = 12;
const FONT_SIZE_BODY = 11;
const LINE_HEIGHT_BODY = 14.5;
const SPACING_AFTER_HEADER = 6;
const SPACING_AFTER_SECTION = 18;
const SPACING_AFTER_PARAGRAPH = 10;
const LIST_ITEM_SPACING = 4;
const BULLET_INDENT = 18;
const BULLET_TEXT_INDENT = 28;

/**
 * Helper to split text into lines that fit within a specific width
 */
const breakTextIntoLines = (text: string, size: number, font: PDFFont, maxWidth: number): string[] => {
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
 * Generates a Resume PDF (Harvard Style - Serif)
 */
export const generateResumePDF = async (markdownContent: string, fileName: string = 'Resume.pdf') => {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  
  // Harvard Style uses Serif fonts (Times New Roman)
  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  let currentY = height - PAGE_MARGIN;
  const contentWidth = width - (PAGE_MARGIN * 2);

  const checkPageBreak = (neededHeight: number) => {
    if (currentY - neededHeight < PAGE_MARGIN) {
      page = pdfDoc.addPage();
      currentY = height - PAGE_MARGIN;
    }
  };

  const lines = markdownContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
        currentY -= LINE_HEIGHT_BODY / 2;
        continue;
    }

    // --- HEADERS ---
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const text = line.replace(/^#+\s*/, '').trim();
      
      if (level === 1) {
        // Name / Top Header (Centered)
        checkPageBreak(FONT_SIZE_NAME + 20);
        const textWidth = fontBold.widthOfTextAtSize(text.toUpperCase(), FONT_SIZE_NAME);
        page.drawText(text.toUpperCase(), {
          x: (width - textWidth) / 2,
          y: currentY,
          size: FONT_SIZE_NAME,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        currentY -= (FONT_SIZE_NAME + 10);
      } else {
        // Section Headers (e.g. EXPERIENCE)
        checkPageBreak(40);
        currentY -= 5;
        page.drawText(text.toUpperCase(), {
          x: PAGE_MARGIN,
          y: currentY,
          size: FONT_SIZE_SECTION_HEADER,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        
        // Horizontal Line under section
        page.drawLine({
            start: { x: PAGE_MARGIN, y: currentY - 4 },
            end: { x: width - PAGE_MARGIN, y: currentY - 4 },
            thickness: 0.75,
            color: rgb(0, 0, 0),
        });
        currentY -= (FONT_SIZE_SECTION_HEADER + SPACING_AFTER_HEADER);
      }
      continue;
    }

    // --- BULLET POINTS ---
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const cleanText = line.replace(/^[-*]\s*/, '').replace(/\*\*/g, '');
      
      // Split text for wrapping
      const wrappedLines = breakTextIntoLines(cleanText, FONT_SIZE_BODY, fontRegular, contentWidth - BULLET_TEXT_INDENT);
      
      checkPageBreak(wrappedLines.length * LINE_HEIGHT_BODY + LIST_ITEM_SPACING);

      // Draw Bullet
      page.drawText('•', {
          x: PAGE_MARGIN + BULLET_INDENT,
          y: currentY,
          size: FONT_SIZE_BODY,
          font: fontRegular,
      });

      // Draw Text
      let textY = currentY;
      for (const textLine of wrappedLines) {
         page.drawText(textLine, {
            x: PAGE_MARGIN + BULLET_TEXT_INDENT,
            y: textY,
            size: FONT_SIZE_BODY,
            font: fontRegular,
            color: rgb(0, 0, 0),
         });
         textY -= LINE_HEIGHT_BODY;
      }
      currentY = textY - 2;
      continue;
    }

    // --- PLAIN TEXT / CONTACT INFO ---
    const wrappedLines = breakTextIntoLines(line.replace(/\*\*/g, ''), FONT_SIZE_BODY, fontRegular, contentWidth);
    checkPageBreak(wrappedLines.length * LINE_HEIGHT_BODY);

    for (const textLine of wrappedLines) {
        // Check for "Pipe" separators common in contact info (Email | Phone | Loc)
        // If found near top (i < 10), center it.
        if (textLine.includes('|') && i < 10) {
            const lineWidth = fontRegular.widthOfTextAtSize(textLine, FONT_SIZE_BODY);
             page.drawText(textLine, {
                x: (width - lineWidth) / 2,
                y: currentY,
                size: FONT_SIZE_BODY,
                font: fontRegular,
            });
        } else {
            page.drawText(textLine, {
                x: PAGE_MARGIN,
                y: currentY,
                size: FONT_SIZE_BODY,
                font: fontRegular,
            });
        }
        currentY -= LINE_HEIGHT_BODY;
    }
  }

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, fileName, 'application/pdf');
};

/**
 * Generates a Cover Letter PDF
 * Matches the Resume font (Times Roman) for a professional package.
 */
export const generateCoverLetterPDF = async (markdownContent: string, fileName: string = 'CoverLetter.pdf') => {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
    let currentY = height - PAGE_MARGIN;
    const contentWidth = width - (PAGE_MARGIN * 2);
    
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
             
             currentY -= (fontSize + 10);
             continue;
        }

        // Bullets in Cover Letter (Achievements)
        if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
            const bulletText = cleanLine.replace(/^[-*]\s*/, '').replace(/\*\*/g, '');
            const wrappedLines = breakTextIntoLines(bulletText, FONT_SIZE_BODY, fontRegular, contentWidth - BULLET_TEXT_INDENT);
            
            checkPageBreak(wrappedLines.length * LINE_HEIGHT_BODY + SPACING_AFTER_PARAGRAPH);

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
        const wrappedLines = breakTextIntoLines(cleanLine.replace(/\*\*/g, ''), FONT_SIZE_BODY, fontRegular, contentWidth);
        checkPageBreak(wrappedLines.length * LINE_HEIGHT_BODY + SPACING_AFTER_PARAGRAPH);
        
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
