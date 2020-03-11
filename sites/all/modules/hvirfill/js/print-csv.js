
(function() {

    var hvirfill = 'https://hvirfillcache.reykjavik.is/find'
    var code = HVIRFILL.data.code;
    var token = HVIRFILL.data.token;
    var hidden = HVIRFILL.data.hidden;

    var inline = new Inline();

    var bind = {
        events: [],
    }

    var params = {};
    params.all = 'barnamenningahatid.is';
    params.f = '2018-04-17';
    params.t = '2018-04-22';
    params.limit = 500;
    params.sort = 'start';
    if (hidden.length) {
    params.skip = hidden.join(',');
    }
    inline.jsonp(hvirfill, params).put(bind, 'events').run(inline.log);

    var template = document.getElementById('content');
    rivets.bind(template, {app: bind});
    template.style.display = '';

    setTimeout(function(){
    $("br").each(function() {
        console.log('br');
      $( this ).remove();
    });
 }, 1500);

})(jQuery);
