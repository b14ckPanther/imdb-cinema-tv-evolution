/**
 * filterPanel.js
 * Controls & Sidebar Form Event Handlers
 * Updated for Stage 5: Dynamic ARIA attributes & keyboard accessibility state synchronization.
 */

import { store } from '../state/store.js';

export class FilterPanel {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.formatSelect = document.getElementById('format-select');
    this.yearMinSlider = document.getElementById('year-min-slider');
    this.yearMaxSlider = document.getElementById('year-max-slider');
    this.yearLabel = document.getElementById('year-val-label');
    this.votesSlider = document.getElementById('votes-slider');
    this.votesLabel = document.getElementById('votes-val-label');
    this.genreSelect = document.getElementById('genre-select');
    this.eraSelect = document.getElementById('era-select');
    this.resetBtn = document.getElementById('reset-btn');
    this.toggleShapesBtn = document.getElementById('toggle-shapes-btn');
    this.toggleGuidesBtn = document.getElementById('toggle-guides-btn');
  }

  init() {
    if (!this.formatSelect) return;

    this.populateGenres();

    // Header Format Mode Switcher Tabs with ARIA State Updates
    const tabs = document.querySelectorAll('.mode-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const fmt = e.target.getAttribute('data-format');
        store.setFilters({ format: fmt });
      });
    });

    // Timeline Metric Buttons with ARIA State Updates
    const metricBtns = document.querySelectorAll('[data-metric]');
    metricBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const m = e.target.getAttribute('data-metric');
        store.setFilters({ timelineMetric: m });
      });
    });

    // Sidebar Controls
    this.searchInput.addEventListener('input', (e) => {
      store.setFilters({ searchQuery: e.target.value });
    });

    this.formatSelect.addEventListener('change', (e) => {
      const fmt = e.target.value;
      store.setFilters({ format: fmt });
    });

    const updateYears = () => {
      let minVal = parseInt(this.yearMinSlider.value);
      let maxVal = parseInt(this.yearMaxSlider.value);
      if (minVal > maxVal) {
        const tmp = minVal;
        minVal = maxVal;
        maxVal = tmp;
      }
      this.yearLabel.textContent = `${minVal} — ${maxVal}`;
      store.setFilters({ yearMin: minVal, yearMax: maxVal });
    };

    this.yearMinSlider.addEventListener('input', updateYears);
    this.yearMaxSlider.addEventListener('input', updateYears);

    this.votesSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      this.votesLabel.textContent = `${val.toLocaleString()}+ votes`;
      store.setFilters({ minVotes: val });
    });

    this.genreSelect.addEventListener('change', (e) => {
      store.setFilters({ selectedGenre: e.target.value });
    });

    if (this.eraSelect) {
      this.eraSelect.addEventListener('change', (e) => {
        store.setFilters({ genreEra: e.target.value });
      });
    }

    if (this.toggleShapesBtn) {
      this.toggleShapesBtn.addEventListener('click', () => {
        const nextState = !store.filters.showDistinctShapes;
        store.setFilters({ showDistinctShapes: nextState });
      });
    }

    if (this.toggleGuidesBtn) {
      this.toggleGuidesBtn.addEventListener('click', () => {
        const nextState = !store.filters.showCorrelationGuide;
        store.setFilters({ showCorrelationGuide: nextState });
      });
    }

    this.resetBtn.addEventListener('click', () => {
      this.resetUI();
      store.resetFilters();
    });

    store.subscribe((filteredTitles, filters) => {
      this.syncUI(filters);
    });
  }

  populateGenres() {
    if (!this.genreSelect || store.genresList.length === 0) return;
    store.genresList.forEach(gName => {
      const opt = document.createElement('option');
      opt.value = gName;
      opt.textContent = gName;
      this.genreSelect.appendChild(opt);
    });
  }

  syncUI(filters) {
    if (filters.searchQuery !== undefined && this.searchInput.value !== filters.searchQuery) {
      this.searchInput.value = filters.searchQuery;
    }
    if (filters.format !== undefined) {
      this.formatSelect.value = filters.format;
      document.querySelectorAll('.mode-tab').forEach(t => {
        const isActive = t.getAttribute('data-format') === filters.format;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }
    if (filters.timelineMetric !== undefined) {
      document.querySelectorAll('[data-metric]').forEach(b => {
        const isActive = b.getAttribute('data-metric') === filters.timelineMetric;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }
    if (filters.selectedGenre !== undefined) {
      this.genreSelect.value = filters.selectedGenre;
    }
    if (filters.genreEra !== undefined && this.eraSelect) {
      this.eraSelect.value = filters.genreEra;
    }
    if (filters.minVotes !== undefined) {
      this.votesSlider.value = filters.minVotes;
      this.votesLabel.textContent = `${filters.minVotes.toLocaleString()}+ votes`;
    }
    if (this.toggleShapesBtn) {
      const isActive = filters.showDistinctShapes;
      this.toggleShapesBtn.classList.toggle('active', isActive);
      this.toggleShapesBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
    if (this.toggleGuidesBtn) {
      const isActive = filters.showCorrelationGuide;
      this.toggleGuidesBtn.classList.toggle('active', isActive);
      this.toggleGuidesBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
    if (filters.brushedYears) {
      const [minY, maxY] = filters.brushedYears;
      this.yearMinSlider.value = minY;
      this.yearMaxSlider.value = maxY;
      this.yearLabel.textContent = `${minY} — ${maxY}`;
    } else {
      this.yearMinSlider.value = filters.yearMin;
      this.yearMaxSlider.value = filters.yearMax;
      this.yearLabel.textContent = `${filters.yearMin} — ${filters.yearMax}`;
    }
  }

  resetUI() {
    this.searchInput.value = '';
    this.formatSelect.value = 'all';
    this.yearMinSlider.value = 1920;
    this.yearMaxSlider.value = 2025;
    this.yearLabel.textContent = '1920 — 2025';
    this.votesSlider.value = 1000;
    this.votesLabel.textContent = '1,000+ votes';
    this.genreSelect.value = 'all';
    if (this.eraSelect) this.eraSelect.value = 'all';
  }
}
