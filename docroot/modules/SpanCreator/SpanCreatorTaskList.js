var SpanCreatorTaskList = function(topContainer) {

  var input;
  var assignedList;
  var assignedTasks = [];
  var spans;
  var availableList;

  var init = function() {
    gatherComponents();
    addBehavior();
  };

  var gatherComponents = function() {
    input = topContainer.find('input');
    assignedList = topContainer.find('ul.assigned');
    availableList = topContainer.find('ul.available');
  };

  var addBehavior = function() {
    input.keyup(onKeyUp);
    new InputSizeAdjuster(input);
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
  };

  var onKeyUp = function(e) {
    if (e.key == 'Enter')
      addTypedTask();
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
    updateSpansAvailable();
    publishChange();
  };

  var clear = function() {
    assignedTasks = [];
    assignedList.empty();
    input.val('');
    publishChange();
    updateSpansAvailable();
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
    availableList.empty();

    if (spans === undefined)
      return;

    buildUnassignedTasks(spans).forEach(task => {
      const item = jQuery('<li><i class="far fa-plus"></i></li>');
      item.append(task);
      item.click(addAvailableTask);
      availableList.append(item);
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

    const unassignedTasks = uniqueTasks.filter((task, index) => {
      return assignedTasks.indexOf(task) === -1;
    });

    return unassignedTasks;
  };

  var addAvailableTask = function() {
    addTask(this.innerText);
    updateSpansAvailable();
  };

  init();

  return {
    getTasks:function() {
      return assignedTasks;
    },
    addCurrent:addTypedTask,
    clear:clear,
    setTasks:function(assignedTasks) {
      clear();
      jQuery.each(assignedTasks, function(index, task) {
        addTask(task);
      });
    },
    focus:function() {
      input.focus();
    }
  };
};
