var StatusChartBuilder = function (container) {

  var buildSegment = function(percent, project) {
    const segment = jQuery('<segment>').appendTo(container);
    segment.css('width', percent.toString() + '%');
    segment.prop('title', project);
    segment.css('background-color', App.colorGenerator.generate(project, 0.7));
  };

  return {
    render:function(distribution) {
      container.empty();

      const sum = distribution.reduce((total, item) => {
        return total + item[1]
      }, 0);

      let totalPercent = 0;
      distribution.forEach(item => {
        [project, time] = [...item];

        const percent = Math.floor((time/sum)*100);
        totalPercent += percent;

        buildSegment(percent, project);
      });

      if (totalPercent != 0)
        buildSegment(100-totalPercent, 'Misc');
    }
  };
};
