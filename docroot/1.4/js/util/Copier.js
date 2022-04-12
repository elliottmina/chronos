var Copier = function()  {
  
  return {
    copy:function(text) {
      var el = jQuery('<textarea>')
        .appendTo(document.body)
        .val(text)
        .select();
      document.execCommand('copy');
      el.remove();
    }
  }
};
