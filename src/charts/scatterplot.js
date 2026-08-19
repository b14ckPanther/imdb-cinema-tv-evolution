/**
 * scatterplot.js
 * Main D3 Rating vs Popularity & Runtime Scatterplot Chart
 * Enhanced with Dynamic Light/Dark Theme adaptation, crisp typography, and interactive legend.
 */

import * as d3 from 'd3';
import { store } from '../state/store.js';
import { D3Tooltip } from './tooltip.js';

export class ScatterplotChart {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.margin = { top: 20, right: 30, bottom: 45, left: 60 };
    this.tooltip = new D3Tooltip('d3-tooltip');
    this.noticeEl = document.getElementById('scatterplot-sampling-notice');
    this.legendContainer = document.getElementById('genre-legend-bar');
  }

  init() {
    if (!this.container) return;
    this.renderLegend();
    this.update();

    window.addEventListener('resize', () => {
      this.update();
    });
  }

  renderLegend() {
    if (!this.legendContainer || store.genresList.length === 0) return;
    this.legendContainer.innerHTML = '<span class="legend-title">Genre Filter:</span>';

    const colorScale = d3.scaleOrdinal()
      .domain(store.genresList)
      .range(d3.schemeTableau10);

    const topGenres = store.genresList.slice(0, 8); // Top prominent genres in legend

    // 'All' pill
    const allPill = document.createElement('span');
    allPill.className = `genre-legend-item ${store.filters.selectedGenre === 'all' ? 'active' : ''}`;
    allPill.textContent = 'All Genres';
    allPill.addEventListener('click', () => {
      store.setFilters({ selectedGenre: 'all' });
    });
    this.legendContainer.appendChild(allPill);

    topGenres.forEach(gName => {
      const item = document.createElement('span');
      const isSelected = store.filters.selectedGenre === gName;
      item.className = `genre-legend-item ${isSelected ? 'active' : ''}`;
      
      const dot = document.createElement('span');
      dot.className = 'legend-dot';
      dot.style.backgroundColor = colorScale(gName);

      item.appendChild(dot);
      item.appendChild(document.createTextNode(gName));

      item.addEventListener('click', () => {
        const next = store.filters.selectedGenre === gName ? 'all' : gName;
        store.setFilters({ selectedGenre: next });
      });

      this.legendContainer.appendChild(item);
    });
  }

  update() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const axisTextColor = isDark ? '#9ca3af' : '#475569';
    const axisLineColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#cbd5e1';
    const gridLineColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
    const benchmarkColor = isDark ? '#f59e0b' : '#d97706';

    this.renderLegend();

    const rect = this.container.getBoundingClientRect();
    const width = rect.width - this.margin.left - this.margin.right;
    const height = rect.height - this.margin.top - this.margin.bottom;

    if (width <= 0 || height <= 0) return;

    const allFiltered = store.filteredTitles;
    let data = allFiltered;
    let isSampled = false;

    if (data.length > 4000) {
      isSampled = true;
      const topVoted = data.slice(0, 2000);
      const remaining = data.slice(2000);
      const sampledRemaining = d3.shuffle(remaining).slice(0, 1500);
      data = [...topVoted, ...sampledRemaining];
    }

    if (this.noticeEl) {
      this.noticeEl.style.display = isSampled ? 'block' : 'none';
      if (isSampled) {
        this.noticeEl.textContent = `* Showing top 3,500 sampled records out of ${allFiltered.length.toLocaleString()} filtered titles for smooth performance. Summary metrics use 100% of data.`;
      }
    }

    if (data.length === 0) {
      this.container.innerHTML = `<div style="color: ${axisTextColor}; text-align: center; padding-top: 150px; font-size: 14px;">No titles match active filters. Try adjusting sliders or resetting filters.</div>`;
      return;
    }

    const svg = d3.select(this.container)
      .append('svg')
      .attr('width', rect.width)
      .attr('height', rect.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([1.0, 10.0])
      .range([0, width]);

    const minY = d3.min(data, d => d.v) || 1000;
    const maxY = d3.max(data, d => d.v) || 1000000;

    const yScale = d3.scaleLog()
      .domain([Math.max(1000, minY), maxY])
      .range([height, 0]);

    const rScale = d3.scaleSqrt()
      .domain([1, 300])
      .range([4, 12])
      .clamp(true);

    const colorScale = d3.scaleOrdinal()
      .domain(store.genresList)
      .range(d3.schemeTableau10);

    // Grid lines
    svg.append('g')
      .attr('class', 'grid-lines')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(''))
      .selectAll('line')
      .attr('stroke', gridLineColor)
      .attr('stroke-dasharray', '3,3');

    svg.append('g')
      .attr('class', 'grid-lines')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(''))
      .selectAll('line')
      .attr('stroke', gridLineColor)
      .attr('stroke-dasharray', '3,3');

    // Benchmark Rating Reference Line
    if (store.filters.showCorrelationGuide) {
      svg.append('line')
        .attr('x1', xScale(6.9))
        .attr('y1', 0)
        .attr('x2', xScale(6.9))
        .attr('y2', height)
        .attr('stroke', benchmarkColor)
        .attr('stroke-dasharray', '5,4')
        .attr('stroke-width', 2);

      svg.append('text')
        .attr('x', xScale(6.9) + 8)
        .attr('y', 16)
        .attr('fill', benchmarkColor)
        .attr('font-size', '11px')
        .attr('font-weight', '700')
        .text('Mean Benchmark Rating (6.9)');
    }

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(5, '~s');

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .attr('class', 'axis x-axis')
      .call(xAxis)
      .selectAll('text')
      .attr('fill', axisTextColor)
      .attr('font-size', '11px')
      .attr('font-weight', '500');

    svg.append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', axisTextColor)
      .attr('font-size', '11px')
      .attr('font-weight', '500');

    svg.selectAll('.domain, .tick line')
      .attr('stroke', axisLineColor);

    // Axis Labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 38)
      .attr('fill', axisTextColor)
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('text-anchor', 'middle')
      .text('Audience Average Rating (1.0 — 10.0)');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -42)
      .attr('fill', axisTextColor)
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('text-anchor', 'middle')
      .text('Log Vote Volume (numVotes)');

    // D3 Scatterplot Points (Circle = Movie, Diamond = TV Series)
    const useDistinctShapes = store.filters.showDistinctShapes;
    const defaultPointStroke = isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.9)';
    const hoverStroke = isDark ? '#ffffff' : '#0f172a';
    const self = this;

    svg.append('g')
      .attr('class', 'scatterplot-points')
      .selectAll('.point')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'point')
      .attr('transform', d => `translate(${xScale(d.r)},${yScale(Math.max(1000, d.v))})`)
      .attr('d', d => {
        const size = Math.pow(rScale(d.m || 90), 2) * Math.PI;
        const symbolType = (useDistinctShapes && d.k === 1) ? d3.symbolDiamond : d3.symbolCircle;
        return d3.symbol().type(symbolType).size(size)();
      })
      .attr('fill', d => {
        const primaryGenreIdx = (d.g && d.g.length > 0) ? d.g[0] : null;
        return primaryGenreIdx !== null ? colorScale(store.genreMap[primaryGenreIdx]) : '#4f46e5';
      })
      .attr('opacity', 0.72)
      .attr('stroke', defaultPointStroke)
      .attr('stroke-width', 0.8)
      .attr('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(80)
          .attr('opacity', 1)
          .attr('stroke', hoverStroke)
          .attr('stroke-width', 2.5);
        
        self.tooltip.show(event, d, store.genreMap);
      })
      .on('mousemove', (event) => {
        self.tooltip.move(event);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(80)
          .attr('opacity', 0.72)
          .attr('stroke', defaultPointStroke)
          .attr('stroke-width', 0.8);

        self.tooltip.hide();
      })
      .on('click', (event, d) => {
        store.setSelectedTitle(d);
      });
  }
}
