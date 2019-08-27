var SpanCreatorTimeResolver = function(analyzer) {

  var rpadTime = function(str) {
    return str + Array(2 - str.length+1).join(0);
  };

  return {
    resolve:function(text) {
      if (analyzer.isValid(text))
        return text;

      if (text == '')
        return text;

      if (analyzer.isHoursOnly(text))
        return text + ':00';

      var parts = text.split(':');
        return parts[0] + ':' + rpadTime(parts[1]);
    }
  }
};
