var Stats = function() {
  
  var chartBuilder;
  var statsCalculator;
  var colorGenerator;
  var date;
  var chart;

  var init = function() {
    buildDependencies();
    build();
    addBehavior();
  };

  var buildDependencies = function() {
    chartBuilder = new StatsPieChartBuilder();
    statsCalculator = new StatsDataCalculator();
    colorGenerator = new StatsColorGenerator();
  };

  var build = function() {
    jQuery('#Stats').html(StatsTemplate);
    chart = chartBuilder.build('StatusTodayChart');
    // project, project:task
    // daily, weekly, quarterly

  };

  var addBehavior = function() {
    App.dispatcher.register('DATE_CHANGED', onDateChanged);
    App.dispatcher.register('SPAN_SAVED', onSpanSaved);
    App.dispatcher.register('SPAN_DELETED', onSpanDeleted);
  };

  var onDateChanged = function(data) {
    date = data.date;
    updateHistorical();
    updateToday(data.spans);
  };

  var onSpanSaved = function(data) {
    updateToday(data.record.spans);
  };

  var onSpanDeleted = function(data) {
    updateToday(data.spans);
  };

  var updateHistorical = function() {

  };

  var updateToday = function(spans) {
    var kv = statsCalculator.calc(spans);
    var labels = kv[0];
    var values = kv[1];

    chart.data.datasets[0].data = values;
    chart.data.datasets[0].backgroundColor = colorGenerator.generate(labels);
    chart.data.labels = labels;
    chart.update();
  };

  init();
};
