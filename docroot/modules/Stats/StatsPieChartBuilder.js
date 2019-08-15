var StatsPieChartBuilder = function() {
  
  return {
    build:function(el) {
      return new Chart(el,{
        type:'pie',
        options:{
          responsive:true,
          animation:{
            duration:0,
            animateRotate:false
          }
        },
        data:{
          datasets:[{
            data:[],
            // backgroundColor:[color, 'transparent'],
            // hoverBackgroundColor:[color, 'transparent'],
            // borderWidth:0
          }]
        }
      });
    }
  };

};
