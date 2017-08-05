var Blasticator = function() {

	var html = `
		<span class="mini_button blasticate">
			<i class="fa fa-trash"></i> Blasticate
		</span>`;

	var init = function() {
		build();
		addBehavior();
	};

	var build = function() {
		$('#Blasticator').html(html);
	};

	var addBehavior = function() {
		$('#Blasticator').find('.mini_button').click(showDialogue);
	};

	var showDialogue = function() {
		new ModalDialogue({
			message:'This will destroy EVERYTHING.  FOREVER.',
			buttons:[{
				label:'Keep my data',
				role:'secondary',
				autoClose:true
			},{
				label:'Destory EVERYTHING.  FOREVER',
				role:'primary',
				autoClose:true,
				callback:function() {
					App.persister.clear();
					window.location.reload(true);
				}
			}]
		});
	};

	init();
};
