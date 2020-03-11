(function($) {

    // formatters

    var BASE_URL = window.location.href.split('?')[0]

    rivets.formatters.i18n = function(text) {
        return HVIRFILL.i18n(text);
    }

    rivets.formatters.inverse = function(bool) {
        return !bool;
    }

    rivets.formatters.date = function(iso) {
        return moment(iso).locale(HVIRFILL.lang).format('Do MMMM');
    }

    rivets.formatters.time = function(iso) {
        return iso.substr(11, 5);
    }

    rivets.formatters.datetime = function(iso) {
        return moment(iso).locale(HVIRFILL.lang).format('Do MMMM hh:mm');
    }

    rivets.formatters.timerange = function(item) {
        return item.start.substr(11, 5) + ' - ' + item.end.substr(11, 5);
    }

    rivets.formatters.address = function(item) {
        return [item.street, item.postal, item.city].join(' ');
    }

    rivets.formatters.splitter = function(item) {
        if (HVIRFILL.splitter === item.splitter)
            return false;
        HVIRFILL.splitter = item.splitter;
        return true;
    }

    rivets.formatters.link = function(item) {
        return BASE_URL + '?event=' + item._id;
    }

    rivets.formatters.facebookurl = function(facebook) {
        if (facebook.substring(0, 7) === 'http://' || facebook.substring(0, 8) === 'https://')
            return facebook;
        return 'http://www.facebook.com/' + facebook;
    }

    rivets.formatters.youtubeurl = function(youtube) {
        if (youtube.substring(0, 7) === 'http://' || youtube.substring(0, 8) === 'https://')
            return facebook;
        return 'http://www.youtube.com/watch?v=' + youtube;
    }

    //binders

    rivets.binders.i18n = function(el, text) {
        el.textContent = HVIRFILL.i18n(text);
    }

    rivets.binders['img-*'] = function(el, item) {
        var size = this.args[0] || 'medium'
        el.src = HVIRFILL.url + '/images/' + item.image[size];
    }

    rivets.binders['lang-*'] = function(el, item) {
        var key = this.args[0] || 'title'
        el.textContent = item.language[HVIRFILL.lang][key];
    }

    rivets.binders['fa-*'] = function(el, bool) {
        var cls = 'fa-' + this.args[0] || 'undefined';
        if (bool)
            $(el).addClass(cls);
        else
            $(el).removeClass(cls);
    }

    rivets.binders.log = function(el, item) {
        console.log(item);
    }

})(jQuery);