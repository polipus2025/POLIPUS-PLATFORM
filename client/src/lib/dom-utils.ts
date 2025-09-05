/**
 * Safe DOM utilities to prevent removeChild errors
 */

/**
 * Safely remove a DOM element without throwing removeChild errors
 * @param node - Element to remove
 */
export function safeDetach(node?: Element | null): void {
  try {
    if (node?.isConnected) {
      node.remove();
    }
  } catch (e) {
    // Ignore removal errors - element already detached
  }
}

/**
 * Safe blob download utility that prevents DOM manipulation errors
 * @param blob - Blob to download
 * @param filename - Filename for download
 */
export function downloadBlob(blob: Blob, filename: string): void {
  let anchor: HTMLAnchorElement | null = null;
  let url: string | null = null;
  
  try {
    url = window.URL.createObjectURL(blob);
    anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
  } catch (error) {
    console.error('Download failed:', error);
  } finally {
    // Safe cleanup
    if (url) {
      try {
        window.URL.revokeObjectURL(url);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    safeDetach(anchor);
  }
}