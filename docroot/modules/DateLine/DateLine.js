var DateLine = function() {

  var html = `
    <h1>
      <day-of-week></day-of-week>
      <date>
        <month></month>/<day></day>
      </date>
      <today>(today)</today>
    </h1>
    `;
  
  var topContainer;
  var monthContainer;
  var dayContainer;
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
    monthContainer = topContainer.find('month');
    dayContainer = topContainer.find('day');
    dayOfWeekContainer = topContainer.find('day-of-week');
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    setInterval(updateTodayTreatment, 1000*60*10);
  };

  var onDateChanged = function(data) {
    date = timeUtil.parseUtcYmd(data.date);
    month = parseInt(date.getUTCMonth()) +1;

    dateYmd = data.date;

    monthContainer.text(month);
    dayContainer.text(date.getUTCDate());
    dayOfWeekContainer.text(days[date.getUTCDay()]);
    updateTodayTreatment();
  };

  var updateTodayTreatment = function() {
    if (dateYmd == timeUtil.getLocalYmd(new Date()))
      topContainer.addClass('today');
    else 
      topContainer.removeClass('today');
  }

  init();

};
