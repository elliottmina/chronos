var JsonImport = function() {

	var progressTemplate = `<progress></progress>`;
	var processDialogue;

	var init = function() {
		registerSettings();
	};

	var registerSettings = function() {
		App.settings.register([{
			section:'Data',
			label:'Import backup',
			type:'button',
			iconClass:'fa-upload',
			callback:showImportDialogue
		}]);
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
