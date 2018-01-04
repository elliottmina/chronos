var JsonImport = function() {

	var html = `
		<span class="mini_button import">
			<i class="fa fa-upload"></i> Import
		</span>`;
	var progressTemplate = `<progress></progress`;
	var processDialogue;

	var init = function() {
		build();
		addBehavior();
	};

	var build = function() {
		var renderTo = jQuery('#JsonImport');
		renderTo.html(html);
		fileInput = renderTo.find('input[type="file"]');
	};

	var addBehavior = function() {
		jQuery('#JsonImport').find('.mini_button').click(showImportDialogue);
	};

	var showImportDialogue = function() {
		new JsonImportDialogue(processFile);
	};

	var processFile = function(file) {
		processDialogue = new ModalDialogue({
			message:'Processing',
			buttons:[],
			contents:jQuery(progressTemplate)
		});

		var reader = new FileReader();
		reader.onload = function() {
			processContents(reader.result);
		};
		reader.readAsText(file);
	};

	var processContents = function(contents) {
		try {
			var json = JSON.parse(contents);
			jQuery.each(json, function(index, record) {
				App.persister.put(record);
			});
			if (processDialogue)
				processDialogue.close();
		} catch (e) {
			if (processDialogue)
				processDialogue.close();
			new ModalDialogue({
				message:'Invalid import. Is your entire life so full of fail?',
				buttons:[{
					label:'Oh poop.',
					role:'secondary',
					autoClose:true
				},{
					label:'Try again.',
					role:'primary',
					autoClose:true,
					callback:showImportDialogue
				}]
			});
		}
	};

	init();
	
};
