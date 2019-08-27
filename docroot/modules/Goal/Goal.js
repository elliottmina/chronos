var Goal = function() {

  var defaultHoursPerDay = 8;
  var defaultHoursPerWeek = 40;
  var hoursPerDay;
  var hoursPerWeek;
  var dailyChart;
  var weeklyChart;
  var dailyContainer;
  var weeklyContainer;
  var weeklyCalculator;
  var durationCalculator;
  var chartBuilder;
  var spans;

  var init = function() {
    calcInitialHoursPerDay();
    calcInitialHoursPerWeek();
    buildDependencies();
    Chart.platform.disableCSSInjection = true;
    build();
    gatherComponents();
    addBehavior();
    registerSettings();
  };

  var buildDependencies = function() {
    durationCalculator = new GoalSpanDurationCalculator();
    weeklyCalculator = new GoalWeeklyCalculator(durationCalculator);
    chartBuilder = new GoalPieChartBuilder();
  };

  var build = function() {
    jQuery('#Goal').html(GoalTemplate);

    dailyChart = chartBuilder.build('GoalTodayChart', '#5bdd81', '#e7f9ec');
    weeklyChart = chartBuilder.build('GoalWeeklyChart', '#2982db', '#f3f9ff');
  };

  var gatherComponents = function() {
    dailyContainer = jQuery('#GoalToday');
    weeklyContainer = jQuery('#GoalWeekly');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
  };

  var onSpanSaved = function(data) {
    spans = data.record.spans;
    updateProgress();
  };

  var onSpanDeleted = function(data) {
    spans = data.spans
    updateProgress();
  };

  var onDateChanged = function(record) {
    spans = record.spans;
    updateProgress();
  };

  var updateProgress = function() {
    var dailyHours = durationCalculator.calcHours(spans);
    updateChart(dailyChart, dailyHours, hoursPerDay);
    updateChartNumbers(dailyContainer, dailyHours, hoursPerDay);

    var weeklyHours = weeklyCalculator.getTotal();
    updateChart(weeklyChart, weeklyHours, hoursPerWeek);
    updateChartNumbers(weeklyContainer, weeklyHours, hoursPerWeek);
  };

  var updateChartNumbers = function(container, value, goal) {
    var hours = Number.parseFloat(value).toFixed(2);
    var remaining = Number.parseFloat(goal - hours).toFixed(2);
    if (remaining < 0)
      remaining = 0;
    var percent = Math.round((value/goal)*100);

    container.find('.hour_value').text(hours);
    container.find('.percent_value').text(percent);
    container.find('.hours_remaining').text(remaining);
  };

  var updateChart = function(chart, value, goal) {
    var percent = calcMaxPercent(value/goal);

    chart.data.datasets[0].data = [
      percent, 100-percent
    ];
    chart.update();
  };

  var calcMaxPercent = function(ratio) {
    var percent = Math.round(ratio*100);
    if (percent > 100)
      percent = 100;
    return percent;
  };

  var calcInitialHoursPerDay = function() {
    var savedValue = parseInt(localStorage.getItem('goal_hours_day'));
    if (isNaN(savedValue))
      hoursPerDay = defaultHoursPerDay;
    else
      hoursPerDay = savedValue;
  };

  var calcInitialHoursPerWeek = function() {
    var savedValue = parseInt(localStorage.getItem('goal_hours_week'));
    if (isNaN(savedValue))
      hoursPerWeek = defaultHoursPerWeek;
    else
      hoursPerWeek = savedValue;
  };

  var onHoursPerDayChange = function(newValue) {
    hoursPerDay = newValue;
    localStorage.setItem('goal_hours_day', newValue);
    updateProgress();
  };

  var onHoursPerWeekChange = function(newValue) {
    hoursPerWeek = newValue;
    localStorage.setItem('goal_hours_week', newValue);
    updateProgress();
  };

  var registerSettings = function() {
    App.settings.register([{
      section:'Goal',
      label:'Hours per day',
      value:hoursPerDay,
      type:'integer',
      callback:onHoursPerDayChange
    },{
      section:'Goal',
      label:'Hours per week',
      value:hoursPerWeek,
      type:'integer',
      callback:onHoursPerWeekChange
    }]);
  };

  init();
};
