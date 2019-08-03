var SpanCreatorWipSaver = function(spanAssembler) {

  var init = function() {
    addBehavior();
  };

  var addBehavior = function() {
    App.dispatcher.register('SPAN_CHANGED', onSpanChanged);
  };

  var onSpanChanged = function() {
    localStorage.setItem('span_wip', JSON.stringify(spanAssembler.assemble()));
  };

  init();

  return {
    get:function() {
      var result = localStorage.getItem('span_wip');
      if (result) {
        var span = JSON.parse(result);
        var start = new Date(span.start);
        var finish = new Date(span.finish);

        span.start = start ? start : undefined;
        span.finish = finish ? finish : undefined;

        return span;
      }
    }
  };

};