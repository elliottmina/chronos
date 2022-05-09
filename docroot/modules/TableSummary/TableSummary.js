var TableSummary = function() {

  var html = `
    <table>
      <thead>
        <tr>
          <th rowspan="2">Project</th>
          <th colspan="3" class="raw">Raw</th>
          <th colspan="4">Rounded</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>`;

  var dataBuilder;
  var copier;
  var tbody;
  var spans;
  var itemBuilder;

  var init = function() {
    dataBuilder = new ProjectSummaryDataBuilder();
    copier = new Copier();
    build();
    gatherComponents();
    addBehavior();

    itemBuilder = new TableSummaryItemBuilder(
      new  TimeUtil(),
      copier,
      new Padder(),
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
      itemBuilder.build(summaryData[key], totalMinutes);
    }

    addTotals(summaryData);

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

  var addTotals = function(summaryData) {
    [raw, rounded] = calcTotals(summaryData);
    const delta = (rounded - raw).toFixed(2);
    const sign = delta < 0 ? '-' : '+'; 


    const tr = jQuery('<tr>').appendTo(tbody);
    jQuery('<td>').appendTo(tr).text('Total');    
    jQuery('<td class="raw hours">').appendTo(tr).text(raw);
    jQuery('<td class="raw">').appendTo(tr);
    jQuery('<td class="raw">').appendTo(tr);
    jQuery('<td class="rounded hours">').appendTo(tr).text(rounded);
    jQuery('<td class="rounded delta">').appendTo(tr).text(sign + delta);
  };

  var calcTotals = function(summaryData) {
    var totalRaw = 0;
    var totalRounded = 0;

    Object.entries(summaryData).forEach(projectInfo =>{
      const projNumbers = projectInfo[1];
      totalRaw += projNumbers.rawMinutes;
      totalRounded += Math.round(projNumbers.time/15)*15;
    });

    return [
      (totalRaw/60).toFixed(2), 
      (totalRounded/60).toFixed(2)
    ];
  };

  init();

};
