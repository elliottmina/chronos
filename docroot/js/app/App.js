var App = function() {

  return {
    init:function(moduleNames) {
      this.dispatcher = new Dispatcher();
      this.persister = new LocalStoragePersister();
      this.settings = new Settings();
      this.globalSettings = new GlobalSettings();
      this.projectSegmentor = new ProjectSegmentor();
      this.colorGenerator = new ColorGenerator();
      new ModuleLoader().load(moduleNames);
    }
  };
}();
