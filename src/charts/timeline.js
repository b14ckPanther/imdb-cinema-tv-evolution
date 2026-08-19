/**
 * timeline.js
 * D3 Temporal Cinema Timeline Chart with Multi-Metric Toggle & 1D Brush
 * Enhanced with dynamic Light/Dark mode colors and smooth visual aesthetic.
 */

import * as d3 from 'd3';
import { store } from '../state/store.js';

export class TimelineChart {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.svg = null;
    this.width = 0;
    this.height = 0;
    this.margin = { top: 15, right: 20, bottom: 35, left: 50 };
  }

  init() {
    if (!this.container) return;
    this.render();

    window.addEventListener('resize', () => {
      this.render();
    });
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const axisTextColor = isDark ? '#9ca3af' : '#475569';
    const axisLineColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#cbd5e1';

    const rect = this.container.getBoundingClientRect();
    this.width = rect.width - this.margin.left - this.margin.right;
    this.height = rect.height - this.margin.top - this.margin.bottom;

    if (this.width <= 0 || this.height <= 0) return;

    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', rect.width)
      .attr('height', rect.height)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const metricMode = store.filters.timelineMetric || 'volume';

    // Group titles by year according to active metric
    const yearMetrics = d3.rollup(
      store.allTitles,
      v => {
        const count = v.length;
        const avgRating = d3.mean(v, d => d.r) || 0;
        const avgRuntime = d3.mean(v.filter(d => d.m), d => d.m) || 0;
        return { count, avgRating, avgRuntime };
      },
      d => d.y
    );

    const data = Array.from(yearMetrics, ([year, obj]) => ({
      year: +year,
      val: metricMode === 'volume' ? obj.count : (metricMode === 'rating' ? obj.avgRating : obj.avgRuntime)
    }))
      .filter(d => d.year >= 1920 && d.year <= 2025)
      .sort((a, b) => a.year - b.year);

    if (data.length === 0) return;

    // Scales
    const xScale = d3.scaleLinear()
      .domain([1920, 2025])
      .range([0, this.width]);

    let yDomain;
    if (metricMode === 'volume') {
      yDomain = [0, d3.max(data, d => d.val) || 100];
    } else if (metricMode === 'rating') {
      yDomain = [4.0, 9.0];
    } else {
      yDomain = [0, d3.max(data, d => d.val) || 180];
    }

    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .nice()
      .range([this.height, 0]);

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d3.format('d'));

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(metricMode === 'rating' ? d3.format('.1f') : d3.format('~s'));

    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .attr('class', 'axis x-axis')
      .call(xAxis)
      .selectAll('text')
      .attr('fill', axisTextColor)
      .attr('font-size', '11px')
      .attr('font-weight', '500');

    this.svg.append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', axisTextColor)
      .attr('font-size', '11px')
      .attr('font-weight', '500');

    this.svg.selectAll('.domain, .tick line')
      .attr('stroke', axisLineColor);

    // Color gradient based on metric
    let gradientColor = '#4f46e5'; // Indigo
    if (metricMode === 'rating') gradientColor = '#d97706'; // Amber
    if (metricMode === 'runtime') gradientColor = '#059669'; // Emerald

    const gradientId = `timeline-area-gradient-${metricMode}`;
    const defs = this.svg.append('defs');
    const areaGradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    areaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', gradientColor)
      .attr('stop-opacity', isDark ? 0.45 : 0.35);

    areaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', gradientColor)
      .attr('stop-opacity', 0.02);

    // Area & Line Generators
    const area = d3.area()
      .x(d => xScale(d.year))
      .y0(this.height)
      .y1(d => yScale(d.val))
      .curve(d3.curveMonotoneX);

    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.val))
      .curve(d3.curveMonotoneX);

    this.svg.append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', area);

    this.svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', gradientColor)
      .attr('stroke-width', 2.2)
      .attr('d', line);

    // D3 Brush
    const brush = d3.brushX()
      .extent([[0, 0], [this.width, this.height]])
      .on('end', (event) => {
        if (!event.selection) {
          store.setFilters({ brushedYears: null });
        } else {
          const [x0, x1] = event.selection;
          const minYear = Math.round(xScale.invert(x0));
          const maxYear = Math.round(xScale.invert(x1));
          store.setFilters({ brushedYears: [minYear, maxYear] });
        }
      });

    this.svg.append('g')
      .attr('class', 'brush')
      .call(brush);

    const brushFill = isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.15)';
    const brushStroke = isDark ? '#818cf8' : '#4f46e5';

    this.svg.selectAll('.selection')
      .attr('fill', brushFill)
      .attr('stroke', brushStroke)
      .attr('stroke-width', 1.5)
      .attr('rx', 3);
  }

  update() {
    this.render();
  }
}
