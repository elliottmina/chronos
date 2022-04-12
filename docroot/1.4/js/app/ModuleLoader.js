var ModuleLoader = function() {

  return {
    load:function(moduleNames) {
      var modules = jQuery.map(moduleNames, function(moduleName, index) {
        return new moduleName();
      });

      jQuery.each(modules, function(index, module) {
        if (typeof module.ready === 'function')
          module.ready();
      });
    }
  };

};
