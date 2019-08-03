var FieldBuilder = function() {
  
  var booleanFieldBuilder = new BooleanFieldBuilder();
  var buttonFieldBuilder = new ButtonFieldBuilder();
  var integerFieldBuilder = new IntegerFieldBuilder();

  return {
    build:function(config, container) {
      switch (config.type) {
        
        case 'boolean':
          booleanFieldBuilder.build(config,  container);
          break;

        case 'button':
          buttonFieldBuilder.build(config, container);
          break;

        case 'integer':
          integerFieldBuilder.build(config, container);
          break;

        default:
          throw 'Invalid FieldBuilder type';
      }

    }
  };

};