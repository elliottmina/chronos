var JsonExport = function() {

	var html = `
		<span class="mini_button export">
			<i class="fa fa-download"></i> Export
		</span>`;
	var button;
	var padder;
	var collector;
	var downloader;

	var init = function() {
		gatherDependencies();
		build();
		addBehavior();
	};

	var gatherDependencies = function() {
		padder = new Padder();
		collector = new JsonExportCollector(new TimeUtil());
		downloader = new Downloader();
	};

	var build = function() {
		var renderTo = jQuery('#JsonExport');
		renderTo.html(html);
		button = renderTo.find('.mini_button');
	};

	var addBehavior = function() {
		button.click(exportRecords);
	};

	var exportRecords = function() {
		var now = new Date();
		var dateStr = 
			now.getFullYear() + '-' +
			padder.twoDigit(now.getMonth()) + '-' +
			padder.twoDigit(now.getDate()) + ' ' +
			now.getHours() + ':' +
			now.getMinutes() + ':' +
			now.getSeconds();

		downloader.download(
			'Export ' + dateStr + '.json',
			'application/json', 
			JSON.stringify(collector.collect()));
	};


	init();

};
