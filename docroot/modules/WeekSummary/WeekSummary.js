var WeekSummary = function() {

  var aggregator;
  var timeUtil;
  var weekStart;
  var tbody;

  var init = function() {
    build();
    timeUtil = new TimeUtil();
    aggregator = new WeekSummaryAggregator(timeUtil, new SummaryBuilder());
    addBehavior();
  };

  var build = function() {
    const topContainer = document.querySelector('week-summary');
    const table = document.createElement('table');
    topContainer.appendChild(table);
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
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
    
    projects.forEach(project => drawRow(project, totalRawMinutes, totalRoundedMinutes));
  };

  var drawRow = function(project, totalRawMinutes, totalRoundedMinutes) {
    var percent;
    var minutes;

    if (App.globalSettings.use_decimal_hours) {
      percent = Math.floor((project.roundedMinutes/totalRoundedMinutes)*100);
      minutes = project.roundedMinutes;
    } else {
      percent = Math.floor((project.rawMinutes/totalRawMinutes)*100);
      minutes = project.rawMinutes;
    }

    const tr = document.createElement('tr');
    tbody.appendChild(tr);
    tr.innerHTML = `
      <td><label></label></td>
      <td>${timeUtil.formatTime(minutes)}</td>
      <td>
        <outer><inner></inner></outer>
      </td>
      <td>${percent}%</td>
    `;

    tr.querySelector('label').appendChild(label(project.label));
    buildWeight(tr, project.label, percent);
  };

  var label = function(label) {
    return App.projectSegmentor.getFormatted(label)[0];
  };

  var buildWeight = function(tr, label, percent) {
    label = App.projectSegmentor.segment(label)[0];
    const color = App.colorGenerator.generate(label, 0.8);
    const inner = tr.querySelector('inner');
    inner.style.width = percent + 'px';
    inner.style.backgroundColor = color;
  };

  var empty = function () {
    while (tbody.lastChild) {
      tbody.removeChild(tbody.lastChild);
    }
  };

  init();

};
