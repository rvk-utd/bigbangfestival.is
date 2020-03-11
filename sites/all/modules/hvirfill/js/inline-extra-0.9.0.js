// inline extra version 0.9.0

(function() {

    var pass = function(){};
    var __extends = InlineExpose('__extends');
    var Action = InlineExpose('Action');

    // FacebookAPI

    var Facebook = (function(_super) {

        __extends(Facebook, _super);

        function Facebook(inline, func, args) {
            _super.call(this, inline);
            this.func = func || pass;
            this.args = args || [];
        }

        Facebook.prototype.run = function() {
            this.args.push(this.onSuccess.bind(this));
            this.func.apply(window, this.args);
        }

        return Facebook;

    })(Action);

    Inline.prototype.facebook = function() {
        var args = Array.prototype.slice.call(arguments);
        var func = args.shift();
        return this.registerAction(new Facebook(this, func, args));
    }

})();