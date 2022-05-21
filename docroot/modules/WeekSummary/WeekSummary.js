var WeekSummary = function() {

  var aggregator;
  var timeUtil;
  var itemBuilder;
  var weekStart;
  var columns;

  var init = function() {
    build();
    timeUtil = new TimeUtil();
    aggregator = new WeekSummaryAggregator(timeUtil, new SummaryBuilder());
    itemBuilder = new WeekSummaryItemBuilder(timeUtil);
    addBehavior();
  };

  var build = function() {
    columns = document.querySelectorAll('week-summary column');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', draw);
    App.dispatcher.subscribe('SPAN_DELETED', draw);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', draw);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', draw);
    App.dispatcher.subscribe('QUARTER_HOUR_CHANGED', draw);
    App.dispatcher.subscribe('GOAL_HOURS_DAY_CHANGED', draw);
  };

  var onDateChanged = function(data) {
    weekStart = timeUtil.getWeekStart(data.date);
    draw();
  };

  var draw = function() {
    empty();
    const projects = aggregator.aggregate(weekStart);
    const totalRawMinutes = projects.reduce((total, project) => total+project.rawMinutes, 0);
    const totalRoundedMinutes = projects.reduce((total, project) => total+project.roundedMinutes, 0);

    function buildItem(project, col) {
      itemBuilder.build(project, totalRawMinutes, totalRoundedMinutes, col);
    }

    const topProjects = projects.splice(0, 3);
    topProjects.forEach(project => buildItem(project, columns[0]));
    projects.forEach(project => buildItem(project, columns[1]));
  };

  var empty = function () {
    columns.forEach(col => {
      while (col.lastChild) {
        col.removeChild(col.lastChild);
      }
    });
  };

  init();

};
