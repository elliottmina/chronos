var RegEx = function() {
  
  return {
    delimiter:function(charsStr) {
      var rePattern = '[\\' + charsStr.split('').join('|\\') + ']';
      return new RegExp(rePattern, 'g');
    }
  };

};
