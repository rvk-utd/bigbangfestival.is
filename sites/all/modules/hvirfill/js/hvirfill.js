
HVIRFILL.splitter = 0;
HVIRFILL.url = 'https://hvirfill.reykjavik.is';
//HVIRFILL.url = 'http://localhost:8080';

(function($) {
    var self = this;

    var inline = window.inline = new Inline({debug: true});
    var bookmark = window.bookmark = inline.copy(true);

    var getUrl = HVIRFILL.url + '/get';
    var findUrl = HVIRFILL.url + '/find';
    var baseUrl = window.location.href.split('?')[0];

    var map, marker;
    var mobileWidth = 767;

    var lang = HVIRFILL.lang;
    var bookmarks = [];

    var bind = window.bind = {
        lang: lang,
        loading: false,
        noMore: false,
        events: [],
        modal: null,
        isMap: false,
        isMobile: window.innerWidth < mobileWidth,
        isBookmarkMode: false,
        isRCH: false,
    };

    // Query

    var index = -1;
    var searchString = '';
    var tags = 'barnamenningarhatid.is';
    var fullDateRange = '2019-04-09,2019-04-15';
    var dateRange = fullDateRange;
    var hidden = HVIRFILL.data.hidden;
    var eventId = HVIRFILL.data.uid;
    var isNoMore = false;

    var LIMIT = 30;
    var offset = 0;
    var limit = LIMIT;

    var getParams = function() {
        var params = {};
        params.search = searchString;
        params.lang = lang;
        params.all = tags;
        params.range = dateRange;
        params.limit = limit;
        params.offset = offset;
        params.sort = 'start';
        if (hidden.length)
            params.skip = hidden.join(',');
        return params;
    }

    var getBookmarkParams = function() {
        var params = {};
        params._id = bookmarks.join(',');
        params.all = 'barnamenningarhatid.is';
        params.range = fullDateRange;
        params.limit = 500;
        params.sort = 'start';
        if (hidden.length)
            params.skip = hidden.join(',');
        return params;
    }

    var modify = function(item) {
        item.splitter = new Date(item.start.split('T')[0]).getTime();
        item.bookmarked = bookmarks.indexOf(item._id) !== -1;
        return item;
    }

    var getEvents = function() {
        offset = 0;
        HVIRFILL.splitter = 0;
        bind.noMore = false;
        bind.loading = true;
        var params = bind.isBookmarkMode ? getBookmarkParams() : getParams();
        var future = inline.jsonp(findUrl, params).fallback([]).map(modify);
        future.put(bind, 'events');
        future.fin(bind, 'loading', false);
    }

    var moreEvents = function() {
        if (bind.loading || bind.noMore)
            return;

        offset += limit;
        bind.loading = true;

        var future = inline.jsonp(findUrl, getParams()).fallback([]);

        future.each(function(item) {
            bind.events.push(modify(item));
        });

        future.put(bind, 'noMore', 'data.length === 0');
        future.fin(bind, 'loading', false);

        return;
    }

    // Filter

    bind.search = function(e) {
        searchString = e.target.value;
        inline.finish();
        inline.sleep(300);
        getEvents();
    }

    bind.selectDay = function(e) {
        if (dateRange === e.target.value)
            return;
        dateRange = e.target.value;
        getEvents();
    }

    bind.selectCat = function(e) {
        if (bind.isRCH)
            tags = 'barnamenningarhatid.is,ráðhús reykjavíkur';
        else
            tags = 'barnamenningarhatid.is';
        getEvents();
    }

    bind.reset = function(e) {
        searchString = document.getElementById('search-input').value = '';
        dateRange = document.getElementById('date-input').value = '2019-04-09,2019-04-15';
        tags = 'barnamenningarhatid.is';
        bind.isRCH = false;
        getEvents();
    }

    // Modal

    var renderModal = function(data) {
        bind.isMap = false;
        bind.modal = data;
        $('#modal').scrollTop(0);
    }

    bind.openModal = function(a, obj) {
        index = obj.index;
        renderModal(obj.item);
        $('#modal').modal('show');
    }

    bind.closeModal = function() {
        $('#modal').modal('hide');
    }

    bind.next = function(e) {
        if (bind.events.length === index + 1) {
            if (bind.loading || bind.noMore)
                return;
            moreEvents();
            inline.run(bind.next, e);
            return;
        }
        renderModal(bind.events[++index]);
    }

    bind.prev = function(e) {
        if (index < 1)
            return;
        renderModal(bind.events[--index]);
    }

    bind.toggleMap = function(e) {
        if (bind.isMap) {
            bind.isMap = false;
            return;
        }

        bind.isMap = true;
        google.maps.event.trigger(map, 'resize');
        var coords = bind.modal.location;
        var position = new google.maps.LatLng(coords[0], coords[1]);
        marker.setPosition(position);
        map.setZoom(15);
        map.setCenter(position);
    }

    bind.share = function(e) {
        if (!bind.modal)
            return;
        var url = window.location.href.split('?')[0];
        url += '?event=' + bind.modal._id;
        var shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + escape(url);
        var popupParams = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600';
        window.open(shareUrl, '', popupParams);
    }

    // Boookmark

    var isAuthenticated = false;
    var facebookUid = '';
    var bookmarkToken = HVIRFILL.data.token;
    var bookmarkBusy = false;

    var bookmarkNotBusy = function() {
        bookmarkBusy = false;
    }

    var loginStatus = function(user) {
        return user.status === 'connected';
    }

    var authenticate = function(method) {
        if (bookmarkBusy)
            return;

        var bindBookmarks = function(data) {
            bookmarks = data;
            for (var i=0; i<bind.events.length; i++) {
                var item = bind.events[i];
                if (bookmarks.indexOf(item._id) !== -1)
                    item.bookmarked = true;
            }
            isAuthenticated = true;
        }

        bookmarkBusy = true;
        bookmark.facebook(method).check(loginStatus).run(function(data) {
            facebookUid = data.authResponse.userID;
            var query = {code: facebookUid, token: bookmarkToken};
            bookmark.post('/hvirfill-get-bookmarks', query).run(bindBookmarks);
        });

        bookmark.fin(bookmarkNotBusy);
    }

    var toggleBookmark = function(item) {
        var uid = item._id;
        var query = {uid: uid, code: facebookUid, token: bookmarkToken};
        var index = bookmarks.indexOf(uid);

        if (index === -1) {
            item.bookmarked = true;
            bookmarks.push(uid);
            bookmark.post('/hvirfill-add-bookmark', query);
        } else {
            item.bookmarked = false;
            bookmarks.splice(index, 1);
            bookmark.post('/hvirfill-del-bookmark', query);
            if (bind.isBookmarkMode) {
                bind.events.splice(bind.events.indexOf(item), 1);
            }
        }
    }

    var bookmarkMode = function() {
        bind.isBookmarkMode = true;

        if (!bookmarks.length) {
            HVIRFILL.splitter = offset = 0;
            bind.events = [];
            return;
        }

        getEvents();
    }

    bind.toggleBookmark = function(e, obj) {
        var item = (typeof obj.item !== 'undefined') ? obj.item : bind.modal;

        if (!isAuthenticated)
            authenticate(FB.login);

        bookmark.run(toggleBookmark, item).last();
    }

    bind.bookmarkMode = function() {
        if (bind.isBookmarkMode) {
            bind.isBookmarkMode = false;
            getEvents();
            return;
        }

        if (!isAuthenticated)
            authenticate(FB.login);

        bookmark.run(bookmarkMode).last();
    }

    bind.printEvents = function() {
        window.open('/hvirfill-print-events?code=' + facebookUid, '_blank');
    }

    //  Admin

    bind.adminHide = function() {
        if (!bind.modal)
            return;

        var event_id = bind.modal.event_id;
        inline.post('/hvirfill-hide-event', {event_id: event_id}).run(function(data) {
            hidden.push(event_id);
            getEvents();
            bind.closeModal();
        });
    }

    // Init

    var template = document.getElementById('hvirfill');
    rivets.bind(template, {app: bind});
    template.style.display = '';

    var check = function(item) {
        if (hidden.indexOf(item._id) !== -1)
            return false;
        return item.language.is.tags.indexOf('barnamenningarhatid.is') !== -1;
    }

    var tomorrow = function(iso) {
        var date = new Date(iso);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    }

    var indexOf = function(item) {
        for (var i=0; i<bind.events.length; i++) {
            if (bind.events[i]._id === item._id)
                return i;
        }
        return -1;
    }

    if (eventId.length) {

        inline.jsonp(getUrl, {_id: eventId}).check(check).modify(modify).run(function(data) {
            index = 0;
            renderModal(data);
            $('#modal').modal('show');
            bind.events = [data];

            limit = 1000;
            dateRange = '2019-04-09,' + tomorrow(data.start);
        });
    }

    inline.run(getEvents);

    inline.run(function() {

        if (bind.modal) {
            index = indexOf(bind.modal);
            limit = LIMIT;
            dateRange = fullDateRange;
        }

        // window events

        window.addEventListener('resize', function() {
            bind.isMobile = window.innerWidth < mobileWidth;
        });

        window.onscroll = function(e) {
            if ($(window).height() + window.scrollY > $('#event-bottom').position().top - 300) {
                if (bind.isBookmarkMode)
                    return;
                moreEvents();
            }
        }

        // load facebook

        window.fbAsyncInit = function() {
            FB.init({
                appId: '109282522806234',
                xfbml: true,
                version: 'v2.4'
            });
            authenticate(FB.getLoginStatus);
        };

        if (typeof FB !== 'undefined') {
            fbAsyncInit();
        }

        // load map

        var center = new google.maps.LatLng(64.1463553, -21.942437);

        var mapOptions = {
            center: center,
            zoom: 15,
            styles: [
                {stylers: [{ saturation: -40 }]},
                {featureType: "road", elementType: "geometry", stylers: [{ lightness: 100 },{ visibility: "simplified" }]}
            ]
        }

        map = new google.maps.Map(document.getElementById('modal-map'), mapOptions);

        marker = new google.maps.Marker({
            position: center,
            map: map,
            title: 'position',
            icon: {
                url: 'sites/all/modules/hvirfill/css/images/marker-icon.png',
                size: new google.maps.Size(40, 55),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(20, 55)
            },
        });
    });

})(jQuery);
