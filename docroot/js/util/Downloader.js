var Downloader = function() {
	return {
		download:function(title, mimeType, content) {
			var anchor = jQuery('<a>')
				.hide()
				.appendTo(document.body)
				.text('export')
				.attr('download', title)
        .attr('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content))
			
			anchor.get(0).click();
			anchor.remove();
		}
	};
};
