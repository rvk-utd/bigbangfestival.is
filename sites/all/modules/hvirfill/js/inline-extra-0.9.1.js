// inline extra version 0.9.0

(function() {

    var  __extends = InlineExpose('__extends');
    var Action = InlineExpose('Action');

    // ElementLoad

    var ElementLoad = (function(_super) {

        __extends(ElementLoad, _super);

        function ElementLoad(inline) {
            _super.call(this, inline);
            this.method = undefined;
            this.src = undefined;
        }

        ElementLoad.prototype.script = function(src) {
            this.method = '$script';
            this.src = src;
            return this;
        }

        ElementLoad.prototype.img = function(src) {
            this.method = '$img';
            this.src = src;
            return this;
        }

        ElementLoad.prototype.$script = function() {
            var elm = document.createElement('script');
            elm.type = 'text/javascript'
            document.body.appendChild(elm);
            return elm;
        }

        ElementLoad.prototype.$img = function() {
            return new Image();
        }

        ElementLoad.prototype.run = function() {
            var elm = this[this.method]();
            elm.src = this.src;
            elm.onload = this.onSuccess.bind(this, elm);
            elm.onerror = function(err) {
                throw new Error(err);
            }
        }

        return ElementLoad;

    })(Action);

    Inline.prototype.script = function(src) {
            return this.registerAction(new ElementLoad(this).script(src));
    }

    Inline.prototype.img = function(src) {
        return this.registerAction(new ElementLoad(this).img(src));
    }

    // FacebookInit

    var FacebookInit = (function(_super) {

        __extends(FacebookInit, _super);

        function FacebookInit(inline) {
            _super.call(this, inline);
        }

        FacebookInit.prototype.init = function(appId) {
            var callback = this.onSuccess.bind(this);
            window.fbAsyncInit = function() {
                FB.init({
                    appId      : appId,
                    xfbml      : true,
                    cookie     : true,
                    version    : 'v2.4'
                });
                callback();
            }
            return this;
        }

        FacebookInit.prototype.run = function() {
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.com/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

        return FacebookInit;

    })(Action);

    Inline.prototype.facebookInit = function(appId) {
        return this.registerAction(new FacebookInit(this).init(appId));
    }

    // FacebookAPI

    var FacebookAPI = (function(_super) {

        __extends(FacebookAPI, _super);

        function FacebookAPI(inline) {
            _super.call(this, inline);
            this.func = function(){};
            this.args = [];
        }

        FacebookAPI.prototype.use = function(func, args) {
            this.func = func;
            this.args = args;
            return this;
        }

        FacebookAPI.prototype.run = function() {
            this.args.push(this.onSuccess.bind(this));
            this.func.apply(window, this.args);
        }

        return FacebookAPI;

    })(Action);

    Inline.prototype.facebookAPI = function(func) {
        var args = Array.prototype.slice.call(arguments);
        var func = args.shift();
        return this.registerAction(new FacebookAPI(this).use(func, args));
    }

})();