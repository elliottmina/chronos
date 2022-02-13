var SpanCreatorProjectSuggestor = function(
  projectSuggestor,
  recentProjectBuilder,
  timeUtil) {

  var todayProjectBuilder;
  var yesterdayProjectBuilder;
  var projectsContainer;
  var recentProjects;
  var todaysProjects;
  var yesterdaysProjects;
  var selectedIndex;
  var showing = false;

  var init = function() {
    todayProjectBuilder = new SpanCreatorSpecificDayProjectBuilder();
    yesterdayProjectBuilder = new SpanCreatorSpecificDayProjectBuilder();

    gatherComponents();
    recentProjects = recentProjectBuilder.build();
    updateSuggestions();
    addBehavior();
  };

  var gatherComponents = function() {
    projectsContainer = jQuery('#SpanCreator .project_suggestions ul');
    projectInput = jQuery('#SpanCreator input[name="project"]');
  };

  var addBehavior = function() {
    projectInput.keyup(publishChange);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    new InputSizeAdjuster(projectInput);
  };

  var onSpanSaved = function(data) {
    if (jQuery.inArray(data.span.project, recentProjects) == -1) {
      recentProjects.push(data.span.project);
      updateSuggestions();
    }
  };

  var onDateChanged = function(data) {
    todayProjectBuilder.setDate(data.date);

    const yesterday = timeUtil.addDays(new Date(data.date), -1);
    const yesterdayYmd = timeUtil.getYmd(yesterday);
    yesterdayProjectBuilder.setDate(yesterdayYmd);
    updateSuggestions();
  };

  var updateSuggestions = function() {
    recentProjects.sort();
    projectSuggestor.setSuggestions(reorder(recentProjects));
  };

  var reorder = function() {
    const todaysProjects = todayProjectBuilder.build();
    const yesterdaysProjects = yesterdayProjectBuilder.build();
    console.log(todaysProjects, yesterdaysProjects);

    var suggestions = [...recentProjects];
    suggestions = suggestions.filter(proj => {
      if (todaysProjects.includes(proj))
        return false;
      if (yesterdaysProjects.includes(proj))
        return false;
      return true;
    });

    suggestions = [...todaysProjects, ...yesterdaysProjects, ...suggestions];

    return suggestions;
  };

  var publishChange = function() {
    App.dispatcher.publish('SPAN_CHANGED');
  };

  init();

  return {
    clear:function() {
      projectInput.val('');
    },
    focus:function() {
      projectInput.focus();
    },
    get:function() {
      return jQuery.trim(projectInput.val());
    },
    set:function(val) {
      projectInput.val(val);
    }
  };

};
