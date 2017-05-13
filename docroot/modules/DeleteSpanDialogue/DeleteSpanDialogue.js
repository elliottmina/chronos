var DeleteSpanDialogue = function() {

	var init = function() {
		App.dispatcher.register('DELETE_SPAN_REQUESTED', create);
	};

	var create = function(guid) {
		new ModalDialogue({
			message:'Definitely?',
			buttons:[{
				label:'Maybe not',
				role:'secondary',
				autoClose:true
			},{
				label:'Definitely.',
				role:'primary',
				autoClose:true,
				callback:function() {
					App.dispatcher.update('DELETE_SPAN_SUBMITTED', guid);
				}
			}]
		});
	};

	init();

};
