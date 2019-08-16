var DateLine = function() {

  var html = `
    <h1></h1>
    <h2><span class="day"></span></h2>`;
  
  var topContainer;
  var dateContainer;
  var dayOfWeekContainer;
  var timeUtil;
  var dateYmd;

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
  
  var init = function() {
    gatherDependencies();
    build();
    addBehavior();
  };

  var gatherDependencies = function() {
    timeUtil = new TimeUtil();
  };

  var build = function() {
    topContainer = jQuery('#DateLine');
    topContainer.html(html);
    dayOfWeekContainer = topContainer.find('h1');
    dateContainer = topContainer.find('h2');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    setInterval(updateTodayTreatment, 1000*60*10);
  };

  var onDateChanged = function(data) {
    date = timeUtil.parseUtcYmd(data.date);
    month = parseInt(date.getUTCMonth()) +1;

    dateContainer.text(
      month + '/' + date.getUTCDate());

    dayOfWeekContainer.text(days[date.getUTCDay()]);
    dateYmd = data.date;
    updateTodayTreatment();
  };

  var updateTodayTreatment = function() {
    if (dateYmd == timeUtil.getYmd(new Date()))
      topContainer.addClass('today');
    else 
      topContainer.removeClass('today');
  }

  init();

};
