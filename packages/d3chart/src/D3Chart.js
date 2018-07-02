import { VisComponent } from '@candela/core';
import { InitSize } from '@candela/size';

import { select } from 'd3-selection';

export const Margin = Base => class extends Base {
  constructor () {
    super(...arguments);

    this._margin = {
      top: null,
      right: null,
      bottom: null,
      left: null
    }
  }

  margin (m) {
    if (m === undefined) {
      return {...this._margin};
    }

    let mm = {...m};
    for (let key in mm) {
      if (!(key in this._margin)) {
        delete mm[key];
      }
    }

    console.log('mm', mm);

    this._margin = {
      ...this._margin,
      ...mm
    };

    console.log('this._margin', this._margin);

    return this;
  }
};

export const D3Chart = Base => class extends Margin(InitSize(Base)) {
  constructor () {
    super(...arguments);

    this.svg = select(this.el)
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg');

    this.vis = this.svg.append('g')
      .classed('vis', true);

    this.xAxis = this.vis.append('g')
      .classed('axis', true)
      .classed('x-axis', true);

    this.yAxis = this.vis.append('g')
      .classed('axis', true)
      .classed('y-axis', true);

    this.plot = this.vis.append('g')
      .classed('plot', true);
  }

  initD3Chart () {
    this.svg.attr('width', this.width)
      .attr('height', this.height);

    console.log('this.width', this.width);
    console.log('this.height', this.height);

    const margin = this.margin();

    this.yAxis.attr('transform', `translate(0,${margin.top})`);
    this.plot.attr('transform', `translate(${margin.left},${margin.top})`);
    this.xAxis.attr('transform', `translate(${margin.left},${this.height - margin.bottom})`);
  }
};

export class Swatches extends D3Chart(VisComponent) {
  constructor (el, options) {
    super(el, options);

    this.width = options.width;
    this.height = options.height;
    this.margin(options.margin)
      .initD3Chart();

    const margin = this.margin();
    console.log(margin);

    this.xAxis.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width - margin.left - margin.right)
      .attr('height', margin.bottom)
      .style('stroke', 'black')
      .style('fill', 'red');

    this.yAxis.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', margin.left)
      .attr('height', this.height - margin.top - margin.bottom)
      .style('stroke', 'black')
      .style('fill', 'green');

    this.plot.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width - margin.left - margin.right)
      .attr('height', this.height - margin.top - margin.bottom)
      .style('stroke', 'black')
      .style('fill', 'blue');
  }

  render () {
    console.log('render()');
  }
};
