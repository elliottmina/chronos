var SpanCreatorAnalyzer = function() {

  var hasColon = function(text) {
    return text.indexOf(':') > -1;
  };

  var isCorrectFormat = function(text) {
    return text.match(/^[0-9]+:[0-9]{2}$/) !== null;
  };

  return {
    isColonable:function(text) {
      return text.length >= 1 && !hasColon(text);
    },
    hasDanglingColon:function(text) {
      return text.substr(text.length-1) == ':';
    },
    isValid:function(text) {
      if (!isCorrectFormat(text))
        return false;
      var parts = text.split(':');
      if (parts[0] < 0 || parts[0] > 12)
        return false;
      if (parts[1] < 0 || parts[1] > 59)
        return false;
      return true;
    },
    isNumerable:function(text) {
      return text.match(/^[0-9]?$/) != null || 
        text.match(/^[0-9]+:[0-9]?$/);
    },
    isHoursOnly:function(text) {
      return text.match(/^[0-9]{1,2}$/)
    },
    isCorrectFormat:isCorrectFormat
  };
};
