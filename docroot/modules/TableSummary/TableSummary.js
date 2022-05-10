var TableSummary = function() {

  var html = `
    <table class="summary">
      <tbody></tbody>
    </table>`;

  var dataBuilder;
  var copier;
  var tbody;
  var spans;
  var itemBuilder;
  var totalsBuilder;

  var init = function() {
    dataBuilder = new ProjectSummaryDataBuilder();
    copier = new Copier();
    build();
    gatherComponents();
    addBehavior();

    itemBuilder = new TableSummaryItemBuilder(
      new  TimeUtil(),
      new TimeFormatter12Hr(),
      copier,
      new HeartBuilder(),
      tbody);

    totalsBuilder = new TableSummaryTotalsBuilder(
      new HeartBuilder(), 
      tbody);
  };

  var build = function() {
    jQuery('#TableSummary').html(html);
  };

  var gatherComponents = function() {
    tbody = jQuery('#TableSummary tbody');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', updateDisplay);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', updateDisplay);
    App.dispatcher.subscribe('QUARTER_HOUR_CHANGED', updateDisplay);
    App.dispatcher.subscribe('GOAL_HOURS_DAY_CHANGED', updateDisplay);
  };

  var onDateChanged = function(date) {
    spans = date.spans;
    updateDisplay();
  };

  var onSpanSaved = function(data) {
    spans = data.record.spans;
    updateDisplay();
  };

  var onSpanDeleted = function(data) {
    spans = data.record.spans;
    updateDisplay();
  };

  var updateDisplay = function() {
    var summaryData = dataBuilder.build(spans);
    applyQuarterHour(summaryData);

    if (Object.keys(summaryData).length)
      populate(summaryData);
    else
      showNoContent();
  };

  var populate = function(summaryData) {
    tbody.empty();

    const totalMinutes = Object.entries(summaryData).reduce((total, item) => {
      return total + item[1].time;
    }, 0);

    var sortedKeys = Object.keys(summaryData).sort();
    for (var i = 0; i < sortedKeys.length; i++) {
      var key = sortedKeys[i];
      itemBuilder.build(summaryData[key], totalMinutes, spans);
    }

    totalsBuilder.build(summaryData);

  };

  var showNoContent = function() {
    // TODO: it's shite
    tbody.empty();
    const tr = jQuery('<tr>').appendTo(tbody);
    const td = jQuery('<td colspan="5">').appendTo(tr);
    td.text('nope');
  };

  var applyQuarterHour = function(summaryData) {
    Object.entries(summaryData).forEach(projectInfo =>{
      const projNumbers = projectInfo[1];

      const rawMinutes = projNumbers.time;
      const roundedMinutes = Math.round(rawMinutes/15)*15;

      projNumbers.time = roundedMinutes;
      projNumbers.rawMinutes = rawMinutes;
      projNumbers.roundDelta = roundedMinutes - rawMinutes;
    });
  };

  init();

};
