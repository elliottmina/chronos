var App = function() {

	return {
		init:function(moduleNames) {
			this.dispatcher = new Dispatcher();
			this.persister = new LocalStoragePersister();
      this.settings = new Settings();
      this.globalSettings = new GlobalSettings();
			new ModuleLoader().load(moduleNames);
		}
	};
}();
