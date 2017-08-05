var SpanCreatorShortcuts = function(
	toggleButton,
	projectSuggestor, 
	saveButton, 
	save, 
	startTimeField, 
	finishTimeField) {

	var init = function() {
		addBehavior();
	};
	
	var addBehavior = function() {
		jQuery(document).keyup(onKeyUp);
		saveButton.click(save).keyup(onSaveKeyUp);
		toggleButton.click(toggleDisplay);
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
		console.log('toggle');
	};

	init();

};
