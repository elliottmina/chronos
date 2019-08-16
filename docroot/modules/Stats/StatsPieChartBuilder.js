var StatsPieChartBuilder = function() {
  
  return {
    build:function(el) {
      return new Chart(el,{
        type:'pie',
        options:{
          title:{
            display:true,
            text:'test'
          },
          responsive:false,
          animation:{
            duration:0,
            animateRotate:false
          },
          legend:{
            position:'bottom',
            display:true
          }
        },
        data:{
          datasets:[{
            data:[]
          }]
        }
      });
    }
  };

};
