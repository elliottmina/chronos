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
  };

  var build = function() {
    jQuery('#Goal').html(GoalTemplate);

    dailyChart = new GoalProgressBar('goal-daily');
    weeklyChart = new GoalProgressBar('goal-weekly');
  };

  var gatherComponents = function() {
    dailyContainer = jQuery('#goal-daily');
    weeklyContainer = jQuery('#goal-weekly');
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
    container.find('.hour_value').text(hours);
  };

  var updateChart = function(chart, value, goal) {
    chart.update(calcMaxPercent(value/goal));
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
