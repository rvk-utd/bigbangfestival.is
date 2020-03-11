// inlinejs version 0.9.4

;
(function() {

    var UID = Date.now();

    var pass = function(){}

    var isArray = (function() {
      if (typeof Array.isArray === 'undefined') {
        return function(value) {
            return toString.call(value) === '[object Array]';
        };
      }
      return Array.isArray;
    })();

    var isObject = function(value) {
        return value != null && typeof value === 'object';
    }

    var foreach = function(arg, func) {    
        if (!isArray(arg) && !isObject(arg))
            var arg = [arg];
        if (isArray(arg)) {
            for (var i=0; i<arg.length; i++) {
                func.call(window, arg[i], i, arg);
            }
        } else if (isObject(arg)) {
            for (var key in arg) {
                func.call(window, arg[key], key, arg);
            }
        }
    }

    var map = function(arr, func) {
        if (!isArray(arr))
            var arg = [arg];
        for (var i=0; i<arr.length; i++) {
            var result = func.call(window, arr[i]);
            if (typeof result !== 'undefined')
                arr[i] = result;
        }
        return arr;
    }

    var filter = function(arr, func) {
        if (!isArray(arr))
            var arg = [arr];
        var filtered = [];
        for (var i=0; i<arr.length; i++) {
            var result = func.call(window, arr[i]);
            if (typeof result === 'boolean' && result)
                filtered.push(arr[i]);
        }
        return filtered;
    }

    var toQueryString = function(obj) {
        var parts = [];
        for (var key in obj)
            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        return parts.join('&');
    }

    var queryStringToObject = function(str, obj) {
        var parts = str.split('&');
        for (var i=0; i<parts.length; i++) {
            var kv = parts[i].split('=');
            obj[kv[0]] = kv[1];
        }
        return obj;
    }

    var objectMerge = function(a, b) {
        for (var k in b)
            a[k] = b[k];
    }

    var attemptJson = function(str) {
        try {
            return JSON.parse(str);
        } catch(err) {
            return str;
        }
    }

    var collectUtil = function() {
        return {isArray: isArray, isObject: isObject, foreach: foreach, map: map, filter: filter}
    }

    var __extends = this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        __.prototype = b.prototype;
        d.prototype = new __();
    };

    var Action = (function () {
        
        function Action(inline) {
            this.id = inline.$nextId();
            this.inline = inline;
            this.future = inline.futures[this.id] = new Future(this.id, inline);
        }

        Action.prototype.onSuccess = function(data) {
            this.future.resolve(data);
        }
        
        Action.prototype.onError = function (err) {
            this.future.reject(err);
        }

        Action.prototype.run = function() {
            this.onSuccess();
        }
        
        return Action;

    })();


    var Execute = (function(_super) {

        __extends(Execute, _super);

        function Execute(inline, func, args) {
            _super.call(this, inline);
            this.func = func;
            this.args = args || [];
        }

        Execute.prototype.run = function() {
            for (var i=0; i<this.args.length; i++)
                this.args[i] = this.inline.unwrap(this.args[i]);
            var result = this.func.apply(window, this.args);
            this.onSuccess(result);
        }

        return Execute;

    })(Action);


    var Conditional = (function(_super) {

        __extends(Conditional, _super);

        function Conditional(inline, arg, onPass, onFail) {
            _super.call(this, inline);
            this.arg = arg;
            this.onPass = onPass;
            this.onFail = onFail;
        }

        Conditional.prototype.run = function() {
            var cond, data;
            if (this.arg instanceof Future) {
                cond = this.arg.isSuccess;
                data = this.arg.data;
            } else if (this.arg instanceof FutureValue) {
                cond = this.arg.unwrap();
                data = this.arg.future.data;
            } else {
                cond = this.arg;
                data = this.arg;
            }
            
            if (cond)
                var result = this.onPass.call(window, data);
            else
                var result = this.onFail.call(window, data);
            this.onSuccess(result);
        }

        return Conditional;

    })(Action);


    var Sleep = (function (_super) {
        
        __extends(Sleep, _super);

        function Sleep(inline, time) {
            _super.call(this, inline);
            this.time = time;
        }

        Sleep.prototype.run = function() {
            setTimeout(this.onSuccess.bind(this), this.time);
        }

        return Sleep;

    })(Action);


    var Request = (function (_super) {
        
        __extends(Request, _super);

        function Request(inline, type, url, params, config) {
            _super.call(this, inline);
            this.method = (type === 'GET') ? 'GET' : 'POST';
            this.type = type;
            this.url = url;
            this.params = isObject(params) ? params : {};
            if (isObject(config))
                objectMerge(this.config, config);
        }

        Request.prototype.config = {
            noCache: false,
            timeout: 0,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
            }
        }

        Request.prototype.run = function() {
            var self = this;

            var unwrapped = this.inline.unwrap(this.params);

            if (this.type === 'GET') {
                var parts = (this.url.indexOf('?') !== -1) ? this.url.split('?') : [this.url, ''];
                this.url = parts[0]; var query = parts[1];
                if (query)
                    unwrapped = queryStringToObject(query, unwrapped);
                if (this.config.noCache)
                    unwrapped[(UID++).toString(36)] = 'nocache';
                if (Object.keys(unwrapped).length)
                    this.url += '?' + toQueryString(unwrapped);
            }

            else if (this.type === 'POST')
                this.payload = toQueryString(unwrapped);
            else if (this.type === 'BODY')
                this.payload = JSON.stringify(unwrapped);

            var xhr = new XMLHttpRequest();
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState !==  4)
                    return;
                var data = attemptJson(xhr.response);
                if (xhr.status === 200)
                    self.onSuccess(data);
                else
                    self.onError(data);
            }

            xhr.open(this.method, this.url, true);

            if (this.config.timeout) {
                xhr.ontimeout = this.onError.bind(this, 'timeout');
                xhr.timeout = this.config.timeout;
            }
            
            for (var key in this.config.headers) {
                xhr.setRequestHeader(key, this.config.headers[key]);
            }

            if (this.type === 'BODY')
                xhr.setRequestHeader('Content-Type', 'text/json');
            if (this.type === 'POST')
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.send(this.payload);
        }

        return Request;

    })(Action);


    var Jsonp = (function (_super) {
        
        __extends(Jsonp, _super);

        var callbackCounter = 0;
        window.inline_callbacks = {};

        function Jsonp(inline, url, params, noCache) {
            _super.call(this, inline);
            this.url = url;
            this.params = isObject(params) ? params : {};
            this.noCache = noCache || this.noCache;
        }

        Jsonp.prototype.noCache = false;

        Jsonp.prototype.run = function()  {
            var self = this;
            var callbackId = 'R' + callbackCounter++;
            var unwrapped = this.inline.unwrap(this.params);

            if (this.url.indexOf('?') !== -1) {
                var parts = this.url.split('?');
                this.url = parts[0];
                unwrapped = queryStringToObject(parts[1], unwrapped);
            }
            
            var isCallback = false;
            for (var key in unwrapped) {
                if (unwrapped[key] === 'JSON_CALLBACK') {
                    unwrapped[key] = 'inline_callbacks.' + callbackId;
                    isCallback = true;
                    break;
                }
            }
            if (!isCallback)
                unwrapped.callback = 'inline_callbacks.' + callbackId;

            if (this.noCache)
                unwrapped[(UID++).toString(36)] = 'nocache';

            inline_callbacks[callbackId] = function(data) {
                inline_callbacks[callbackId].data = data;
            }
            
            var script = document.createElement('script');
            script.src = this.url + '?' + toQueryString(unwrapped);
            script.type = 'text/javascript';
            script.async = true;

            script.onload = function() {
                self.onSuccess(inline_callbacks[callbackId].data);
                delete inline_callbacks[callbackId];
                document.body.removeChild(script);
            }

            script.onerror = function() {
                self.onError(inline_callbacks[callbackId].data);
                delete inline_callbacks[callbackId];
                document.body.removeChild(script);
            }

            document.body.appendChild(script);
        }

        return Jsonp;

    })(Action);


    var Upload = (function (_super) {
        
        __extends(Upload, _super);

        var callbackCounter = 0;
        window.inline_callbacks = {};

        function Upload(inline, url, file, params, progress) {
            _super.call(this, inline);
            this.url = url;
            this.file = file;
            this.params = isObject(params) ? params : {};
            this.progress = (typeof progress === 'function') ? progress : null;
        }

        Upload.prototype.headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
        }

        Upload.prototype.run = function()  {
            var self = this;
            var xhr = new XMLHttpRequest();
        
            var unwrapped = this.inline.unwrap(this.params);
            objectMerge(this.headers, unwrapped);

            if (typeof this.progress === 'function' && typeof xhr.upload !== 'undefined') {
                xhr.upload.addEventListener('progress', function(e) {
                    self.progress.call(window, (e.loaded / e.total * 100).toFixed());
                }, false);
            }
        
            xhr.onreadystatechange = function(e) {
                if (xhr.readyState !== 4)
                    return;
                var data = attemptJson(xhr.responseText);
                if (xhr.status === 200)
                    self.onSuccess(data);
                else
                    self.onError(data);
            }

            xhr.open('POST', this.url, true);
            for (var key in this.headers) {
                xhr.setRequestHeader(key, this.headers[key]);
            }
            xhr.send(this.file);
        }

        return Upload;

    })(Action);


    var Parallel = (function(_super) {

        __extends(Parallel, _super);

        function Parallel(inline, futures) {
            _super.call(this, inline);

            if (futures.length === 1)
                var futures = futures[0];

            this.actions = [];
            this.futures = [];
            this.result = futures
            
            if (isArray(futures)) {
                this.futures = futures;
            } else {
                for (var key in futures) {
                    this.futures.push(futures[key]);
                }
            }

            for (var i=0; i<this.futures.length; i++) {
                var future = this.futures[i];
                future.asNested(this);
                var action = this.inline.removeAction(future);
                if (action instanceof Action)
                    this.actions.push(action);
                else if (!future.isResolved)
                    future.resolve();
            }
        }

        Parallel.prototype.notify = function() {
            for (var i=0; i<this.futures.length; i++) {
                if (!this.futures[i].isResolved)
                    return;
            }
            this.onSuccess(this.result);
        }

        Parallel.prototype.run = function() {
            for (var i=0; i<this.actions.length; i++) {
                try {
                    var action = this.actions[i];
                    action.run();
                } catch(err) {
                    var err = this.inline.handleError(err);
                    action.onError(err.message);
                }
            }
        }

        return Parallel;

    })(Action);


    var Future = (function() {
            
        function Future(id, inline) {
            this.id = id;
            this.inline = inline;
            this.isNested = false;
            this.parent = null;
            this.isResolved = false;
            this.isSuccess = false;
            this.isError = false;
            this.data = undefined;
            this.fallbackData = undefined;
            this.actions = [];
        }

        Future.prototype.$bind = function(obj, key, path) {
            return function(data) {
                if (typeof path === 'string')
                    data = Function('data', 'return ' + path)(data);
                obj[key] = data;
            }
        }

        Future.prototype.$check = function(data) {
            return true;
        }

        Future.prototype.$err = pass;

        Future.prototype.$fin = pass;


        Future.prototype.last = function() {
            this.inline.last(this);
            return this;
        }

        Future.prototype.async = function() {
            this.inline.async(this);
            return this;
        }

        Future.prototype.asNested = function(parent) {
            this.isNested = true;
            this.parent = parent;
            return this;
        }

        Future.prototype.fallback = function(data) {
            this.fallbackData = data;
            return this;
        }

        Future.prototype.check = function(func) {
            if (typeof func === 'string')
                func = Function('data', 'return ' + func);
            this.$check = func;
            return this;
        }

        Future.prototype.err = function(func, key, path) {
            if (typeof func !== 'function')
                func = this.$bind(func, key, path);
            this.$err = func;
            return this;
        }

        Future.prototype.fin = function(func, key, value) {
            if (typeof func === 'function') {
                this.$fin = func;
                return this;
            }
            this.$fin = function() {
                func[key] = value;
            }
            return this;
        }

        Future.prototype.run = function(func) {
            this.actions.push(function(data) {
                func(data);
            });
            return this;
        }

        Future.prototype.put = function(obj, key, path) {
            this.actions.push(this.$bind(obj, key, path));
            return this;
        }

        Future.prototype.set = function(obj, key, value) {
            this.actions.push(function(data) {
                obj[key] = value;
            });
            return this;
        }

        Future.prototype.modify = function(func) {
            if (typeof func === 'string')
                var func = Function('data', 'return ' + func);
            this.actions.push(func);
            return this;
        }

        Future.prototype.each = function(func) {
            this.actions.push(function(data) {
                foreach(data, func);
            });
            return this;
        }

        Future.prototype.map = function(func) {
            if (typeof func === 'string')
                var func = Function('item', func);
            this.actions.push(function(data) {
                return map(data, func);
            });
            return this;
        }

        Future.prototype.filter = function(func) {
            if (typeof func === 'string')
                var func = Function('item', 'return ' + func);
            this.actions.push(function(data) {
                return filter(data, func);
            });
            return this;
        }

        Future.prototype.key = function(key) {
            this.modify(key);
            return this;
        }

        Future.prototype.index = function(index) {
            this.actions.push(function(data) {
                return data[index];
            });
            return this;
        }

        Future.prototype.resolve = function(data) {
            this.data = data;
            this.isResolved = true;
            this.isSuccess = true;
            this.isError = false;
            if (!this.$check(data)) {
                this.reject(data);
                return;
            }

            try {
                for (var i=0; i<this.actions.length; i++) {
                    var result = this.actions[i](this.data);
                    if (typeof result !== 'undefined')
                        this.data = result;
                }
                this.$fin();
                this.inline.notify(this);
            } catch(err) {
                this.fallbackData = undefined;
                var err = this.inline.handleError(err);
                this.reject(err.message);
            }
        }

        Future.prototype.reject = function(error) {
            this.data = error;
            this.isResolved = true;
            this.isSuccess = false;
            this.isError = true;
            var fallback = this.fallbackData;
            this.fallbackData = undefined;
            if (fallback !== undefined) {
                this.resolve(fallback);
                return;
            }
            this.$err(error);
            this.$fin();
            this.inline.notify(this);
        }

        return Future;

    })();


    var FutureValue = (function() {
            
        function FutureValue(future, path) {
            this.future = future;
            this.path = path || 'data';
        }

        FutureValue.prototype.unwrap = function() {
            return new Function('future', 'return future.' + this.path)(this.future);
        }

        return FutureValue;

    })();


    window.fv = function(future, path) {
        return new FutureValue(future, path);
    }


    var Inline = (function() {
        
        function Inline(config) {
            this.$chain = [];
            this.$subChain = [];
            this.$idCounter = 0;
            this.$index = 0;
            this.runningId = '';
            this.isRunning = false;
            this.autoStartOn = false;
            this.futures = {};
            this.final = pass;
            
            if (isObject(config))
                objectMerge(this.config, config);
        }
     
        Inline.prototype.config = {
            debug: false,
            autoStart: true,
            autoStop: true
        }

        Inline.prototype.$nextId = function() {
            return 'A' + this.$idCounter++;
        }

        Inline.prototype.handleError = function(err) {
            if (typeof err === 'string')
                var err = new Error(err);
            if (this.config.debug)
                console.error(err.stack);
            return err;
        }

        Inline.prototype.$runAction = function(action) {
            try {
                action.run();
            } catch(err) {
                var err = this.handleError(err);
                action.future.reject(err.message);
            }
        }

        Inline.prototype.$next = function() {
            if (this.$subChain.length) {
                this.$chain = [].concat(
                    this.$chain.slice(0, this.$index),
                    this.$subChain,
                    this.$chain.slice(this.$index)
                );
                this.$subChain = [];
            }
            if (this.$index < this.$chain.length) {
                var action = this.$chain[this.$index++];
                this.runningId = action.id;
                this.$runAction(action);
            } else {
                this.finish();
            }
        }

        Inline.prototype.notify = function(future) {
            if (future.isNested)
                future.parent.notify(this);
            else if (future.isError && this.config.autoStop)
                this.finish();
            else if (this.runningId === future.id)
                this.$next();
        }

        // all pulic action methods must call this method to register action and return class Future

        Inline.prototype.registerAction = function(action) {
            if (this.isRunning)
                this.$subChain.push(action);
            else
                this.$chain.push(action);

            if (this.config.autoStart)
                this.autoStart();

            return action.future;
        }

        // remove action from chain in order to run it in parallel or async

        Inline.prototype.removeAction = function(future) {
            var action;
            var chain = [].concat(this.$chain, this.$subChain);
            for (var i=0; i<chain.length; i++) {
                if (future.id === chain[i].id) {
                    action = chain[i];
                    break;
                }
            }
            if (action instanceof Action) {
                if (this.$chain.indexOf(action) !== -1)
                    this.$chain.splice(this.$chain.indexOf(action), 1);
                else if (this.$subChain.indexOf(action) !== -1)
                    this.$subChain.splice(this.$subChain.indexOf(action), 1);
            }
            return action;      
        }

        // methods for fetching data

        Inline.prototype.$unwrap = function(arg) {
            if (arg instanceof Future)
                return arg.data;
            if (arg instanceof FutureValue)
                return arg.unwrap();
            return arg;
        }

        Inline.prototype.unwrap = function(arg) {
            var value = this.$unwrap(arg);
            if (isArray(value)) {
                for (var i=0; i<value.length; i++) {
                    value[i] = this.$unwrap(value[i]);
                }
            } else if (isObject(value)) {
                for (var key in value) {
                    value[key] = this.$unwrap(value[key])
                }
            }
            return value;
        }

        // called is inst.config.autoStart = true

        Inline.prototype.autoStart = function() {
            if (this.autoStartOn)
                return;
            this.autoStartOn = true;
            setTimeout(this.start.bind(this), 0);
        }

        // standard public methods

        Inline.prototype.start = function() {
            if (this.isRunning)
                return;
            this.isRunning = true;
            this.$next();
        };

        Inline.prototype.finish = function() {
            this.final();
            this.final = pass;
            this.runningId = '';
            this.isRunning = false;
            this.autoStartOn = false;
            if (this.config.debug)
                return;
            this.futures = {};
            this.$chain = [];
            this.$index = 0;
        }

        Inline.prototype.copy = function(create) {
            if (create || this.isRunning)
                return new Inline(this.config);
            return this;
        }

        Inline.prototype.future = function(data) {
            var future = new Future(this.$nextId(), this);
            if (typeof data !== 'undefined')
                future.resolve(data);
            return future;
        }

        Inline.prototype.fv = function(future, path) {
            return new FutureValue(future, path);
        }

        Inline.prototype.log = function(msg) {
            console.log(msg);
        }

        Inline.prototype.async = function(future) {
            if (future.isResolved)
                return;
            var action = this.removeAction(future);
            if (action instanceof Action)
                this.$runAction(action);
        }

        Inline.prototype.last = function(future) {
            if (future.isResolved)
                return;
            var action = this.removeAction(future);
            if (action instanceof Action)
                this.$chain.push(action);
        }

        Inline.prototype.fin = function(func, key, value) {
            if (typeof func === 'function') {
                this.final = func;
            } else {
                this.final = function() {
                    func[key] = value;
                }
            }
        }

        // run, set methods for class Execute

        Inline.prototype.run = function() {
            var args = Array.prototype.slice.call(arguments);
            var func = args.shift();
            return this.registerAction(new Execute(this, func, args));
        }

        Inline.prototype.set = function(obj, key, value) {
            var func = function(unwrapped) {
                obj[key] = unwrapped;
            }
            return this.registerAction(new Execute(this, func, [value]));
        }

        // sleep method for class Sleep

        Inline.prototype.sleep = function(time) {
            return this.registerAction(new Sleep(this, time));
        }

        // conditional methods for class Conditional

        Inline.prototype.if = function(condition, func) {
            return this.registerAction(new Conditional(this, condition, func, pass));
        }

        Inline.prototype.ifnot = function(condition, func) {
            return this.registerAction(new Conditional(this, condition, pass, func));
        }

        Inline.prototype.ifelse = function(condition, onPass, onFail) {
            return this.registerAction(new Conditional(this, condition, onPass, onFail));
        }

        // par method for class Parallel

        Inline.prototype.par = function() {
            var args = Array.prototype.slice.call(arguments);
            return this.registerAction(new Parallel(this, args));
        }

        // ajax methods for class Request

        Inline.prototype.get = function(url, params, config) {
            return this.registerAction(new Request(this, 'GET', url, params, config));
        }

        Inline.prototype.post = function(url, params, config) {
            return this.registerAction(new Request(this, 'POST', url, params, config));
        }

        Inline.prototype.body = function(url, params, config) {
            return this.registerAction(new Request(this, 'BODY', url, params, config));
        }

        // jsonp methods for class Jsonp

        Inline.prototype.jsonp = function(url, params, noCache) {
            return this.registerAction(new Jsonp(this, url, params, noCache));
        }

        // jsonp methods for class Jsonp

        Inline.prototype.upload = function(url, file, headers, progress) {
            return this.registerAction(new Upload(this, url, file, headers, progress));
        }

        return Inline;

    })();

    window.Inline = Inline;

    window.InlineExpose = function(member) {
        switch (member) {
            case '__extends': return __extends;
            case 'util': return collectUtil();
            case 'Action': return Action;
            case 'Execute': return Execute;
            case 'Conditional': return Conditional;
            case 'Iteration': return Iteration;
            case 'Sleep': return Sleep;
            case 'Request': return Request;
            case 'Jsonp': return Jsonp;
            case 'Upload': return Upload;
            case 'Parallel': return Parallel;
            case 'Future': return Future;
            default: throw new Error('no member named ' + member)
        }
    }

})();




