var SpanCreatorSpanAssembler = function(
  startTimeField, 
  finishTimeField,
  taskSuggestor,
  projectSuggestor) {

  return {
    assemble:function() {
      return {
        start:startTimeField.getTime(),
        finish:finishTimeField.getTime(),
        project:projectSuggestor.get(),
        tasks:taskSuggestor.getTasks()
      };
    }
  };

};
