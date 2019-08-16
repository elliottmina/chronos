var GoalPieChartBuilder = function() {
  return {
    build:function(el, color) {
      return new Chart(el,{
        type:'pie',
        options:{
          responsive:false,
          cutoutPercentage:90,
          animation:{
            duration:0,
            animateRotate:false
          },
          tooltips:{
            enabled:false
          }
        },
        data:{
          datasets:[{
            data:[],
            backgroundColor:[color, 'transparent'],
            hoverBackgroundColor:[color, 'transparent'],
            borderWidth:0
          }]
        }
      });
    }
  }
};
