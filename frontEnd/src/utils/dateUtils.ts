export interface DateRange {
  startDate: Date;
  endDate: Date;
}
export function formatDateRange(startDate: Date, endDate: Date): string {
  const monthNames = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];

  const startMonth = monthNames[startDate.getMonth()];
  const endMonth = monthNames[endDate.getMonth()];
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  if (startYear === endYear) {
    // Same year: "ABRIL - JULIO 2023"
    return `${startMonth} - ${endMonth} ${endYear}`;
  } else {
    // Different years: "SEPTIEMBRE 2022 / ENERO 2023"
    return `${startMonth} ${startYear} / ${endMonth} ${endYear}`;
  }
}

/**
 * Formats a date range for report titles with "ESTADÍSTICAS CCJ" prefix
 */
export function formatReportTitle(startDate: Date, endDate: Date): string {
  const dateRange = formatDateRange(startDate, endDate);
  return `ESTADÍSTICAS CCJ ${dateRange}`;
}

/**
 * Parses a date string in various formats
 */
export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return date;
}

/**
 * Validates that start date is before or equal to end date
 */
export function validateDateRange(startDate: Date, endDate: Date): boolean {
  return startDate <= endDate;
}
