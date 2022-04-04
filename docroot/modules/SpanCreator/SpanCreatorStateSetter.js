var SpanCreatorStateSetter = function(
  startTimeField,
  finishTimeField,
  projectSuggestor,
  taskList,
  saveButtonText,
  saveAndRepeatButton,
  cancelButton,
  timeUtil) {

  return {
    init:function() {
      startTimeField.now();
      finishTimeField.clear();
      taskList.clear();
      saveButtonText.text('Create');
      saveAndRepeatButton.show();
      projectSuggestor.clear();
      cancelButton.hide();
    },
    reset:function() {
      startTimeField.now();
      finishTimeField.clear();
      taskList.clear();
      saveButtonText.text('Create');
      saveAndRepeatButton.show();
      projectSuggestor.clear();
      projectSuggestor.focus();
      cancelButton.hide();
    },
    edit:function(span) {
      startTimeField.setTime(span.start);
      finishTimeField.setTime(span.finish);
      projectSuggestor.set(span.project);
      taskList.setTasks(span.tasks);
      saveButtonText.text('Save');
      saveAndRepeatButton.hide();
      cancelButton.show();
    },
    repeat:function(span) {
      startTimeField.now();
      finishTimeField.clear();
      projectSuggestor.set(span.project);
      taskList.setTasks(span.tasks);
      saveButtonText.text('Create');
      saveAndRepeatButton.show();
      cancelButton.hide();
      finishTimeField.focus();
    },
    restore:function(span) {
      if (timeUtil.isValidDate(span.start))
        startTimeField.setTime(span.start);
      if (timeUtil.isValidDate(span.finish))
        finishTimeField.setTime(span.finish);
      projectSuggestor.set(span.project);
      taskList.setTasks(span.tasks);
      cancelButton.hide();
    }
  };
};
