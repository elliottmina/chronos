var SpanCreatorTaskSuggestor = function(availableList, taskList) {
  
  var spans;

  var init = function() {
    addBehavior();
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
    // NOT SURE ABOUT THIS - spans not udpated
    App.dispatcher.subscribe('SPAN_CHANGED', updateSpansAvailable);
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

  var addAvailableTask = function() {
    addTask(this.innerText);
    updateSpansAvailable();
  };

  var updateSpansAvailable = function() {
    // availableList.empty();

    if (spans === undefined)
      return;

    buildUnassignedTasks(spans).forEach(task => {
      console.log(task);
      // const item = jQuery('<li><i class="far fa-plus"></i></li>');
      // item.append(task);
      // item.click(addAvailableTask);
      // availableList.append(item);
    });
  };

  var buildUnassignedTasks = function() {
    var allTasks = [];
    Object.entries(spans).forEach(span => {
      allTasks = [...allTasks, ...span[1].tasks];
    });

    const uniqueTasks = allTasks.filter((task, index) => {
      return allTasks.indexOf(task) === index;
    });

    const assignedTasks = taskList.getTasks();
    console.log(assignedTasks);
    const unassignedTasks = uniqueTasks.filter((task, index) => {
      return assignedTasks.indexOf(task) === -1;
    });

    return unassignedTasks;
  };

  init();

};
