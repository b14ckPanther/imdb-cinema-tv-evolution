/**
 * store.js
 * Centralized Event-Driven State Store & Pub/Sub Bus
 * Extended for Stage 4 implementation alignment (Q1-Q5 research question coverage).
 */

class StateStore {
  constructor() {
    this.allTitles = [];
    this.genresList = [];
    this.decadesSummary = [];
    this.genreMap = {};
    this.filteredTitles = [];
    this.listeners = [];

    this.filters = {
      format: 'all',            // 'all', 'movie', 'tvSeries', 'compare'
      timelineMetric: 'volume', // 'volume', 'rating', 'runtime'
      genreEra: 'all',          // 'all', 'classical' (1920-1970), 'modern' (1971-2025)
      showDistinctShapes: true,
      showCorrelationGuide: false,
      yearMin: 1920,
      yearMax: 2025,
      minVotes: 1000,
      selectedGenre: 'all',     // 'all' or genre name
      searchQuery: '',
      brushedYears: null        // [minYear, maxYear] from D3 brush
    };

    this.selectedTitle = null; // For detail modal
  }

  init(titlesData, genresData) {
    this.allTitles = titlesData;
    this.genresList = genresData.genre_list || [];
    this.decadesSummary = genresData.decades || [];
    
    this.genreMap = {};
    this.genresList.forEach((gName, idx) => {
      this.genreMap[idx] = gName;
    });

    this.applyFilters();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.filteredTitles, this.filters));
  }

  setFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
    this.applyFilters();
    this.notify();
  }

  resetFilters() {
    this.filters = {
      format: 'all',
      timelineMetric: 'volume',
      genreEra: 'all',
      showDistinctShapes: true,
      showCorrelationGuide: false,
      yearMin: 1920,
      yearMax: 2025,
      minVotes: 1000,
      selectedGenre: 'all',
      searchQuery: '',
      brushedYears: null
    };
    this.applyFilters();
    this.notify();
  }

  setSelectedTitle(titleObj) {
    this.selectedTitle = titleObj;
    this.notifyModal();
  }

  subscribeModal(listener) {
    this.modalListener = listener;
  }

  notifyModal() {
    if (this.modalListener) {
      this.modalListener(this.selectedTitle);
    }
  }

  applyFilters() {
    const { format, genreEra, yearMin, yearMax, minVotes, selectedGenre, searchQuery, brushedYears } = this.filters;
    const query = searchQuery.trim().toLowerCase();

    const activeMinYear = brushedYears ? brushedYears[0] : yearMin;
    const activeMaxYear = brushedYears ? brushedYears[1] : yearMax;

    this.filteredTitles = this.allTitles.filter(rec => {
      // Format Filter (0: movie, 1: tvSeries)
      if (format === 'movie' && rec.k !== 0) return false;
      if (format === 'tvSeries' && rec.k !== 1) return false;

      // Era Filter
      if (genreEra === 'classical' && (rec.y < 1920 || rec.y > 1970)) return false;
      if (genreEra === 'modern' && rec.y < 1971) return false;

      // Year Range Filter
      if (rec.y < activeMinYear || rec.y > activeMaxYear) return false;

      // Min Votes Filter
      if (rec.v < minVotes) return false;

      // Search Query
      if (query && !rec.t.toLowerCase().includes(query)) return false;

      // Genre Filter
      if (selectedGenre !== 'all') {
        const genreNames = rec.g.map(idx => this.genreMap[idx]);
        if (!genreNames.includes(selectedGenre)) return false;
      }

      return true;
    });
  }

  getMetrics() {
    const total = this.filteredTitles.length;
    if (total === 0) {
      return { total: 0, avgRating: 0, avgVotes: 0, yearSpan: 'N/A' };
    }

    let ratingSum = 0;
    let votesSum = 0;
    let minY = 9999;
    let maxY = 0;

    for (let i = 0; i < total; i++) {
      const rec = this.filteredTitles[i];
      ratingSum += rec.r;
      votesSum += rec.v;
      if (rec.y < minY) minY = rec.y;
      if (rec.y > maxY) maxY = rec.y;
    }

    return {
      total,
      avgRating: (ratingSum / total).toFixed(2),
      avgVotes: Math.round(votesSum / total).toLocaleString(),
      yearSpan: minY === 9999 ? 'N/A' : `${minY} — ${maxY}`
    };
  }
}

export const store = new StateStore();
