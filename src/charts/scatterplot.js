/**
 * scatterplot.js
 * Main D3 Rating vs Popularity & Runtime Scatterplot Chart
 * Enhanced for Stage 5: Correct benchmark line labeling & sampling user notice.
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
  }

  init() {
    if (!this.container) return;
    this.update();

    window.addEventListener('resize', () => {
      this.update();
    });
  }

  update() {
    if (!this.container) return;
    this.container.innerHTML = '';

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
      this.container.innerHTML = '<div style="color: #6b7280; text-align: center; padding-top: 150px; font-size: 15px;">No titles match active filters. Try adjusting sliders or resetting filters.</div>';
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
      .range([4, 13])
      .clamp(true);

    const colorScale = d3.scaleOrdinal()
      .domain(store.genresList)
      .range(d3.schemeTableau10);

    // Grid lines
    svg.append('g')
      .attr('class', 'grid-lines')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(''))
      .selectAll('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.05)');

    svg.append('g')
      .attr('class', 'grid-lines')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(''))
      .selectAll('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.05)');

    // Benchmark Rating Reference Line (Not labeled as a correlation line)
    if (store.filters.showCorrelationGuide) {
      svg.append('line')
        .attr('x1', xScale(6.9))
        .attr('y1', 0)
        .attr('x2', xScale(6.9))
        .attr('y2', height)
        .attr('stroke', 'rgba(245, 158, 11, 0.6)')
        .attr('stroke-dasharray', '4,4')
        .attr('stroke-width', 1.5);

      svg.append('text')
        .attr('x', xScale(6.9) + 6)
        .attr('y', 14)
        .attr('fill', '#f59e0b')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .text('Rating Benchmark Reference Line (6.9)');
    }

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(5, '~s');

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .attr('class', 'axis x-axis')
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#9ca3af')
      .attr('font-size', '11px');

    svg.append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#9ca3af')
      .attr('font-size', '11px');

    svg.selectAll('.domain, .tick line')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)');

    // Axis Labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 38)
      .attr('fill', '#9ca3af')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('text-anchor', 'middle')
      .text('Audience Average Rating (1.0 — 10.0)');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -42)
      .attr('fill', '#9ca3af')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('text-anchor', 'middle')
      .text('Log Vote Volume (numVotes)');

    // D3 Scatterplot Points (Circle = Movie, Diamond = TV Series)
    const useDistinctShapes = store.filters.showDistinctShapes;

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
        return primaryGenreIdx !== null ? colorScale(store.genreMap[primaryGenreIdx]) : '#6366f1';
      })
      .attr('opacity', 0.68)
      .attr('stroke', 'rgba(0, 0, 0, 0.35)')
      .attr('stroke-width', 0.5)
      .attr('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(100)
          .attr('opacity', 1)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2.5);
        
        self.tooltip.show(event, d, store.genreMap);
      })
      .on('mousemove', (event) => {
        self.tooltip.move(event);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(100)
          .attr('opacity', 0.68)
          .attr('stroke', 'rgba(0, 0, 0, 0.35)')
          .attr('stroke-width', 0.5);

        self.tooltip.hide();
      })
      .on('click', (event, d) => {
        store.setSelectedTitle(d);
      });
  }
}
