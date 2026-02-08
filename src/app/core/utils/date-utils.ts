/**
 * Date utility functions
 */

/**
 * Formats a date string to YYYY-MM-DD format (API format)
 */
export function formatDateToApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Parses a date string (YYYY-MM-DD) to Date object
 */
export function parseApiDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Adds one year to a given date
 */
export function addOneYear(date: Date): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + 1);
    return result;
}

/**
 * Checks if a date is today or in the future
 */
export function isDateTodayOrFuture(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate >= today;
}

/**
 * Gets today's date formatted for API
 */
export function getTodayForApi(): string {
    return formatDateToApi(new Date());
}

/**
 * Gets today's date formatted for HTML date input (YYYY-MM-DD)
 */
export function getTodayForInput(): string {
    return formatDateToApi(new Date());
}

/**
 * Calculates revision date (release date + 1 year) formatted for API
 */
export function calculateRevisionDate(releaseDate: string): string {
    const release = parseApiDate(releaseDate);
    const revision = addOneYear(release);
    return formatDateToApi(revision);
}
