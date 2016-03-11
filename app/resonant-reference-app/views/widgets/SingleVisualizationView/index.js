import d3 from 'd3';
import Widget from '../Widget';
import myTemplate from './template.html';
import candela from './../../../../../src';
import './style.css';

let SingleVisualizationView = Widget.extend({
  initialize: function () {
    let self = this;
    self.friendlyName = 'Visualization';
    self.hashName = 'singleVisualizationView';

    self.listenTo(window.toolchain, 'rra:changeVisualizations', self.render);
    self.listenTo(window.toolchain, 'rra:changeMappings', self.render);
  },
  render: function () {
    let self = this;
    
    // Get the visualization in the toolchain (if there is one)
    let visSpec = window.toolchain.get('meta');
    if (visSpec) {
      visSpec = visSpec.visualizations;
      if (visSpec) {
        visSpec = visSpec[0];
      }
    }

    let name = visSpec ? visSpec['name'] : 'None selected';
    let handle = d3.select(self.getIndicatorSpan());

    handle.on('click', function () {
      d3.event.stopPropagation();
      window.layout.overlay.render('visualizationLibrary');
    });
    handle.select('span.indicatorText').text(name);

    let handleIcon = handle.select('span.indicatorIcons')
      .selectAll('img').data([0]);
    handleIcon.enter().append('img');
    
    self.$el.html(myTemplate);
    
    if (visSpec) {
      handleIcon.attr('src', Widget.spinnerIcon);
      let options = window.toolchain.getVisOptions();
      window.toolchain.shapeDataForVis(function (data) {
        handleIcon.attr('src', Widget.okayIcon);

        // Temporarily force the scrollbars, so
        // the view can account for the needed space
        self.$el.css('overflow', 'scroll');
        self.vis = new candela.components[visSpec.name]('.visualization',
                                                        data, options);
        self.vis.render();
        self.$el.css('overflow', '');
      });
    } else {
      handleIcon.attr('src', Widget.warningIcon);
    }
  }
});

export default SingleVisualizationView;