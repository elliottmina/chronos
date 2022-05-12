var SpanSummaryItemBuilder = function(
  padder, 
  roundDecimal, 
  timeFormatter,
  heartBuilder,
  tobdy) {
  
  var populateSpan = function(span, tr1, tr2) {
    tr1.empty();
    tr2.empty();

    buildLabel(tr1, span);
    buildStart(tr1, span);
    buildFinish(tr1, span);
    buildElapsed(tr1, span);
    buildHearts(tr1, span);
    buildButtons(tr1, span);

    buildTasks(tr2, span);
    // buttons

    // addBehavior(span, container);
  };

  var buildLabel = function(tr, span) {
    const td = jQuery('<td class="project">').appendTo(tr);
    td.append(App.projectSegmentor.getFormatted(span.project));
  };

  var buildStart = function(tr, span) {
    jQuery('<td class="start">').appendTo(tr).text(timeFormatter.format(span.start));
  };

  var buildFinish = function(tr, span) {
    jQuery('<td class="finish">').appendTo(tr).text(timeFormatter.format(span.finish));
  };

  var buildElapsed = function(tr, span) {
    var elapsedHours = (span.finish - span.start)/1000/60/60;
    var elapsed = formatElapsed(elapsedHours);
    jQuery('<td class="elapsed">').appendTo(tr).text(elapsed);

  };

  var buildHearts = function(tr, span) {
    const td = jQuery('<td class="heart-container">').appendTo(tr);

    var elapsedHours = (span.finish - span.start)/1000/60/60;
    heartBuilder.build(elapsedHours, td[0]);
  };

  var buildButtons = function(tr, span) {
    const td = jQuery('<td class="buttons">').appendTo(tr);

    jQuery('<span class="mini_button edit far fa-pencil"></span>')
      .appendTo(td)
      .data('guid', span.guid)
      .click(editSpan);

    jQuery('<span class="mini_button delete far fa-trash"></span>')
      .appendTo(td)
      .data('guid', span.guid)
      .click(deleteSpan);

    jQuery('<span class="mini_button repeat far fa-repeat"></span>')
      .appendTo(td)
      .data('guid', span.guid)
      .click(repeatSpan);
  }

  var buildTasks = function(tr, span) {
    const td = jQuery('<td class="tasks" colspan="6">').appendTo(tr);
    const listEl = jQuery('<ul>').appendTo(td);

    jQuery.each(span.tasks, function(index, task) {
      var li = jQuery('<li>')
        .appendTo(listEl)
        .text(task);
    });
  };

  var formatElapsed = function(elapsedHours) {
    if (App.globalSettings.use_decimal_hours)
      return formatDecimal(elapsedHours);
    return formatMinutes(elapsedHours);
  };

  var formatMinutes = function(elapsedHours) {
    var hours = Math.floor(elapsedHours);
    var minutes = padder.twoDigit(Math.floor((elapsedHours % 1) * 60));
    return hours + ':' + minutes;
  };

  var formatDecimal = function(elapsedHours) {
    return roundDecimal(elapsedHours, 2)
  };

  var editSpan = function() {
    var el = jQuery(this);
    var guid = el.data('guid');
    
    App.dispatcher.publish('EDIT_SPAN_REQUESTED', guid);
    
    tobdy.find('.selected').removeClass('selected');
    
    const tr1 = el.closest('tr').addClass('selected');
    tr1.next().addClass('selected');
  };

  var deleteSpan = function() {
    var guid = jQuery(this).data('guid');
    App.dispatcher.publish('DELETE_SPAN_REQUESTED', guid);
  };

  var repeatSpan = function() {
    var guid = jQuery(this).data('guid');
    App.dispatcher.publish('REPEAT_SPAN_REQUESTED', guid);
  };

  return {
    build:populateSpan
  };

};
