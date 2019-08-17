var RegEx = function() {
  
  var specialChars = '\\^${}[]().*+?|<>-&'.split('');

  var escapeChar = function(char) {
    if (specialChars.indexOf(char) == -1)
      return char;
    return '\\' + char;
  };

  var buildEscapedChars = function(charsStr) {
    var chars = charsStr.split('');

    for (var i = 0; i < chars.length; i++)
      chars[i] = escapeChar(chars[i]);

    return chars;
  };

  return {
    delimiter:function(charsStr) {
      var chars = buildEscapedChars(charsStr);
      var rePattern = '[' + chars.join('|') + ']';
      return new RegExp(rePattern, 'g');
    },
    squishyMatch:function(charsStr) {
      var chars = buildEscapedChars(charsStr);
      var rePattern = chars.join('.*');
      return new RegExp(rePattern);
    }
  };

};
