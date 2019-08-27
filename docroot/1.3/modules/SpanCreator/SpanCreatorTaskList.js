var SpanCreatorTaskList = function(topContainer) {

  var input;
  var list;
  var tasks = [];

  var init = function() {
    gatherComponents();
    addBehavior();
  };

  var gatherComponents = function() {
    input = topContainer.find('input');
    list = topContainer.find('ul');
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
    if (!task || tasks.indexOf(task) > -1)
      return;

    input.val('');
    tasks.push(task);

    var li = jQuery('<li>').appendTo(list);

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
    tasks.splice(tasks.indexOf(taskText), 1);
    anchor.parent().remove();
    publishChange();
  };

  var clear = function() {
    tasks = [];
    list.empty();
    input.val('');
    publishChange();
  };

  var publishChange = function() {
    App.dispatcher.publish('SPAN_CHANGED');
  };

  init();

  return {
    getTasks:function() {
      return tasks;
    },
    addCurrent:addTypedTask,
    clear:clear,
    setTasks:function(tasks) {
      clear();
      jQuery.each(tasks, function(index, task) {
        addTask(task);
      });
    },
    focus:function() {
      input.focus();
    }
  };
};
