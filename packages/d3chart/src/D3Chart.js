import { VisComponent } from '@candela/core';
import { InitSize } from '@candela/size';

import { select } from 'd3-selection';
import 'd3-transition';
import { axisLeft, axisBottom } from 'd3-axis';

export const Margin = Base => class extends Base {
  constructor () {
    super(...arguments);

    this._margin = {
      top: null,
      right: null,
      bottom: null,
      left: null
    };
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

    return this;
  }

  marginBounds (region) {
    const margin = this.margin();
    let bounds;

    switch (region) {
      case 'left':
        bounds = {
          x: 0,
          y: margin.top,
          width: margin.left,
          height: this.height - margin.top - margin.bottom
        };
        break;

      case 'right':
        bounds = {
          x: this.width - margin.right,
          y: margin.top,
          width: margin.right,
          height: this.height - margin.top - margin.bottom
        };
        break;

      case 'top':
        bounds = {
          x: margin.left,
          y: 0,
          width: this.width - margin.left - margin.right,
          height: margin.top
        };
        break;

      case 'bottom':
        bounds = {
          x: margin.left,
          y: this.height - margin.bottom,
          width: this.width - margin.left - margin.right,
          height: margin.bottom
        };
        break;

      case 'plot':
        bounds = {
          x: margin.left,
          y: margin.top,
          width: this.width - margin.left - margin.right,
          height: this.height - margin.top - margin.bottom
        };
        break;

      default:
        throw new Error(`illegal region identifier: "${region}"`);
    }

    return bounds;
  }
};

export const D3Chart = Base => class extends Margin(InitSize(Base)) {
  constructor () {
    super(...arguments);

    this.svg = select(this.el)
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg');

    // A root-level group element.
    this.root = this.svg.append('g');

    // Group elements to represent all four margins of the plot.
    this.left = this.root.append('g')
      .classed('left', true);
    this.bottom = this.root.append('g')
      .classed('bottom', true);
    this.right = this.root.append('g')
      .classed('right', true);
    this.top = this.root.append('g')
      .classed('top', true);

    // The central area where the main plot will go.
    this.plot = this.root.append('g')
      .classed('plot', true);
  }

  initD3Chart () {
    this.svg.attr('width', this.width)
      .attr('height', this.height);

    const margin = this.margin();

    this.left.attr('transform', `translate(0,${margin.top})`);
    this.bottom.attr('transform', `translate(${margin.left},${this.height - margin.bottom})`);
    this.right.attr('transform', `translate(${this.width - margin.right},${margin.top})`);
    this.top.attr('transform', `translate(${margin.left},0)`);
    this.plot.attr('transform', `translate(${margin.left},${margin.top})`);
  }
};

export const AxisChart = Base => class extends Base {
  constructor () {
    super(...arguments);

    this._axes = {
      leftScale: null,
      bottomScale: null,
      leftAxis: null,
      bottomAxis: null
    };
  }

  _setAxis (scale, direction, scaleFunc) {
    const axisProp = `${direction}Axis`;
    const scaleProp = `${direction}Scale`;

    const bounds = this.marginBounds('plot');

    if (direction === 'left' || direction === 'right') {
      scale.range([bounds.height, 0]);
    } else {
      scale.range([0, bounds.width]);
    }

    this._axes[scaleProp] = scale;

    let axis = this._axes[axisProp];
    if (!axis) {
      this._axes[axisProp] = axis = this[direction].append('g');

      if (direction === 'left') {
        const margin = this.margin();
        axis.attr('transform', `translate(${margin.left},0)`);
      }
    } else {
      axis.selectAll('*').remove();
    }

    axis.call(scaleFunc(scale));
  }

  leftAxis (scale) {
    if (scale) {
      this._setAxis(scale, 'left', axisLeft);
      return this;
    } else {
      return this._axes.leftScale;
    }
  }

  bottomAxis (scale) {
    if (scale) {
      this._setAxis(scale, 'bottom', axisBottom);
      return this;
    } else {
      return this._axes.bottomScale;
    }
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

    this.left.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', margin.left)
      .attr('height', this.height - margin.bottom - margin.top)
      .style('stroke', 'black')
      .style('fill', 'red');

    this.bottom.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width - margin.left - margin.right)
      .attr('height', margin.bottom)
      .style('stroke', 'black')
      .style('fill', 'green');

    this.right.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', margin.right)
      .attr('height', this.height - margin.bottom - margin.top)
      .style('stroke', 'black')
      .style('fill', 'cyan');

    this.top.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width - margin.left - margin.right)
      .attr('height', margin.top)
      .style('stroke', 'black')
      .style('fill', 'yellow');

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
}