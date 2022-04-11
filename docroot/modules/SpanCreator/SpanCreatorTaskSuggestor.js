var SpanCreatorTaskSuggestor = function(
  availableList, 
  assignedList, 
  input,
  taskSuggestor) {
  
  var spans;
  var assignedTasks = [];

  var init = function() {
    addBehavior();
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
    App.dispatcher.subscribe('SPAN_CHANGED', updateSpansAvailable);// SPAMMY
    new InputSizeAdjuster(input);
    input.keyup(onInputKeyUp)
  };

  var onInputKeyUp = function(e) {
    switch (e.key) {
      case 'Enter':
        addTask(input.val());
        break;
    }
  };

  var addTypedTask = function() {
    addTask(input.val());
  };

  var addTask = function(task) {
    task = jQuery.trim(task);
    if (!task || assignedTasks.indexOf(task) > -1)
      return;

    input.val('');
    assignedTasks.push(task);

    var li = jQuery('<li>').appendTo(assignedList);

    jQuery('<a>')
      .appendTo(li)
      .addClass('far fa-times')
      .click(removeItem);

    li.append(task);
    publishChange();
  };

  var removeItem = function() {
    var anchor = jQuery(this);
    var taskText = anchor[0].nextSibling.textContent;
    assignedTasks.splice(assignedTasks.indexOf(taskText), 1);
    anchor.parent().remove();
    publishChange();
  };

  var publishChange = function() {
    App.dispatcher.publish('SPAN_CHANGED');
  };

  var onDateChanged = function(date) {
    spans = date.spans;
    updateSpansAvailable();
  };

  var onSpanSaved = function(data) {
    spans = data.record.spans;
    updateSpansAvailable();
  };

  var onSpanDeleted = function(data) {
    spans = data.record.spans;
    updateSpansAvailable();
  };

  var updateSpansAvailable = function() {
    taskSuggestor.setSuggestions(buildUnassignedTasks());
  };

  var buildUnassignedTasks = function() {
    if (spans === undefined)
      return [];

    var allTasks = [];
    Object.entries(spans).forEach(span => {
      allTasks = [...allTasks, ...span[1].tasks];
    });

    const uniqueTasks = allTasks.filter((task, index) => {
      return allTasks.indexOf(task) === index;
    });

    return uniqueTasks.filter((task, index) => {
      return assignedTasks.indexOf(task) === -1;
    });
  };

  var clear = function() {
    input.val('');
    assignedTasks = [];
    assignedList.empty();
  };

  init();

  return {
    addCurrent:addTypedTask,
    getTasks:() => assignedTasks,
    clear: clear,
    setTasks:(tasks) => {
      clear();
      tasks.forEach(task => addTask(task));
    }
  };

};
