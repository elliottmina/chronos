var SpanCreatorStateSetter = function(
	startTimeField,
	finishTimeField,
	projectSuggestor,
	taskList,
	saveButtonText,
	saveAndRepeatButton) {

	return {
		reset:function() {
			startTimeField.now();
			finishTimeField.clear();
			taskList.clear();
			saveButtonText.text('Create');
			saveAndRepeatButton.show();
			projectSuggestor.clear();
			projectSuggestor.focus();
		},
		edit:function(span) {
			startTimeField.setTime(span.start);
			finishTimeField.setTime(span.finish);
			projectSuggestor.set(span.project);
			taskList.setTasks(span.tasks);
			saveButtonText.text('Save');
			saveAndRepeatButton.hide();
		},
		repeat:function(span) {
			startTimeField.now();
			finishTimeField.clear();
			projectSuggestor.set(span.project);
			taskList.setTasks(span.tasks);
			saveButtonText.text('Create');
			saveAndRepeatButton.show();
			finishTimeField.focus();
		}
	};
};
