/**
 * Converts an array of objects to CSV format and triggers a download
 */
export function exportToCsv<T>(
  data: T[],
  filename: string,
  columns: { key: keyof T; header: string; transform?: (value: T[keyof T], item: T) => string }[]
) {
  if (data.length === 0) {
    return;
  }

  // Build header row
  const headers = columns.map((col) => escapeCSVValue(col.header));
  
  // Build data rows
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      const transformed = col.transform ? col.transform(value, item) : String(value ?? "");
      return escapeCSVValue(transformed);
    })
  );

  // Combine into CSV string
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${formatDateForFilename(new Date())}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escapes a value for CSV format
 */
function escapeCSVValue(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Formats a date for use in filenames
 */
function formatDateForFilename(date: Date): string {
  return date.toISOString().split("T")[0];
}
