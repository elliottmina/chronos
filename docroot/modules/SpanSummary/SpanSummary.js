var SpanSummary = function() {

  var tbody;
  var itemBuilder
  var spans;
  var spanMap = {};

  var init = function() {
    build();
    buildDependencies();
    addBehavior();
  };

  var build = function() {
    const table = jQuery('<table>').appendTo('#SpanSummary');
    tbody = jQuery('<tbody>').appendTo(table);
  };

  var buildDependencies = function() {
    itemBuilder = new SpanSummaryItemBuilder(
      new Padder(),
      Rounder.roundDecimal,
      new TimeFormatter12Hr(),
      new HeartBuilder(),
      tbody);
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
    App.dispatcher.subscribe('SPAN_EDIT_CANCELLED', clearSelectedTreatment);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', populateSpans);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', populateSpans);
  };

  var onDateChanged = function(data) {
    spans = data.spans;
    populateSpans();
  };

  var populateSpans = function() {
    tbody.empty();
    spanMap = {};

    jQuery.each(spans, function(index, span) {
      addSpan(span)
    });
  };

  var onSpanSaved = function(data) {
    const span = data.span;
    const tr = spanMap[span.guid];
    if (tr)
      itemBuilder.build(span, tr);
    else
      addSpan(span);
    clearSelectedTreatment();
  };

  var addSpan = function(span) {
    var tr = jQuery('<tr>').prependTo(tbody);
    spanMap[span.guid] = tr;
    itemBuilder.build(span, tr);
  };

  var onSpanDeleted = function(data) {
    var guid = data.span.guid;
    spanMap[guid].remove();
    delete(spanMap[guid]);
  };

  var clearSelectedTreatment = function () {
    tbody.find('.selected').removeClass('selected');
  };

  init();

};
