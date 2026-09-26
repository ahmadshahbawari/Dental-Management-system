import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: format,
  };
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

// Format date with time
export function formatDateTime(date: string | Date, locale: string = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(dateObj);
}

// Calculate days between dates
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Check if date is overdue
export function isOverdue(dueDate: string | Date): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return due < new Date();
}

// Get status color
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    // Blue
    OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
    RECEIVED: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',

    // Amber/Yellow
    IN_INSPECTION: 'bg-amber-100 text-amber-800 border-amber-200',
    IN_PRODUCTION: 'bg-amber-100 text-amber-800 border-amber-200',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',

    // Purple
    IN_QC: 'bg-purple-100 text-purple-800 border-purple-200',

    // Red
    REWORK: 'bg-red-100 text-red-800 border-red-200',
    FAILED: 'bg-red-100 text-red-800 border-red-200',
    NEEDS_CORRECTION: 'bg-red-100 text-red-800 border-red-200',

    // Green
    READY: 'bg-green-100 text-green-800 border-green-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    PASSED: 'bg-green-100 text-green-800 border-green-200',
    DELIVERED: 'bg-green-100 text-green-800 border-green-200',
    PAID: 'bg-green-100 text-green-800 border-green-200',
    CLOSED: 'bg-green-100 text-green-800 border-green-200',

    // Gray
    DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
    CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
    VOID: 'bg-gray-100 text-gray-800 border-gray-200',
    SKIPPED: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

// Get priority color
export function getPriorityColor(priority: string): string {
  const priorityMap: Record<string, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    normal: 'bg-blue-100 text-blue-800 border-blue-200',
    rush: 'bg-red-100 text-red-800 border-red-200',
  };

  return priorityMap[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Generate unique ID
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
