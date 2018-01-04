var SummaryNav = function() {

	var tabs;
	var sections;

	var init = function() {
		sections = jQuery('#summaries section');
		tabs = jQuery('#summary_nav li');
		tabs.click(select);
		tabs.get(0).click();

	};

	var select = function() {
		var el = jQuery(this);
		var index = el.index();
		
		sections.hide();
		tabs.removeClass('selected');
		
		jQuery(tabs.get(index)).addClass('selected');
		jQuery(sections.get(index)).show();
	};

	init();
};
