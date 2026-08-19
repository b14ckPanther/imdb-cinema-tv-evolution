/**
 * tooltip.js
 * Shared D3 Tooltip Component
 * Clarifies runtime metric semantics (episode duration for TV Series vs film duration for Movies).
 */

export class D3Tooltip {
  constructor(elementId) {
    this.el = document.getElementById(elementId);
  }

  show(event, titleObj, genreMap) {
    if (!this.el) return;

    const isMovie = titleObj.k === 0;
    const formatName = isMovie ? 'Feature Movie' : 'TV Series';
    const genreNames = (titleObj.g || []).map(idx => genreMap[idx] || '').filter(Boolean).join(', ') || 'N/A';
    
    // Explicitly distinguish film runtime from TV episode duration
    const runtimeLabel = isMovie ? 'Film Runtime:' : 'Episode Duration:';
    const runtimeStr = titleObj.m ? `${titleObj.m} mins` : 'N/A';

    this.el.innerHTML = `
      <div class="tooltip-title">${titleObj.t} (${titleObj.y})</div>
      <div class="tooltip-meta">
        <span class="tooltip-key">Format:</span>
        <span class="tooltip-val">${formatName}</span>
        <span class="tooltip-key">Rating:</span>
        <span class="tooltip-val" style="color: var(--accent-warning); font-weight: 700;">${titleObj.r.toFixed(1)} / 10</span>
        <span class="tooltip-key">Votes:</span>
        <span class="tooltip-val">${titleObj.v.toLocaleString()}</span>
        <span class="tooltip-key">${runtimeLabel}</span>
        <span class="tooltip-val">${runtimeStr}</span>
        <span class="tooltip-key">Genres:</span>
        <span class="tooltip-val">${genreNames}</span>
      </div>
    `;

    this.el.classList.add('visible');
    this.el.setAttribute('aria-hidden', 'false');
    this.move(event);
  }

  move(event) {
    if (!this.el) return;

    const offsetX = 16;
    const offsetY = 16;
    let left = event.pageX + offsetX;
    let top = event.pageY + offsetY;

    const tooltipWidth = this.el.offsetWidth || 260;
    if (left + tooltipWidth > window.innerWidth - 20) {
      left = event.pageX - tooltipWidth - offsetX;
    }

    this.el.style.left = `${left}px`;
    this.el.style.top = `${top}px`;
  }

  hide() {
    if (this.el) {
      this.el.classList.remove('visible');
      this.el.setAttribute('aria-hidden', 'true');
    }
  }
}
