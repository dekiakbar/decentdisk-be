import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  convertToBytes(value: number, unit: string): number {
    const unitLowerCase = unit.toLowerCase();
    switch (unitLowerCase) {
      case 'kb':
        return value * 1024;
      case 'mb':
        return value * 1024 * 1024;
      case 'gb':
        return value * 1024 * 1024 * 1024;
      default:
        throw new Error("Invalid unit. Please use 'KB', 'MB', or 'GB'.");
    }
  }

  convertBytesToAutoUnit(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  }
}
