var WeekSummary = function() {

  var aggregator;
  var timeUtil;
  var itemBuilder;
  var weekStart;
  var columns;
  var header;

  var init = function() {
    build();
    timeUtil = new TimeUtil();
    aggregator = new WeekSummaryAggregator(timeUtil, new SummaryBuilder());
    itemBuilder = new WeekSummaryItemBuilder(timeUtil, new ProgressBarSetter());
    addBehavior();
  };

  var build = function() {
    const topContainer = document.querySelector('week-summary');
    topContainer.innerHTML = `
    <columns>
      <column></column>
      <column></column>
    </columns>
    <header></header>
    `;
    columns = topContainer.querySelectorAll('column');
    header = topContainer.querySelector('header');
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

    buildProjects(projects, totalRawMinutes, totalRoundedMinutes);
    buildGoal(totalRawMinutes, totalRoundedMinutes);
  };

  var buildProjects = function(projects, totalRawMinutes, totalRoundedMinutes) {
    function buildItem(project, col) {
      itemBuilder.build(project, totalRawMinutes, totalRoundedMinutes, col);
    }

    const topProjects = projects.splice(0, 3);
    topProjects.forEach(project => buildItem(project, columns[0]));
    projects.forEach(project => buildItem(project, columns[1]));
  };

  var buildGoal = function(totalRawMinutes, totalRoundedMinutes) {
    const goalMinutes = App.globalSettings.goal_hours_week*60;

    const project = {
      label: 'Week',
      rawMinutes:totalRawMinutes,
      roundedMinutes: totalRoundedMinutes,
      roundDelta: totalRoundedMinutes - totalRawMinutes,
    };

    itemBuilder.build(project, goalMinutes, goalMinutes, header);
  };

  var empty = function () {
    columns.forEach(col => {
      while (col.lastChild) {
        col.removeChild(col.lastChild);
      }
    });
    while (header.lastChild) {
      header.removeChild(header.lastChild);
    }
  };

  init();

};
