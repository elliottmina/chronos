var GoalPieChartBuilder = function() {
  return {
    build:function(el, primaryColor, secondaryColor) {
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
            backgroundColor:[primaryColor, secondaryColor],
            hoverBackgroundColor:[primaryColor, secondaryColor],
            borderWidth:1
          }]
        }
      });
    }
  }
};
