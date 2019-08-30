var Rounder = {
  roundDecimal:function(num, orders) {
    var multiplier = Math.pow(10, orders);
    return Math.trunc(num*multiplier)/multiplier;
  }
};