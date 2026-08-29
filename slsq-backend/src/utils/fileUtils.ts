import fs from 'fs';
import path from 'path';

/**
 * Gets the next auto-incremented image filename in a directory.
 * Pattern: img_001.jpg, img_002.jpg, etc.
 */
export function getNextImageFilename(directoryPath: string, extension: string): string {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const files = fs.readdirSync(directoryPath);
  let maxNum = 0;
  const regex = /^img_(\d{3})\./i;

  files.forEach((file) => {
    const match = file.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });

  const nextNum = String(maxNum + 1).padStart(3, '0');
  return `img_${nextNum}${extension}`;
}

/**
 * Formats an event date into YYYYMMDD folder name.
 */
export function formatEventDateFolder(eventDate: Date): string {
  const year = eventDate.getFullYear();
  const month = String(eventDate.getMonth() + 1).padStart(2, '0');
  const day = String(eventDate.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Converts a month number (1-12) to full month name.
 */
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[month - 1] || 'January';
}

/**
 * Formats publication directory name as YYYYMM.
 */
export function formatPublicationFolder(year: number, month: number): string {
  return `${year}${String(month).padStart(2, '0')}`;
}

/**
 * Formats publication filename as "News Letter {MonthName} {YYYY}.pdf".
 */
export function formatPublicationFilename(year: number, month: number): string {
  const monthName = getMonthName(month);
  return `News Letter ${monthName} ${year}.pdf`;
}

/**
 * Safely deletes a file from disk if it exists.
 */
export function deleteFileIfExists(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Recursively deletes a directory and all its contents.
 */
export function deleteFolderRecursive(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}
