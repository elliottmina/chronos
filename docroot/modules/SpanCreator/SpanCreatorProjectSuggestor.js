var SpanCreatorProjectSuggestor = function(
	recentProjectBuilder, 
	todaysProjectBuilder) {

	var itemTemplate = `<li class="suggestion"></li>`;
	var projectsContainer;
	var recentProjects;
	var todaysProjects;
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
		projectInput.focus(show);
		projectInput.blur(onBlur);
		App.dispatcher.register('SPAN_SAVED', onSpanSaved);
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

		populate();
		projectsContainer.show();
		bindKeys();
		showing = true;
	};

	var populate = function() {
		var suggestions = getSuggestions();
		if (suggestions.length == 0) {
			hide();
			return;
		}

		todaysProjects = todaysProjectBuilder.build();
		projectsContainer.empty();
		jQuery.each(suggestions, populateSuggestion);
		selectFirst();
	};

	var populateSuggestion = function(index, suggestion) {
		var li = jQuery(itemTemplate)
			.clone()
			.appendTo(projectsContainer)
			.text(suggestion)
			.click(selectSuggestion);

		if (jQuery.inArray(suggestion, todaysProjects) != -1) {
			li.addClass('today');
			jQuery('<i class="far fa-clock-o"></i>')
				.appendTo(li);
		}
	};

	var selectSuggestion = function() {
		projectInput.val(jQuery(this).text());
		hide();
	};

	var getSuggestions = function() {
		var projectFilter = projectInput.val().toLowerCase();
		var re = new RegExp(projectFilter.split('').join('.*'));

		if (projectFilter == '')
			return recentProjects;

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
		unbindKeys();
		showing = false;
	};

	var onBlur = function() {
		setTimeout(hide, 100);
	};

	var bindKeys = function() {
		projectInput.keyup(onKeyUp);
	};

	var unbindKeys = function() {
		projectInput.unbind('keyup', onKeyUp);
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
				populate();
		}
	};

	var selectUp = function() {
		ensureShowing();

		selectedIndex--;
		selectedIndex = Math.max(selectedIndex, 0);
		showSelected();
	};

	var selectDown = function() {
		ensureShowing();

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

	init();

	return {
		getProject:function() {
			return jQuery.trim(projectInput.val());
		},
		clear:function() {
			projectInput.val('');
		},
		focus:function() {
			projectInput.focus();
		},
		set:function(val) {
			projectInput.val(val);
		}
	};

};
