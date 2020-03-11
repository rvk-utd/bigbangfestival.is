
(function() {

    var code = HVIRFILL.data.code;
    var token = HVIRFILL.data.token;
    var hidden = HVIRFILL.data.hidden;

    var inline = new Inline({debug: true});

    var bind = {
        events: [],
    }

    var params = {};
    params.all = 'barnamenningarhatid.is';
    params.range = '2018-04-17,2018-04-23';
    params.limit = 500;
    params.sort = 'start';
    if (hidden.length)
        params.skip = hidden.join(',');

    inline.post('/hvirfill-get-bookmarks', {code: code, token: token}).run(function(data) {
        if (data.length) {
            params._id = data.join(',');
            inline.jsonp('https://hvirfill.reykjavik.is/find', params).put(bind, 'events').run(inline.log);
        }
    });

    var template = document.getElementById('content');
    rivets.bind(template, {app: bind});
    template.style.display = '';



})(jQuery);
