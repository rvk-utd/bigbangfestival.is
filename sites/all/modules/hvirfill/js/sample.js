(function($) {

    var dateFormat = function(date) {
        return date.toISOString().split('T')[0];
    }

    var randomSample = function(arr, size) {
        if (arr.length < size)
            return arr;
        var sample = [];
        while (sample.length < size) {
            index = Math.floor((sample.length) * Math.random());
            arr.splice(index, 1);
            sample.push(arr[index]);
        }
        return sample;
    }

    var jsonToDate = function(obj) {
        var date = new Date();
        date.setDate(parseInt(obj.day));
        date.setMonth(parseInt(obj.month - 1));
        date.setYear(parseInt(obj.year));
        return date;
    }

    var SampleModel = function () {
        var self = this;

        var inline = new Inline();

        var config = HVIRFILL_SAMPLE_DATA.config;
        var isRandom = config.sample_is_random;
        var eventsNo = parseInt(config.sample_events_no);

        this.server = 'https://hvirfill.reykjavik.is';
        this.events = ko.observableArray([]);
        this.lang = HVIRFILL_SAMPLE_DATA.lang;
        var hidden = HVIRFILL_SAMPLE_DATA.hidden;

        if (config.main_page_path.length)
            this.mainPage = '/' + config.main_page_path + '?event=';
        else
            this.mainPage = 'https://hvirfill.reykjavik.is/events.html#';

        var query = {}
        query.f  = dateFormat(new Date());
        query.sort = 'start';

        if (isRandom)
            query.limit = eventsNo * 5;
        else
            query.limit = eventsNo * 3;

        if (config.tags.length)
            query.tags = config.tags.join(',');
        if (config.is_start_date)
            query.f = dateFormat(jsonToDate(config.start_date));
        if (config.is_end_date)
            query.t = dateFormat(jsonToDate(config.end_date));

        var ids = [];
        var modifyResult = function(data) {
            var modified = [];
            for (var i=0; i<data.length; i++) {
                var item = data[i];
                if (hidden.indexOf(item.event_id) !== -1)
                    continue;
                if (ids.indexOf(item._id) === -1)
                    modified.push(item);
                ids.push(item._id);
            }
            if (modified.length < eventsNo)
                modified = data;
            if (isRandom)
                return randomSample(modified, eventsNo);
            return modified.slice(0, eventsNo);
        }

        var renderResult = function(data) {
            self.events(data);
        }

        var future = inline.jsonp(this.server + '/find', query);
        future.fallback([]);
        future.modify(modifyResult);
        future.apply(renderResult);
    }

     ko.bindingHandlers.dateTime = {
        init: function(element, value, bindings, model, context) {
            var value = ko.unwrap(value());
            var parts = value.split('T');
            var date = parts[0].split('-').reverse().join('.');
            var time = parts[1];
            $(element).text(date + ' ' + time);
        }
    }

    ko.applyBindings(new SampleModel());

})(jQuery);
