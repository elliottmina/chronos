var DaySummary = function() {

  var container;
  var spans;
  var summaryBuilder;
  var itemBuilder;
  var totalsBuilder;

  var init = function() {
    gatherComponents();
    buildDependencies();
    addBehavior();
  };

  var gatherComponents = function() {
    container = document.getElementById('DaySummary');
  };

  var buildDependencies = function() {
    summaryBuilder = new SummaryBuilder();

    const timeUtil = new TimeUtil();
   
    itemBuilder = new DaySummaryItemBuilder(
      timeUtil,
      new TimeFormatter12Hr(),
      new Copier(),
      new HeartBuilder(),
      container);

    totalsBuilder = new DaySummaryTotalsBuilder(
      timeUtil,
      new HeartBuilder(), 
      container);
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpansChanged);
    App.dispatcher.subscribe('SPAN_DELETED', onSpansChanged);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', updateDisplay);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', updateDisplay);
    App.dispatcher.subscribe('QUARTER_HOUR_CHANGED', updateDisplay);
    App.dispatcher.subscribe('GOAL_HOURS_DAY_CHANGED', updateDisplay);
  };

  var onDateChanged = function(date) {
    spans = date.spans;
    updateDisplay();
  };

  var onSpansChanged = function(data) {
    spans = data.record.spans;
    updateDisplay();
  };

  var updateDisplay = function() {
    populate(summaryBuilder.build(spans));
  };

  var populate = function(summaryData) {
    empty();

    const totalRawMinutes = calcTotalMinutes(summaryData, 'rawMinutes');
    const totalRoundedMinutes = calcTotalMinutes(summaryData, 'roundedMinutes');

    var sortedKeys = Object.keys(summaryData).sort();
    sortedKeys.forEach(key => itemBuilder.build(summaryData[key], totalRawMinutes, totalRoundedMinutes));

    totalsBuilder.build(totalRawMinutes, totalRoundedMinutes);
  };

  var empty = function () {
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  };

  var calcTotalMinutes = function(summaryData, key) {
    return Object.entries(summaryData).reduce((total, [_, project]) => {
      return total + project[key];
    }, 0);
 };

  init();

};
