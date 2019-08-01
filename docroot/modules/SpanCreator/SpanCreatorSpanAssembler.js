var SpanCreatorSpanAssembler = function(
  startTimeField, 
  finishTimeField,
  taskList,
  projectSuggestor) {

  return {
    assemble:function() {
      return {
        start:startTimeField.getTime(),
        finish:finishTimeField.getTime(),
        project:projectSuggestor.get(),
        tasks:taskList.getTasks()
      };
    }
  };

};
