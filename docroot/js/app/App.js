var App = function() {

	return {
		init:function(moduleNames) {
			this.dispatcher = new Dispatcher();
			this.persister = new LocalStoragePersister();
      this.settings = new Settings();
			new ModuleLoader().load(moduleNames);
		}
	};
}();
