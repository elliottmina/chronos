var SpanSummary = function() {

  var spansContainer;
  var nonContentContainer;
  var contentContainer;
  var itemBuilder
  var regEx;
  var spans;
  var spanMap = {};

  var init = function() {
    build();
    buildDependencies();
    addBehavior();
  };

  var buildDependencies = function() {
    regEx = new RegEx();
    itemBuilder = new SpanSummaryItemBuilder(
      new Padder(),
      Rounder.roundDecimal,
      new TimeFormatter12Hr(),
      regEx,
      spansContainer);
  };

  var build = function() {
    var renderTo = jQuery('#SpanSummary');
    renderTo.html(SpanSummaryTemplate);
    spansContainer = renderTo.find('.item_container');
    noContentContainer = renderTo.find('.no_content_container');
    contentContainer = renderTo.find('.content_container');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', populateSpans);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', populateSpans);
    jQuery('#SpanSummary input.filter').keyup(onFilterChange);
  };

  var onDateChanged = function(data) {
    spans = data.spans;
    populateSpans();
  };

  var populateSpans = function() {
    noContentContainer.show();
    contentContainer.hide();
    spansContainer.empty();
    spanMap = {};

    jQuery.each(spans, function(index, span) {
      addSpan(span)
    });
  };

  var onSpanSaved = function(data) {
    var span = data.span;
    var container = spanMap[span.guid];
    if (container)
      itemBuilder.build(span, container);
    else
      addSpan(span);
    spansContainer.find('.selected').removeClass('selected');
  };

  var addSpan = function(span) {
    noContentContainer.hide();
    contentContainer.show();
    var container = jQuery(SpanSummaryItemTemplate)
      .prependTo(spansContainer);
    spanMap[span.guid] = container;
    itemBuilder.build(span, container);
  };

  var onSpanDeleted = function(data) {
    var guid = data.span.guid;
    spanMap[guid].remove();
    delete(spanMap[guid]);
    if (spansContainer.children().length == 0)
      noContentContainer.show();
  };

  var onFilterChange = function() {
    spansContainer.find('li').show();

    var projectText = jQuery(this).val().toLowerCase();
    if (projectText == '')
      return;
    
    var re = regEx.squishyMatch(projectText);

    spansContainer.find('li').each(function(index, container) {
      container = jQuery(container);
      var project = container.find('.project').text().toLowerCase();
      if (!re.test(project))
        container.hide();
    });
  };

  init();

};
