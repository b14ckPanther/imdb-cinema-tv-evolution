/**
 * exportChart.js
 * Utility to export any D3 SVG chart or dashboard section as high-resolution PNG for assignment reports.
 */

export function exportSvgToPng(containerOrSvgId, filename = 'chart_visual.png', title = '') {
  try {
    let container = typeof containerOrSvgId === 'string' 
      ? document.getElementById(containerOrSvgId) 
      : containerOrSvgId;

    if (!container) {
      console.warn('Export target not found:', containerOrSvgId);
      return;
    }

    const svgEl = container.tagName?.toLowerCase() === 'svg' 
      ? container 
      : container.querySelector('svg');

    if (!svgEl) {
      alert('No chart visual found to export.');
      return;
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? '#111827' : '#ffffff';
    const textColor = isDark ? '#f9fafb' : '#0f172a';
    const subtextColor = isDark ? '#9ca3af' : '#64748b';

    const rect = svgEl.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 400;

    // Clone SVG to avoid altering live DOM
    const clonedSvg = svgEl.cloneNode(true);
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('width', width);
    clonedSvg.setAttribute('height', height);

    // Embed fonts styling into SVG
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      text { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
    `;
    clonedSvg.prepend(styleEl);

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    const scale = 2; // 2x High-DPI Retina resolution for reports

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const headerPadding = title ? 40 : 10;
      canvas.width = (width + 20) * scale;
      canvas.height = (height + headerPadding + 10) * scale;

      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width + 20, height + headerPadding + 10);

      // Optional Title in Export
      if (title) {
        ctx.fillStyle = textColor;
        ctx.font = 'bold 14px Outfit, Inter, sans-serif';
        ctx.fillText(title, 14, 22);

        ctx.fillStyle = subtextColor;
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`IMDb Cinema & TV Evolution Explorer • Exported ${new Date().toLocaleDateString()}`, 14, 34);
      }

      // Draw SVG chart
      ctx.drawImage(img, 10, headerPadding, width, height);

      // Create download link
      canvas.toBlob((pngBlob) => {
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement('a');
        a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
        a.href = pngUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(blobUrl);
      }, 'image/png');
    };

    img.onerror = () => {
      console.error('Failed to render SVG image on canvas for export.');
      URL.revokeObjectURL(blobUrl);
    };

    img.src = blobUrl;

  } catch (err) {
    console.error('Chart export error:', err);
  }
}
