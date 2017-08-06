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
		updateDisplay();
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
		if (localStorage.getItem('theme') != 'theme_dark')
			localStorage.setItem('theme', 'theme_dark');
		else
			localStorage.setItem('theme', 'theme_light');
		updateDisplay();
	};

	var updateDisplay = function() {
		if (localStorage.getItem('theme') == 'theme_dark') {
			body.addClass('theme_dark');
			buttonIcon.removeClass('fa-moon-o').addClass('fa-sun-o');
			buttonText.text('Light');
		} else {
			body.removeClass('theme_dark');
			buttonIcon.removeClass('fa-sun-o').addClass('fa-moon-o');
			buttonText.text('Dark');
		}
	};

	init();
};
