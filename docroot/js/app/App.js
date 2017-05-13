var App = function() {

	return {
		init:function(moduleNames) {
			this.dispatcher = new Dispatcher();
			this.persister = new LocalStoragePersister();
			new ModuleLoader().load(moduleNames);
		}
	};
}();
