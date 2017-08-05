var SpanCreatorShortcuts = function(
	projectSuggestor, 
	save, 
	startTimeField, 
	finishTimeField) {

	var container;
	var buttonIcon;

	var init = function() {
		gatherComponents();
		addBehavior();
	};

	var gatherComponents = function() {
		var topContainer = $('#SpanCreator');
		container = topContainer.find('.hotkeys');
		buttonIcon = topContainer.find('.toggle_hotkeys i');
	};
	
	var addBehavior = function() {
		var topContainer = $('#SpanCreator');
		topContainer.find('.toggle_hotkeys').click(toggleDisplay);
		topContainer.find('.save').click(save).keyup(onSaveKeyUp);
		jQuery(document).keyup(onKeyUp);
	};

	var onKeyUp = function(e) {
		if (e.key == 'Enter' && e.altKey) {
			e.stopPropagation();
			e.preventDefault();
			save();
			return;
		}

		if (e.key == 'p' && e.altKey) {
			e.stopPropagation();
			e.preventDefault();
			projectSuggestor.focus();
			return;
		}

		if (e.key == 's' && e.altKey) {
			e.stopPropagation();
			e.preventDefault();
			startTimeField.focus();
			return;
		}

		if (e.key == 'f' && e.altKey) {
			e.stopPropagation();
			e.preventDefault();
			finishTimeField.focus();
			return;
		}
	};

	var onSaveKeyUp = function(e) {
		if (e.key == 'Enter' || e.key == ' ')
			save();
	};

	var toggleDisplay = function() {
		container.toggle();
		if (container.css('display') == 'block')
			buttonIcon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
		else
			buttonIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
	};

	init();

};