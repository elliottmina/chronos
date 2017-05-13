var JsonImportDialogue = function(processFunc) {
	
	var modalContents = `<input type="file" />`;
	var fileInput;
	var dialogue;
	var okToImport = false;

	var init = function() {
		build();
		addBehavior();
	};

	var build = function(processFunc) {
		var contents = jQuery('<span>').html(modalContents);
		fileInput = contents.find('input');

		dialogue = new ModalDialogue({
			message:'Select import file',
			buttons:[{
				label:'Maybe not',
				role:'secondary',
				autoClose:true
			},{
				label:'Import.',
				role:'primary',
				callback:onImport
			}],
			contents:contents
		});
	};

	var addBehavior = function() {
		fileInput.change(onFileInputChange);
	};

	var onFileInputChange = function() {
		var files = fileInput.get(0).files;
		
		if (files.length == 1) 
			okToImport = true;
		else 
			okToImport = false;
	};

	var onImport = function() {
		if (okToImport) {
			dialogue.close();
			processFunc(fileInput.get(0).files[0]);
		}
	};

	init();

};
