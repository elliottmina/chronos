var MetaKeyEvaluator = function() {

  return {
    get:function(e) {
      if (e.ctrlKey)
        return e.key.toUpperCase();
    }
  }
};
