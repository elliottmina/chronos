var Blasticator = function() {

  var init = function() {
    registerSettings();
  };

  var showDialogue = function() {
    new ModalDialogue({
      message:'This will destroy EVERYTHING.  FOREVER.',
      buttons:[{
        label:'Keep my data',
        role:'secondary',
        autoClose:true
      },{
        label:'BURN IT ALL',
        role:'primary',
        autoClose:true,
        callback:function() {
          App.persister.clear();
          window.location.reload(true);
        }
      }]
    });
  };

  var registerSettings = function() {
    App.settings.register([{
      section:'Data',
      label:'Clear data',
      type:'button',
      iconClass:'fa-trash',
      callback:showDialogue
    }]);
  };

  init();
};
