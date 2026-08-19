/**
 * main.js
 * Entry Point: Initializes Data, State Store, Charts, Theme Engine, and Visual Export Tools.
 */

import summaryTitlesUrl from './data/summary_titles.json?url';
import genresSummaryUrl from './data/genres_summary.json?url';

import { store } from './state/store.js';
import { TimelineChart } from './charts/timeline.js';
import { BreakdownChart } from './charts/breakdown.js';
import { ScatterplotChart } from './charts/scatterplot.js';
import { FilterPanel } from './ui/filterPanel.js';
import { DetailModal } from './ui/detailModal.js';
import { exportSvgToPng } from './utils/exportChart.js';

// Clean Lucide SVG Icons
const SUN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
const MOON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

async function bootstrap() {
  console.log('Initializing IMDb Cinema & TV Evolution App...');

  try {
    // 1. Theme Engine Setup
    const savedTheme = localStorage.getItem('imdb_app_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');

    const updateThemeIcon = (theme) => {
      if (themeIcon) {
        themeIcon.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
      }
    };
    updateThemeIcon(savedTheme);

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

    // Theme Toggle Handler
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('imdb_app_theme', newTheme);
        updateThemeIcon(newTheme);

        // Re-render charts with new theme colors
        timelineChart.update();
        breakdownChart.update();
        scatterplotChart.update();
      });
    }

    // Chart Export / Screenshot Handlers for Assignment Report
    const exportTimelineBtn = document.getElementById('export-timeline-btn');
    const exportBreakdownBtn = document.getElementById('export-breakdown-btn');
    const exportScatterplotBtn = document.getElementById('export-scatterplot-btn');
    const exportReportBtn = document.getElementById('export-report-btn');

    if (exportTimelineBtn) {
      exportTimelineBtn.addEventListener('click', () => {
        exportSvgToPng('timeline-chart-container', 'imdb_temporal_timeline.png', 'IMDb Temporal Cinema Timeline (1920–2025)');
      });
    }

    if (exportBreakdownBtn) {
      exportBreakdownBtn.addEventListener('click', () => {
        exportSvgToPng('breakdown-chart-container', 'imdb_genre_distribution.png', 'IMDb Top Genre Distribution');
      });
    }

    if (exportScatterplotBtn) {
      exportScatterplotBtn.addEventListener('click', () => {
        exportSvgToPng('scatterplot-container', 'imdb_rating_popularity_scatterplot.png', 'IMDb Multivariate Rating & Popularity Distribution');
      });
    }

    if (exportReportBtn) {
      exportReportBtn.addEventListener('click', () => {
        exportSvgToPng('timeline-chart-container', '1_imdb_timeline_report.png', 'Figure 1: Temporal Cinema Timeline (1920–2025)');
        setTimeout(() => {
          exportSvgToPng('breakdown-chart-container', '2_imdb_genres_report.png', 'Figure 2: Top Genre Distribution');
        }, 400);
        setTimeout(() => {
          exportSvgToPng('scatterplot-container', '3_imdb_scatterplot_report.png', 'Figure 3: Rating vs Popularity & Runtime Scatterplot');
        }, 800);
      });
    }

    // Update Top Metrics Row
    const updateMetricsUI = () => {
      const metrics = store.getMetrics();
      const totalEl = document.getElementById('metric-total-titles');
      const ratingEl = document.getElementById('metric-avg-rating');
      const votesEl = document.getElementById('metric-avg-votes');
      const spanEl = document.getElementById('metric-year-span');

      if (totalEl) totalEl.textContent = metrics.total.toLocaleString();
      if (ratingEl) ratingEl.textContent = metrics.avgRating > 0 ? `${metrics.avgRating} / 10` : '--';
      if (votesEl) votesEl.textContent = metrics.avgVotes;
      if (spanEl) spanEl.textContent = metrics.yearSpan;
    };

    updateMetricsUI();

    // Subscribe Charts & Metrics to Central Store Updates
    store.subscribe(() => {
      updateMetricsUI();
      timelineChart.update();
      breakdownChart.update();
      scatterplotChart.update();
    });

  } catch (error) {
    console.error('Error initializing web application:', error);
    const container = document.querySelector('.main-content');
    if (container) {
      container.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid #ef4444; border-radius: 12px; padding: 24px; color: #b91c1c;">
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
