/**
 * breakdown.js
 * D3 Categorical Genre Breakdown Bar Chart
 * Enhanced with dynamic Light/Dark theme adaptivity, subtle rounded corners, and crisp labels.
 */

import * as d3 from 'd3';
import { store } from '../state/store.js';

export class BreakdownChart {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.margin = { top: 10, right: 35, bottom: 38, left: 85 };
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

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const axisTextColor = isDark ? '#9ca3af' : '#475569';
    const categoryTextColor = isDark ? '#f3f4f6' : '#1e293b';
    const axisLineColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#cbd5e1';

    const rect = this.container.getBoundingClientRect();
    const width = rect.width - this.margin.left - this.margin.right;
    const height = rect.height - this.margin.top - this.margin.bottom;

    if (width <= 0 || height <= 0) return;

    // Count genre frequencies in active filtered titles
    const counts = {};
    store.filteredTitles.forEach(rec => {
      rec.g.forEach(idx => {
        const gName = store.genreMap[idx];
        if (gName) {
          counts[gName] = (counts[gName] || 0) + 1;
        }
      });
    });

    const data = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);

    if (data.length === 0) {
      this.container.innerHTML = `<div style="color: ${axisTextColor}; text-align: center; padding-top: 80px; font-size: 13px;">No titles match active filters</div>`;
      return;
    }

    const svg = d3.select(this.container)
      .append('svg')
      .attr('width', rect.width)
      .attr('height', rect.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Scales
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, height])
      .padding(0.26);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 1])
      .nice()
      .range([0, width]);

    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(['#4f46e5', '#059669', '#0284c7', '#d97706', '#db2777', '#7c3aed', '#ea580c']);

    // Y Axis (Genre Names)
    svg.append('g')
      .attr('class', 'axis y-axis')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', categoryTextColor)
      .attr('font-size', '11px')
      .attr('font-weight', '600');

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .attr('class', 'axis x-axis')
      .call(d3.axisBottom(xScale).ticks(4).tickFormat(d3.format('~s')))
      .selectAll('text')
      .attr('fill', axisTextColor)
      .attr('font-size', '10px')
      .attr('font-weight', '500');

    svg.selectAll('.domain, .tick line')
      .attr('stroke', axisLineColor);

    // X Axis Label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 32)
      .attr('fill', axisTextColor)
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('text-anchor', 'middle')
      .text('Number of Titles');

    // Bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => yScale(d.name))
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('width', d => xScale(d.count))
      .attr('fill', d => colorScale(d.name))
      .attr('rx', 4)
      .attr('cursor', 'pointer')
      .style('opacity', d => (store.filters.selectedGenre === 'all' || store.filters.selectedGenre === d.name) ? 0.92 : 0.32)
      .on('mouseover', function() {
        d3.select(this)
          .style('opacity', 1)
          .attr('filter', 'drop-shadow(0 2px 6px rgba(79,70,229,0.4))');
      })
      .on('mouseout', function(event, d) {
        const isSelected = store.filters.selectedGenre === 'all' || store.filters.selectedGenre === d.name;
        d3.select(this)
          .style('opacity', isSelected ? 0.92 : 0.32)
          .attr('filter', 'none');
      })
      .on('click', (event, d) => {
        const newGenre = store.filters.selectedGenre === d.name ? 'all' : d.name;
        store.setFilters({ selectedGenre: newGenre });
      });

    // Bar Labels
    svg.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.count) + 6)
      .attr('y', d => yScale(d.name) + yScale.bandwidth() / 2 + 4)
      .attr('fill', axisTextColor)
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .text(d => d.count.toLocaleString());
  }
}
