var SpanSummary = function() {

  var container;
  var itemBuilder
  var spans;
  var spanMap = {};

  var init = function() {
    gatherComponents();
    buildDependencies();
    addBehavior();
  };

  var gatherComponents = function() {
    container = document.getElementById('SpanSummary');
  };

  var buildDependencies = function() {
    itemBuilder = new SpanSummaryItemBuilder(
      new TimeFormatter12Hr(),
      new TimeUtil(),
      new HeartBuilder(),
      container);
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', populateSpans);
    App.dispatcher.subscribe('SPAN_DELETED', populateSpans);
    App.dispatcher.subscribe('SPAN_EDIT_CANCELLED', clearSelectedTreatment);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', populateSpans);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', populateSpans);
  };

  var onDateChanged = function(data) {
    spans = data.spans;
    populateSpans();
  };

  var populateSpans = function() {
    empty();
    Object.entries(spans).forEach(([k, span]) => itemBuilder.build(span));
  };

  var empty = function () {
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  };

  var clearSelectedTreatment = function () {
    const selected = container.querySelector('.selected');
    if (selected)
      selected.classList.remove('selected');
  };

  init();

};
