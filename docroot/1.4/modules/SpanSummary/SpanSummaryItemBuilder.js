var SpanSummaryItemBuilder = function(
  timeFormatter,
  timeUtil,
  heartBuilder,
  topContainer) {

  var populateSpan = function(span) {
    const container = document.createElement('span-item');
    topContainer.append(container);

    container.innerHTML = `
      <header>
        <label></label>
        <buttons>
          <span class="mini_button edit far fa-pencil"></span>
          <span class="mini_button delete far fa-trash"></span>
          <span class="mini_button repeat far fa-repeat"></span>
        </buttons>
      </header>
      <time>
        <start>${start(span)}</start> - 
        <finish>${finish(span)}</finish>
        <elapsed>${elapsed(span)} <unit>hr</unit></elapsed>
        <heart-container></heart-container>
      </time>
      <ul></ul>`;

    container.querySelector('label').appendChild(label(span));
    container.querySelector('heart-container').appendChild(
      heartBuilder.build(elapsedMinutes(span)/60));

    buildTasks(container, span);
    addBehavior(container, span);
  };

  var start = function(span) {
    return timeFormatter.format(span.start);
  };

  var finish = function(span) {
    return timeFormatter.format(span.finish);
  };

  var elapsed = function(span) {
    return timeUtil.formatTime(elapsedMinutes(span));
  };

  var label = function(span) {
    return App.projectSegmentor.getFormatted(span.project)[0];
  };

  var elapsedMinutes = function(span) {
    return (span.finish - span.start)/1000/60;
  };

  var buildTasks = function(container, span) {
    const list = container.querySelector('ul');
    span.tasks.forEach(task => {
      const item = document.createElement('li');
      item.textContent = task;
      list.appendChild(item);
    });
  };

  var addBehavior = function(container, span) {
    [
      ['.edit', editSpan], 
      ['.delete', deleteSpan], 
      ['.repeat', repeatSpan],
    ].forEach(plan => {
      const button = container.querySelector(plan[0]);
      button.addEventListener('click', plan[1]);
      button.setAttribute('guid', span.guid);
    });
  };

  var editSpan = function() {
    App.dispatcher.publish('EDIT_SPAN_REQUESTED', this.getAttribute('guid'));

    clearSelected();
    this.closest('span-item').classList.add('selected');
  };

  var clearSelected = function() {
    const selected = topContainer.querySelector('.selected');
    if (selected)
      selected.classList.remove('selected');
  };

  var deleteSpan = function() {
    App.dispatcher.publish('DELETE_SPAN_REQUESTED', this.getAttribute('guid'));
  };

  var repeatSpan = function() {
    App.dispatcher.publish('REPEAT_SPAN_REQUESTED', this.getAttribute('guid'));
  };

  return {
    build:populateSpan
  };

};
