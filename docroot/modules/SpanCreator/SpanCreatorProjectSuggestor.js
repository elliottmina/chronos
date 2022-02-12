var SpanCreatorProjectSuggestor = function(
  recentProjectBuilder, 
  todayProjectBuilder,
  yesterdayProjectBuilder,
  regEx) {

  var itemTemplate = `
    <li class="suggestion">
      <i class="far fa-clock recent_indicator"></i>
      <i class="far fa-chevron-right selected_indicator"></i>
      <span class="text"></span>
    </li>`;
  var projectsContainer;
  var recentProjects;
  var todaysProjects;
  var yesterdaysProjects;
  var selectedIndex;
  var showing = false;

  var init = function() {
    gatherComponents();
    recentProjects = recentProjectBuilder.build();
    recentProjects.sort();
    addBehavior();
  };

  var gatherComponents = function() {
    projectsContainer = jQuery('#SpanCreator .project_suggestions ul');
    projectInput = jQuery('#SpanCreator input[name="project"]');
  };

  var addBehavior = function() {
    projectInput.focus(considerShowing);
    projectInput.blur(onBlur);
    projectInput.keyup(onKeyUp);
    projectInput.keyup(publishChange);
    App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
    new InputSizeAdjuster(projectInput);
  };

  var onSpanSaved = function(data) {
    if (jQuery.inArray(data.span.project, recentProjects) == -1) {
      recentProjects.push(data.span.project);
      recentProjects.sort();
    }
  };

  var show = function() {
    if (showing)
      return;

    projectsContainer.show();
    showing = true;
  };

  var populate = function(suggestions) {
    todaysProjects = todayProjectBuilder.build();
    yesterdaysProjects = yesterdayProjectBuilder.build();
    projectsContainer.empty();
    jQuery.each(suggestions, populateSuggestion);
    reorder();
    selectFirst();
  };

  var populateSuggestion = function(index, suggestion) {
    var li = jQuery(itemTemplate)
      .clone()
      .appendTo(projectsContainer)
      .click(selectSuggestion);

    li.find('.text').text(suggestion)

    if (jQuery.inArray(suggestion, todaysProjects) != -1)
      li.addClass('today');
    else if (jQuery.inArray(suggestion, yesterdaysProjects) != -1)
      li.addClass('yesterday');
  };

  var reorder = function() {
    projectsContainer.find('li.yesterday').each(function(index, el) {
      projectsContainer.prepend(el);
    });
    projectsContainer.find('li.today').each(function(index, el) {
      projectsContainer.prepend(el);
    });
  };

  var selectSuggestion = function() {
    projectInput.val(jQuery(this).find('.text').text());
    hide();
    publishChange();
  };

  var getSuggestions = function() {
    var projectText = projectInput.val().toLowerCase();
    if (projectText == '')
      return recentProjects;

    var re = regEx.squishyMatch(projectText);
    var suggestions = [];
    jQuery.each(recentProjects, function(index, project) {
      if (re.test(project.toLowerCase()))
        suggestions.push(project);
    });
    return suggestions;
  };

  var hide = function() {
    if(!showing)
      return;

    deselectAll();
    projectsContainer.hide();
    showing = false;
  };

  var onBlur = function() {
    setTimeout(hide, 200);
  };

  var onKeyUp = function(e) {
    switch (e.key) {
      case 'Enter':
        useSelected();
        break;
      case 'Escape':
        hide();
        break;
      case 'ArrowUp':
        selectUp();
        break;
      case 'ArrowDown':
        selectDown();
        break;
      default:
        considerShowing();
    }
  };

  var considerShowing = function() {
    var suggestions = getSuggestions();
    if (suggestions.length == 0) {
      hide();
      return;
    }
    populate(suggestions);
    show();
  };

  var selectUp = function() {
    ensureShowing();

    selectedIndex--;
    selectedIndex = Math.max(selectedIndex, 0);
    showSelected();
  };

  var selectDown = function() {
    selectedIndex++;
    selectedIndex = Math.min(selectedIndex, getSuggestions().length -1);
    showSelected();
  };

  var selectFirst = function() {
    selectedIndex = 0;
    showSelected();
  };

  var showSelected = function() {
    deselectAll();
    projectsContainer.find('li').eq(selectedIndex).addClass('selected');
  };

  var deselectAll = function() {
    projectsContainer.find('.selected').removeClass('selected');
  };

  var useSelected = function() {
    projectsContainer.find('.selected').click();
  };

  var ensureShowing = function() {
    if (projectsContainer.is(':hidden'))
      show();
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
