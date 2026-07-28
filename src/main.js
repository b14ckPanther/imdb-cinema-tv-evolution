/**
 * main.js
 * Entry Point: Initializes Data, State Store, Charts, and Controls
 * Uses Vite asset URL imports (`?url`) for production-compatible static bundling.
 */

import summaryTitlesUrl from './data/summary_titles.json?url';
import genresSummaryUrl from './data/genres_summary.json?url';

import { store } from './state/store.js';
import { TimelineChart } from './charts/timeline.js';
import { BreakdownChart } from './charts/breakdown.js';
import { ScatterplotChart } from './charts/scatterplot.js';
import { FilterPanel } from './ui/filterPanel.js';
import { DetailModal } from './ui/detailModal.js';

async function bootstrap() {
  console.log('🚀 Initializing Stage 5 Production Web Application...');

  try {
    // Fetch Vite-managed static asset URLs
    const [titlesRes, genresRes] = await Promise.all([
      fetch(summaryTitlesUrl),
      fetch(genresSummaryUrl)
    ]);

    if (!titlesRes.ok || !genresRes.ok) {
      throw new Error(`Failed to load data files (HTTP ${titlesRes.status} / ${genresRes.status})`);
    }

    const titlesData = await titlesRes.json();
    const genresData = await genresRes.json();

    console.log(`✅ Loaded ${titlesData.length.toLocaleString()} titles and ${genresData.genre_list.length} genres.`);

    // Initialize State Store
    store.init(titlesData, genresData);

    // Instantiate Chart & UI Modules
    const timelineChart = new TimelineChart('timeline-chart-container');
    const breakdownChart = new BreakdownChart('breakdown-chart-container');
    const scatterplotChart = new ScatterplotChart('scatterplot-container');
    const filterPanel = new FilterPanel();
    const detailModal = new DetailModal();

    // Initialize Controls & Modals
    filterPanel.init();
    detailModal.init();

    // Initial Chart Render
    timelineChart.init();
    breakdownChart.init();
    scatterplotChart.init();

    // Update Top Metrics Row
    const updateMetricsUI = () => {
      const metrics = store.getMetrics();
      const totalEl = document.getElementById('metric-total-titles');
      const ratingEl = document.getElementById('metric-avg-rating');
      const votesEl = document.getElementById('metric-avg-votes');
      const spanEl = document.getElementById('metric-year-span');

      if (totalEl) totalEl.textContent = metrics.total.toLocaleString();
      if (ratingEl) ratingEl.textContent = metrics.avgRating > 0 ? `★ ${metrics.avgRating}` : '--';
      if (votesEl) votesEl.textContent = metrics.avgVotes;
      if (spanEl) spanEl.textContent = metrics.yearSpan;
    };

    updateMetricsUI();

    // Subscribe Charts & Metrics to Central Store Updates for 60 FPS Coordinated Linking
    store.subscribe(() => {
      updateMetricsUI();
      timelineChart.update();
      breakdownChart.update();
      scatterplotChart.update();
    });

    console.log('✨ Web Application initialized successfully!');

  } catch (error) {
    console.error('❌ Error initializing web application:', error);
    const container = document.querySelector('.main-content');
    if (container) {
      container.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 12px; padding: 24px; color: #fecaca;">
          <h2 style="font-family: Outfit; font-size: 20px; font-weight: 700; margin-bottom: 8px;">Failed to Load Dataset</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
