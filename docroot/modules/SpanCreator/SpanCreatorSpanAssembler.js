var SpanCreatorSpanAssembler = function(
  startTimeField, 
  finishTimeField,
  taskList) {

  var projectInput;

  var init = function() {
    gatherComponents();
  };

  var gatherComponents = function() {
    projectInput = jQuery('#SpanCreator input[name="project"]');
  };

  var getFinishDate = function() {
    var finish = finishTimeField.getTime();
    if (finish)
      return finish;

    var now = new Date();
    now.setFullYear(date.getFullYear());
    now.setMonth(date.getMonth());
    now.setDate(date.getDate());
    return now;
  };

  init();
  
  return {
    assemble:function() {
      return {
        start:startTimeField.getTime(),
        finish:getFinishDate(),
        project:jQuery.trim(projectInput.val()),
        tasks:taskList.getTasks()
      };
    }
  };

};
