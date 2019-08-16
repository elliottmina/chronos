var TimeFormatter12Hr = function() {

  var getHours = function(dateObj) {
    var hours = dateObj.getHours();
    
    if (hours == 0)
      return 12;

    if (hours > 12)
      hours = hours -12;
    
    return hours;
  };

  var getMinutes = function(dateObj) {
    var minutes = dateObj.getMinutes().toString();
    if (minutes.length == 1)
      minutes = '0' + minutes;
    return minutes;
  };

  var getAmPm = function(dateObj) {
    if (dateObj.getHours() >= 12)
      return 'PM';
    return 'AM';
  };

  return {
    format:function(dateObj) {
      return getHours(dateObj) + ':' + 
        getMinutes(dateObj) + ' ' +
        getAmPm(dateObj);
    }
  };
};