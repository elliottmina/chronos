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
	};

	var onKeyUp = function(e) {
		if (e.key == 'Enter')
			addTask();
	};

	var addTask = function() {
		var task = jQuery.trim(input.val());
		if (!task || tasks.indexOf(task) > -1)
			return;

		input.val('');
		tasks.push(task);

		var li = $('<li>').appendTo(list);

		$('<a>')
			.appendTo(li)
			.addClass('fa fa-times')
			.click(removeItem);

		li.append(task);
	};

	var removeItem = function() {
		var anchor = $(this);
		var taskText = anchor[0].nextSibling;
		tasks.splice(tasks.indexOf(taskText), 1);
		anchor.parent().remove();
	};

	var clear = function() {
		tasks = [];
		list.empty();
		input.val('');
	};

	init();

	return {
		getTasks:function() {
			return tasks;
		},
		addCurrent:addTask,
		clear:clear,
		setTasks:function(tasks) {
			clear();
			jQuery.each(tasks, function(index, task) {
				addTask(task);
			})
		}
	};
};
