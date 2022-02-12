var SpanCreatorTaskList = function(topContainer) {

  var input;
  var assignedList;
  var assignedTasks = [];

  var init = function() {
    gatherComponents();
    addBehavior();
  };

  var gatherComponents = function() {
    input = topContainer.find('input');
    assignedList = topContainer.find('ul.assigned');
  };

  var addBehavior = function() {
    input.keyup(onKeyUp);
    new InputSizeAdjuster(input);
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
    publishChange();
  };

  var clear = function() {
    assignedTasks = [];
    assignedList.empty();
    input.val('');
    publishChange();
  };

  var publishChange = function() {
    App.dispatcher.publish('SPAN_CHANGED');
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
    addTask:addTask,
    focus:function() {
      input.focus();
    }
  };
};
