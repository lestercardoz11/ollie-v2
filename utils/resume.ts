import {
  Achievement,
  Education,
  TailoredCV,
  UserProfile,
  WorkExperience,
} from '@/types/db';
import download from 'downloadjs';
import {
  PDFDocument,
  PDFPage,
  PDFFont,
  rgb,
  RGB,
  StandardFonts,
} from 'pdf-lib';
import { convertToBulletPoints } from './string';

interface PageContext {
  page: PDFPage;
  yPosition: number;
}

interface Fonts {
  helvetica: PDFFont;
  helveticaBold: PDFFont;
}

interface DrawConfig {
  width: number;
  height: number;
  margin: number;
  lineHeight: number;
  primaryColor: RGB;
  textColor: RGB;
}

export async function generateResumePDF(
  profile: UserProfile,
  tailored_cv: TailoredCV
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const currentPage = pdfDoc.addPage([595.28, 841.89]); // A4 size

  const fonts: Fonts = {
    helvetica: await pdfDoc.embedFont(StandardFonts.Helvetica),
    helveticaBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
  };

  const { width, height } = currentPage.getSize();
  const config: DrawConfig = {
    width,
    height,
    margin: 50,
    lineHeight: 14,
    primaryColor: rgb(0.16, 0.35, 0.61),
    textColor: rgb(0, 0, 0),
  };

  const context: PageContext = {
    page: currentPage,
    yPosition: height - 60,
  };

  // Helper function to check and create new page if needed
  const ensureSpace = (requiredSpace: number): void => {
    if (context.yPosition < requiredSpace) {
      context.page = pdfDoc.addPage([595.28, 841.89]);
      context.yPosition = config.height - 60;
    }
  };

  // Helper function to wrap text
  const wrapText = (
    text: string,
    maxWidth: number,
    font: PDFFont,
    fontSize: number
  ): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Helper to draw text with automatic positioning
  const drawText = (
    text: string,
    size: number,
    font: PDFFont,
    color: RGB = config.textColor,
    xOffset: number = 0
  ): void => {
    context.page.drawText(text, {
      x: config.margin + xOffset,
      y: context.yPosition,
      size,
      font,
      color,
    });
  };

  // Helper to draw wrapped text lines
  const drawWrappedText = (
    text: string,
    size: number,
    font: PDFFont,
    xOffset: number = 0
  ): void => {
    const lines = wrapText(
      text,
      config.width - 2 * config.margin - xOffset,
      font,
      size
    );

    lines.forEach((line) => {
      ensureSpace(50);
      drawText(line, size, font, config.textColor, xOffset);
      context.yPosition -= config.lineHeight;
    });
  };

  // Helper function to draw blue line
  const drawBlueLine = (y: number): void => {
    context.page.drawLine({
      start: { x: config.margin, y },
      end: { x: config.width - config.margin, y },
      thickness: 3,
      color: config.primaryColor,
    });
  };

  // Draw blue line at top
  drawBlueLine(context.yPosition + 10);
  context.yPosition -= 24;

  // Name
  drawText(profile.full_name, 32, fonts.helveticaBold);
  context.yPosition -= 20;

  // Job Title
  if (tailored_cv.experience && tailored_cv.experience.length > 0) {
    const jobTitle = tailored_cv.experience[0]?.role || '';
    drawText(jobTitle, 18, fonts.helvetica, config.primaryColor);
    context.yPosition -= 20;
  }

  // Contact Information
  const contactInfo = [
    profile.phone,
    profile.email,
    profile.portfolio,
    profile.linkedin,
  ].filter((item): item is string => Boolean(item));

  contactInfo.forEach((line) => {
    drawText(line, 10, fonts.helvetica);
    context.yPosition -= config.lineHeight;
  });

  context.yPosition -= 20;

  // Professional Summary
  drawText(
    'PROFESSIONAL SUMMARY',
    14,
    fonts.helveticaBold,
    config.primaryColor
  );
  context.yPosition -= 20;
  drawWrappedText(tailored_cv.summary || '', 10, fonts.helvetica);
  context.yPosition -= 15;

  // Technical Skills
  drawText('SKILLS', 14, fonts.helveticaBold, config.primaryColor);
  context.yPosition -= 20;

  // Technical skills
  if (tailored_cv.skills && tailored_cv.skills.length > 0) {
    if (tailored_cv.skills && tailored_cv.skills.length > 0) {
      const skillsByCategory = tailored_cv.skills.reduce((acc, skill) => {
        const cat = skill.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill.name);
        return acc;
      }, {} as Record<string, string[]>);

      Object.entries(skillsByCategory).forEach(([category, skills]) => {
        const categoryText = `${category}:`;
        drawWrappedText(categoryText, 10, fonts.helveticaBold);
        const techText = ` ${skills.join(', ')}`;
        drawWrappedText(techText, 10, fonts.helvetica);
        context.yPosition -= 5;
      });
    }
  }

  context.yPosition -= 15;

  if (tailored_cv.experience && tailored_cv.experience.length > 0) {
    // Professional Experience
    drawText(
      'PROFESSIONAL EXPERIENCE',
      14,
      fonts.helveticaBold,
      config.primaryColor
    );
    context.yPosition -= 20;
    tailored_cv.experience.forEach((exp: WorkExperience) => {
      ensureSpace(100);

      // Company name and dates
      const dateRange = `(${exp.startDate} - ${exp.endDate})`;
      drawText(
        `${exp.company}, ${profile.location} ${dateRange}`,
        11,
        fonts.helveticaBold
      );
      context.yPosition -= 18;

      // Role
      drawText(exp.role.toUpperCase(), 10, fonts.helvetica);
      context.yPosition -= 16;

      // Description - split by bullet points or newlines
      const descriptionPoints = (
        convertToBulletPoints(exp.description) as string
      )
        .split('\n')
        .filter((d) => d.trim());
      descriptionPoints.forEach((point: string) => {
        const cleanPoint = point.replace(/^[•-]\s*/, '').trim();
        if (cleanPoint) {
          const bulletLines = wrapText(
            cleanPoint,
            config.width - 2 * config.margin - 20,
            fonts.helvetica,
            10
          );

          bulletLines.forEach((line, idx) => {
            ensureSpace(50);

            if (idx === 0) {
              context.page.drawText('•', {
                x: config.margin + 10,
                y: context.yPosition,
                size: 8,
                font: fonts.helvetica,
                color: config.textColor,
              });
            }

            context.page.drawText(line, {
              x: config.margin + 25,
              y: context.yPosition,
              size: 10,
              font: fonts.helvetica,
              color: config.textColor,
            });
            context.yPosition -= config.lineHeight;
          });
        }
      });

      context.yPosition -= 10;
    });
    context.yPosition -= 15;
  }

  // Education
  if (tailored_cv.education && tailored_cv.education.length > 0) {
    ensureSpace(150);

    drawText('EDUCATION', 14, fonts.helveticaBold, config.primaryColor);
    context.yPosition -= 20;

    tailored_cv.education.forEach((edu: Education) => {
      drawText(`${edu.school} (${edu.year})`, 11, fonts.helveticaBold);
      context.yPosition -= 16;

      drawText(`- ${edu.degree}`, 10, fonts.helvetica, config.textColor, 10);
      context.yPosition -= 20;
    });
    context.yPosition -= 15;
  }

  // Certifications/Achievements
  if (tailored_cv.achievements && tailored_cv.achievements.length > 0) {
    ensureSpace(100);

    drawText(
      'CERTIFICATIONS / ACHIEVEMENTS',
      14,
      fonts.helveticaBold,
      config.primaryColor
    );
    context.yPosition -= 20;

    tailored_cv.achievements.forEach((achievement: Achievement) => {
      drawText(
        `•  ${achievement.title}`,
        10,
        fonts.helvetica,
        config.textColor
      );
      context.yPosition -= config.lineHeight;
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function downloadResume(
  profile: UserProfile,
  tailored_cv: TailoredCV,
  fileName: string = 'resume.pdf'
) {
  const pdfBytes = await generateResumePDF(profile, tailored_cv);
  download(pdfBytes, fileName, 'application/pdf');
}
