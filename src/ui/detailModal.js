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
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="badge badge-primary">${formatName}</span>
          <span class="badge" style="color: #f59e0b; border-color: rgba(245,158,11,0.3); background: rgba(245,158,11,0.1);">
            ★ ${titleObj.r.toFixed(1)} / 10
          </span>
          <span class="badge" style="color: #10b981; border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.1);">
            ${titleObj.v.toLocaleString()} Votes
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 130px 1fr; gap: 10px 16px; background: rgba(255,255,255,0.02); padding: 16px; border-radius: 8px; border: 1px solid var(--border-subtle);">
          <span style="color: var(--text-muted); font-size: 13px;">IMDb Identifier:</span>
          <span style="font-weight: 600; font-family: monospace;">${titleObj.i}</span>

          <span style="color: var(--text-muted); font-size: 13px;">Release Year:</span>
          <span style="font-weight: 600;">${titleObj.y}</span>

          <span style="color: var(--text-muted); font-size: 13px;">${runtimeLabel}</span>
          <span style="font-weight: 600;">${runtimeStr} ${!isMovie && titleObj.m ? '(IMDb title record)' : ''}</span>

          <span style="color: var(--text-muted); font-size: 13px;">Primary Genres:</span>
          <span style="font-weight: 600;">${genreNames}</span>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
          <a href="${imdbUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="text-decoration: none;" aria-label="Open ${titleObj.t} on IMDb in a new tab">
            View on IMDb ↗
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
