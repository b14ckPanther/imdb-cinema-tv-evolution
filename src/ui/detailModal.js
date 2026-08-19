/**
 * detailModal.js
 * Interactive Overlay Modal for Details-on-Demand
 */

import { store } from '../state/store.js';

export class DetailModal {
  constructor() {
    this.overlay = document.getElementById('detail-modal');
    this.titleText = document.getElementById('modal-title-text');
    this.bodyContent = document.getElementById('modal-body-content');
    this.closeBtn = document.getElementById('modal-close-btn');
  }

  init() {
    if (!this.overlay) return;

    this.closeBtn.addEventListener('click', () => this.hide());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.hide();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.hide();
      }
    });

    store.subscribeModal((titleObj) => {
      if (titleObj) {
        this.show(titleObj);
      }
    });
  }

  show(titleObj) {
    if (!this.overlay) return;

    const isMovie = titleObj.k === 0;
    const formatName = isMovie ? 'Feature Movie' : 'TV Series';
    const genreNames = (titleObj.g || []).map(idx => store.genreMap[idx] || '').filter(Boolean).join(', ') || 'N/A';
    const runtimeLabel = isMovie ? 'Film Runtime:' : 'Episode Duration:';
    const runtimeStr = titleObj.m ? `${titleObj.m} minutes` : 'Unknown';
    const imdbUrl = `https://www.imdb.com/title/${titleObj.i}/`;

    this.titleText.textContent = `${titleObj.t} (${titleObj.y})`;

    this.bodyContent.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span class="badge badge-primary">${formatName}</span>
          <span class="badge" style="color: #d97706; border-color: rgba(217, 119, 6, 0.3); background: rgba(217, 119, 6, 0.08); font-weight: 700;">
            ${titleObj.r.toFixed(1)} / 10
          </span>
          <span class="badge" style="color: #059669; border-color: rgba(5, 150, 105, 0.3); background: rgba(5, 150, 105, 0.08);">
            ${titleObj.v.toLocaleString()} Votes
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 130px 1fr; gap: 10px 16px; background: rgba(125, 125, 125, 0.04); padding: 16px; border-radius: 8px; border: 1px solid var(--border-subtle);">
          <span style="color: var(--text-dim); font-size: 13px;">IMDb Identifier:</span>
          <span style="font-weight: 600; font-family: monospace;">${titleObj.i}</span>

          <span style="color: var(--text-dim); font-size: 13px;">Release Year:</span>
          <span style="font-weight: 600;">${titleObj.y}</span>

          <span style="color: var(--text-dim); font-size: 13px;">${runtimeLabel}</span>
          <span style="font-weight: 600;">${runtimeStr} ${!isMovie && titleObj.m ? '(IMDb title record)' : ''}</span>

          <span style="color: var(--text-dim); font-size: 13px;">Primary Genres:</span>
          <span style="font-weight: 600;">${genreNames}</span>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
          <a href="${imdbUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="text-decoration: none; gap: 6px;" aria-label="Open ${titleObj.t} on IMDb in a new tab">
            <span>View on IMDb</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
    `;

    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');
  }

  hide() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
      this.overlay.setAttribute('aria-hidden', 'true');
    }
  }
}
