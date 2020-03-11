(function() {

    var TRANSLATION = {
        'Search': 'Leita',
        'Day': 'Dagur',
        'Add': 'Bæta við',
        'Remove': 'Fjarlægja',
        'Information': 'Upplýsingar',
        'Time and date': 'Tímasetning',
        'Location': 'Staðsetning',
        'Address': 'Heimilisfang',
        'Event media': 'Hlekkir',
        'Website': 'Vefsíða',
        'Link': 'Hlekkur',
        'Share': 'Deila',
        'My program': 'Mín dagskrá',
        'All events': 'Allir viðburðir',
        'top of page': 'efst á síðu',
        'your choice': 'þitt val',
        
        'category': 'flokkur',
        'neighbourhood': 'hverfi',
        'region': 'hverfi',
        'category': 'flokkur',
        'hours': 'tímar',
        'Reykjavík city hall': 'Ráðhús Reykjavíkur',
        'my events': 'mínir viðburðir',
        'Advanced search': 'Ítarlegri leit',
        'all': 'allir',
        'Program': 'Dagskrá',
        'all events': 'allir viðburðir',
        'no events found': 'engir viðburðir fundust',
        'Print program': 'Prenta dagskrá',
        'share my events with anothe device': 'deila mínum viðburðum með öðru tæki',
        'you have to authenticate with facebook to use the program features. being authenticated you can transfer your program between devices by being logged into facebook' : 'Þú verður að skrá þig inn á facebook til að nota dagskráar eiginleika vefsíðunnar. eftir innskráningu getur þú fært þína dagskrá á milli tækja með því að vera innskráður á facebook',
        'print': 'prenta',

        'cancel' : 'Hætta við',
        'ok' : 'í lagi',
    }

    var capitalize = function(str) {
        return str.substr(0, 1).toUpperCase() + str.substr(1);
    }

    HVIRFILL = {};

    HVIRFILL.i18n = function(text) {
        if (typeof text !== 'string')
            text = typeof text;
        if (HVIRFILL.lang === 'is')
            var text = TRANSLATION[text] || text;
        return text;
    }

})();