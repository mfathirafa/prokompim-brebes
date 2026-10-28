/**
 * Utility untuk mengekspor data tabel ke format CSV dengan UTF-8 BOM.
 * BOM (\uFEFF) memastikan Microsoft Excel membuka file tanpa kendala encoding karakter.
 */
export function exportToCsv(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
  delimiter: "," | ";" = ","
) {
  const sanitizeCell = (cell: string | number | boolean | null | undefined): string => {
    if (cell === null || cell === undefined) return '""'
    const stringVal = String(cell).replace(/"/g, '""')
    return `"${stringVal}"`
  }

  const headerRow = headers.map(sanitizeCell).join(delimiter)
  const bodyRows = rows.map((row) => row.map(sanitizeCell).join(delimiter)).join("\r\n")
  const csvContent = "\uFEFF" + headerRow + "\r\n" + bodyRows

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click();
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
