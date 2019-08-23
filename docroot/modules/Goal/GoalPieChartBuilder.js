var GoalPieChartBuilder = function() {
  return {
    build:function(el, color) {
      return new Chart(el,{
        type:'pie',
        options:{
          responsive:false,
          cutoutPercentage:75,
          animation:{
            duration:400,
            animateRotate:false
          },
          tooltips:{
            enabled:false
          }
        },
        data:{
          datasets:[{
            data:[],
            backgroundColor:[color, 'cornflowerblue'],
            hoverBackgroundColor:[color, 'transparent'],
            borderWidth:1
          }]
        }
      });
    }
  }
};
