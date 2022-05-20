var WeekSummary = function() {

  var aggregator;
  var timeUtil;
  var weekStart;
  var tbody;

  var init = function() {
    build();
    timeUtil = new TimeUtil();
    aggregator = new WeekSummaryAggregator(timeUtil);
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
    // App.dispatcher.subscribe('QUARTER_HOUR_CHANGED', draw);
    App.dispatcher.subscribe('GOAL_HOURS_DAY_CHANGED', draw);
  };

  var onDateChanged = function(data) {
    weekStart = timeUtil.getWeekStart(data.date);
    draw();
  };

  var draw = function() {
    empty();
    const data = aggregator.aggregate(weekStart);
    const sum = Object.entries(data).reduce((total, val) => total+val[1], 0);
    Object.entries(data).forEach(row => drawRow(row, sum));
  };

  var drawRow = function(data, sum) {
    const [project, minutes] = data;
    const percent = Math.floor((minutes/sum)*100);

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

    tr.querySelector('label').appendChild(label(project));
    buildWeight(tr, project, percent);
  };

  var label = function(label) {
    return App.projectSegmentor.getFormatted(label)[0];
  };

  var buildWeight = function(tr, project, percent) {
    const color = App.colorGenerator.generate(project, 0.8);
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
