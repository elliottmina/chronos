var ServiceRequest = function(config) {

  var callbackWrapper = function(response) {
    response.json().then(config.callback);
  };

  return {
    go:function() {
      var params = {
        method:config.method,
      };
      if (config.data)
        params.body = JSON.stringify(config.data);

      fetch(config.url, params).then(callbackWrapper);
    }
  };
};
