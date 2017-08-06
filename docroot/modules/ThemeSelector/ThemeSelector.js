var ThemeSelector = function() {
	

	var html = `
		<span class="mini_button">
			<i class="fa fa-moon-o"></i> <span class="text">Dark</span>
		</span>`;
	var body;
	var buttonIcon;
	var buttonText;

	var init = function() {
		build();
		gatherComponents();
		addBehavior();
	};

	var build = function() {
		jQuery('#ThemeSelector').html(html);
	};

	var gatherComponents = function() {
		body = jQuery(document.body);
		buttonText = jQuery('#ThemeSelector .mini_button .text');
		buttonIcon = jQuery('#ThemeSelector .mini_button i');
	};

	var addBehavior = function() {
		jQuery('#ThemeSelector .mini_button').click(toggle);
	};

	var toggle = function() {
		if (body.hasClass('theme_dark')) {
			body.removeClass('theme_dark');
			buttonIcon.removeClass('fa-sun-o').addClass('fa-moon-o');
			buttonText.text('Dark');
		} else {
			body.addClass('theme_dark');
			buttonIcon.removeClass('fa-moon-o').addClass('fa-sun-o');
			buttonText.text('Light');
		}
	};

	init();
};
