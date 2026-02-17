module.exports = [
"[externals]/@modelcontextprotocol/sdk/server/index.js [external] (@modelcontextprotocol/sdk/server/index.js, esm_import, [project]/node_modules/@modelcontextprotocol/sdk)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@modelcontextprotocol/sdk-4089b9e8fbe68a78/server/index.js");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/@modelcontextprotocol/sdk/server/stdio.js [external] (@modelcontextprotocol/sdk/server/stdio.js, esm_import, [project]/node_modules/@modelcontextprotocol/sdk)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@modelcontextprotocol/sdk-4089b9e8fbe68a78/server/stdio.js");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/@modelcontextprotocol/sdk/types.js [external] (@modelcontextprotocol/sdk/types.js, esm_import, [project]/node_modules/@modelcontextprotocol/sdk)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@modelcontextprotocol/sdk-4089b9e8fbe68a78/types.js");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/node_modules/delayed-stream/lib/delayed_stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Stream;
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
module.exports = DelayedStream;
function DelayedStream() {
    this.source = null;
    this.dataSize = 0;
    this.maxDataSize = 1024 * 1024;
    this.pauseStream = true;
    this._maxDataSizeExceeded = false;
    this._released = false;
    this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);
DelayedStream.create = function(source, options) {
    var delayedStream = new this();
    options = options || {};
    for(var option in options){
        delayedStream[option] = options[option];
    }
    delayedStream.source = source;
    var realEmit = source.emit;
    source.emit = function() {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
    };
    source.on('error', function() {});
    if (delayedStream.pauseStream) {
        source.pause();
    }
    return delayedStream;
};
Object.defineProperty(DelayedStream.prototype, 'readable', {
    configurable: true,
    enumerable: true,
    get: function() {
        return this.source.readable;
    }
});
DelayedStream.prototype.setEncoding = function() {
    return this.source.setEncoding.apply(this.source, arguments);
};
DelayedStream.prototype.resume = function() {
    if (!this._released) {
        this.release();
    }
    this.source.resume();
};
DelayedStream.prototype.pause = function() {
    this.source.pause();
};
DelayedStream.prototype.release = function() {
    this._released = true;
    this._bufferedEvents.forEach((function(args) {
        this.emit.apply(this, args);
    }).bind(this));
    this._bufferedEvents = [];
};
DelayedStream.prototype.pipe = function() {
    var r = Stream.prototype.pipe.apply(this, arguments);
    this.resume();
    return r;
};
DelayedStream.prototype._handleEmit = function(args) {
    if (this._released) {
        this.emit.apply(this, args);
        return;
    }
    if (args[0] === 'data') {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
    }
    this._bufferedEvents.push(args);
};
DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
    if (this._maxDataSizeExceeded) {
        return;
    }
    if (this.dataSize <= this.maxDataSize) {
        return;
    }
    this._maxDataSizeExceeded = true;
    var message = 'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
    this.emit('error', new Error(message));
};
}),
"[project]/node_modules/combined-stream/lib/combined_stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Stream;
var DelayedStream = __turbopack_context__.r("[project]/node_modules/delayed-stream/lib/delayed_stream.js [app-route] (ecmascript)");
module.exports = CombinedStream;
function CombinedStream() {
    this.writable = false;
    this.readable = true;
    this.dataSize = 0;
    this.maxDataSize = 2 * 1024 * 1024;
    this.pauseStreams = true;
    this._released = false;
    this._streams = [];
    this._currentStream = null;
    this._insideLoop = false;
    this._pendingNext = false;
}
util.inherits(CombinedStream, Stream);
CombinedStream.create = function(options) {
    var combinedStream = new this();
    options = options || {};
    for(var option in options){
        combinedStream[option] = options[option];
    }
    return combinedStream;
};
CombinedStream.isStreamLike = function(stream) {
    return typeof stream !== 'function' && typeof stream !== 'string' && typeof stream !== 'boolean' && typeof stream !== 'number' && !Buffer.isBuffer(stream);
};
CombinedStream.prototype.append = function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
        if (!(stream instanceof DelayedStream)) {
            var newStream = DelayedStream.create(stream, {
                maxDataSize: Infinity,
                pauseStream: this.pauseStreams
            });
            stream.on('data', this._checkDataSize.bind(this));
            stream = newStream;
        }
        this._handleErrors(stream);
        if (this.pauseStreams) {
            stream.pause();
        }
    }
    this._streams.push(stream);
    return this;
};
CombinedStream.prototype.pipe = function(dest, options) {
    Stream.prototype.pipe.call(this, dest, options);
    this.resume();
    return dest;
};
CombinedStream.prototype._getNext = function() {
    this._currentStream = null;
    if (this._insideLoop) {
        this._pendingNext = true;
        return; // defer call
    }
    this._insideLoop = true;
    try {
        do {
            this._pendingNext = false;
            this._realGetNext();
        }while (this._pendingNext)
    } finally{
        this._insideLoop = false;
    }
};
CombinedStream.prototype._realGetNext = function() {
    var stream = this._streams.shift();
    if (typeof stream == 'undefined') {
        this.end();
        return;
    }
    if (typeof stream !== 'function') {
        this._pipeNext(stream);
        return;
    }
    var getStream = stream;
    getStream((function(stream) {
        var isStreamLike = CombinedStream.isStreamLike(stream);
        if (isStreamLike) {
            stream.on('data', this._checkDataSize.bind(this));
            this._handleErrors(stream);
        }
        this._pipeNext(stream);
    }).bind(this));
};
CombinedStream.prototype._pipeNext = function(stream) {
    this._currentStream = stream;
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
        stream.on('end', this._getNext.bind(this));
        stream.pipe(this, {
            end: false
        });
        return;
    }
    var value = stream;
    this.write(value);
    this._getNext();
};
CombinedStream.prototype._handleErrors = function(stream) {
    var self = this;
    stream.on('error', function(err) {
        self._emitError(err);
    });
};
CombinedStream.prototype.write = function(data) {
    this.emit('data', data);
};
CombinedStream.prototype.pause = function() {
    if (!this.pauseStreams) {
        return;
    }
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == 'function') this._currentStream.pause();
    this.emit('pause');
};
CombinedStream.prototype.resume = function() {
    if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
    }
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == 'function') this._currentStream.resume();
    this.emit('resume');
};
CombinedStream.prototype.end = function() {
    this._reset();
    this.emit('end');
};
CombinedStream.prototype.destroy = function() {
    this._reset();
    this.emit('close');
};
CombinedStream.prototype._reset = function() {
    this.writable = false;
    this._streams = [];
    this._currentStream = null;
};
CombinedStream.prototype._checkDataSize = function() {
    this._updateDataSize();
    if (this.dataSize <= this.maxDataSize) {
        return;
    }
    var message = 'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
    this._emitError(new Error(message));
};
CombinedStream.prototype._updateDataSize = function() {
    this.dataSize = 0;
    var self = this;
    this._streams.forEach(function(stream) {
        if (!stream.dataSize) {
            return;
        }
        self.dataSize += stream.dataSize;
    });
    if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
    }
};
CombinedStream.prototype._emitError = function(err) {
    this._reset();
    this.emit('error', err);
};
}),
"[project]/node_modules/form-data/node_modules/mime-types/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ /**
 * Module dependencies.
 * @private
 */ var db = __turbopack_context__.r("[project]/node_modules/form-data/node_modules/mime-db/index.js [app-route] (ecmascript)");
var extname = __turbopack_context__.r("[externals]/path [external] (path, cjs)").extname;
/**
 * Module variables.
 * @private
 */ var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
var TEXT_TYPE_REGEXP = /^text\//i;
/**
 * Module exports.
 * @public
 */ exports.charset = charset;
exports.charsets = {
    lookup: charset
};
exports.contentType = contentType;
exports.extension = extension;
exports.extensions = Object.create(null);
exports.lookup = lookup;
exports.types = Object.create(null);
// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types);
/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */ function charset(type) {
    if (!type || typeof type !== 'string') {
        return false;
    }
    // TODO: use media-typer
    var match = EXTRACT_TYPE_REGEXP.exec(type);
    var mime = match && db[match[1].toLowerCase()];
    if (mime && mime.charset) {
        return mime.charset;
    }
    // default text/* to utf-8
    if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return 'UTF-8';
    }
    return false;
}
/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */ function contentType(str) {
    // TODO: should this even be in this module?
    if (!str || typeof str !== 'string') {
        return false;
    }
    var mime = str.indexOf('/') === -1 ? exports.lookup(str) : str;
    if (!mime) {
        return false;
    }
    // TODO: use content-type or other module
    if (mime.indexOf('charset') === -1) {
        var charset = exports.charset(mime);
        if (charset) mime += '; charset=' + charset.toLowerCase();
    }
    return mime;
}
/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */ function extension(type) {
    if (!type || typeof type !== 'string') {
        return false;
    }
    // TODO: use media-typer
    var match = EXTRACT_TYPE_REGEXP.exec(type);
    // get extensions
    var exts = match && exports.extensions[match[1].toLowerCase()];
    if (!exts || !exts.length) {
        return false;
    }
    return exts[0];
}
/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */ function lookup(path) {
    if (!path || typeof path !== 'string') {
        return false;
    }
    // get the extension ("ext" or ".ext" or full path)
    var extension = extname('x.' + path).toLowerCase().substr(1);
    if (!extension) {
        return false;
    }
    return exports.types[extension] || false;
}
/**
 * Populate the extensions and types maps.
 * @private
 */ function populateMaps(extensions, types) {
    // source preference (least -> most)
    var preference = [
        'nginx',
        'apache',
        undefined,
        'iana'
    ];
    Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
            return;
        }
        // mime -> extensions
        extensions[type] = exts;
        // extension -> mime
        for(var i = 0; i < exts.length; i++){
            var extension = exts[i];
            if (types[extension]) {
                var from = preference.indexOf(db[types[extension]].source);
                var to = preference.indexOf(mime.source);
                if (types[extension] !== 'application/octet-stream' && (from > to || from === to && types[extension].substr(0, 12) === 'application/')) {
                    continue;
                }
            }
            // set the extension -> mime
            types[extension] = type;
        }
    });
}
}),
"[project]/node_modules/asynckit/lib/defer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = defer;
/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */ function defer(fn) {
    var nextTick = typeof setImmediate == 'function' ? setImmediate : typeof process == 'object' && typeof process.nextTick == 'function' ? process.nextTick : null;
    if (nextTick) {
        nextTick(fn);
    } else {
        setTimeout(fn, 0);
    }
}
}),
"[project]/node_modules/asynckit/lib/async.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var defer = __turbopack_context__.r("[project]/node_modules/asynckit/lib/defer.js [app-route] (ecmascript)");
// API
module.exports = async;
/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */ function async(callback) {
    var isAsync = false;
    // check if async happened
    defer(function() {
        isAsync = true;
    });
    return function async_callback(err, result) {
        if (isAsync) {
            callback(err, result);
        } else {
            defer(function nextTick_callback() {
                callback(err, result);
            });
        }
    };
}
}),
"[project]/node_modules/asynckit/lib/abort.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// API
module.exports = abort;
/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */ function abort(state) {
    Object.keys(state.jobs).forEach(clean.bind(state));
    // reset leftover jobs
    state.jobs = {};
}
/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */ function clean(key) {
    if (typeof this.jobs[key] == 'function') {
        this.jobs[key]();
    }
}
}),
"[project]/node_modules/asynckit/lib/iterate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var async = __turbopack_context__.r("[project]/node_modules/asynckit/lib/async.js [app-route] (ecmascript)"), abort = __turbopack_context__.r("[project]/node_modules/asynckit/lib/abort.js [app-route] (ecmascript)");
// API
module.exports = iterate;
/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */ function iterate(list, iterator, state, callback) {
    // store current index
    var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;
    state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
        // don't repeat yourself
        // skip secondary callbacks
        if (!(key in state.jobs)) {
            return;
        }
        // clean up jobs
        delete state.jobs[key];
        if (error) {
            // don't process rest of the results
            // stop still active jobs
            // and reset the list
            abort(state);
        } else {
            state.results[key] = output;
        }
        // return salvaged results
        callback(error, state.results);
    });
}
/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */ function runJob(iterator, key, item, callback) {
    var aborter;
    // allow shortcut if iterator expects only two arguments
    if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
    } else {
        aborter = iterator(item, key, async(callback));
    }
    return aborter;
}
}),
"[project]/node_modules/asynckit/lib/state.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// API
module.exports = state;
/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */ function state(list, sortMethod) {
    var isNamedList = !Array.isArray(list), initState = {
        index: 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs: {},
        results: isNamedList ? {} : [],
        size: isNamedList ? Object.keys(list).length : list.length
    };
    if (sortMethod) {
        // sort array keys based on it's values
        // sort object's keys just on own merit
        initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
            return sortMethod(list[a], list[b]);
        });
    }
    return initState;
}
}),
"[project]/node_modules/asynckit/lib/terminator.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var abort = __turbopack_context__.r("[project]/node_modules/asynckit/lib/abort.js [app-route] (ecmascript)"), async = __turbopack_context__.r("[project]/node_modules/asynckit/lib/async.js [app-route] (ecmascript)");
// API
module.exports = terminator;
/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */ function terminator(callback) {
    if (!Object.keys(this.jobs).length) {
        return;
    }
    // fast forward iteration index
    this.index = this.size;
    // abort jobs
    abort(this);
    // send back results we have so far
    async(callback)(null, this.results);
}
}),
"[project]/node_modules/asynckit/parallel.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var iterate = __turbopack_context__.r("[project]/node_modules/asynckit/lib/iterate.js [app-route] (ecmascript)"), initState = __turbopack_context__.r("[project]/node_modules/asynckit/lib/state.js [app-route] (ecmascript)"), terminator = __turbopack_context__.r("[project]/node_modules/asynckit/lib/terminator.js [app-route] (ecmascript)");
// Public API
module.exports = parallel;
/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function parallel(list, iterator, callback) {
    var state = initState(list);
    while(state.index < (state['keyedList'] || list).length){
        iterate(list, iterator, state, function(error, result) {
            if (error) {
                callback(error, result);
                return;
            }
            // looks like it's the last one
            if (Object.keys(state.jobs).length === 0) {
                callback(null, state.results);
                return;
            }
        });
        state.index++;
    }
    return terminator.bind(state, callback);
}
}),
"[project]/node_modules/asynckit/serialOrdered.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var iterate = __turbopack_context__.r("[project]/node_modules/asynckit/lib/iterate.js [app-route] (ecmascript)"), initState = __turbopack_context__.r("[project]/node_modules/asynckit/lib/state.js [app-route] (ecmascript)"), terminator = __turbopack_context__.r("[project]/node_modules/asynckit/lib/terminator.js [app-route] (ecmascript)");
// Public API
module.exports = serialOrdered;
// sorting helpers
module.exports.ascending = ascending;
module.exports.descending = descending;
/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function serialOrdered(list, iterator, sortMethod, callback) {
    var state = initState(list, sortMethod);
    iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
            callback(error, result);
            return;
        }
        state.index++;
        // are we there yet?
        if (state.index < (state['keyedList'] || list).length) {
            iterate(list, iterator, state, iteratorHandler);
            return;
        }
        // done here
        callback(null, state.results);
    });
    return terminator.bind(state, callback);
}
/*
 * -- Sort methods
 */ /**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */ function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */ function descending(a, b) {
    return -1 * ascending(a, b);
}
}),
"[project]/node_modules/asynckit/serial.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var serialOrdered = __turbopack_context__.r("[project]/node_modules/asynckit/serialOrdered.js [app-route] (ecmascript)");
// Public API
module.exports = serial;
/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function serial(list, iterator, callback) {
    return serialOrdered(list, iterator, null, callback);
}
}),
"[project]/node_modules/asynckit/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    parallel: __turbopack_context__.r("[project]/node_modules/asynckit/parallel.js [app-route] (ecmascript)"),
    serial: __turbopack_context__.r("[project]/node_modules/asynckit/serial.js [app-route] (ecmascript)"),
    serialOrdered: __turbopack_context__.r("[project]/node_modules/asynckit/serialOrdered.js [app-route] (ecmascript)")
};
}),
"[project]/node_modules/es-object-atoms/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('.')} */ module.exports = Object;
}),
"[project]/node_modules/es-errors/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('.')} */ module.exports = Error;
}),
"[project]/node_modules/es-errors/eval.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./eval')} */ module.exports = EvalError;
}),
"[project]/node_modules/es-errors/range.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./range')} */ module.exports = RangeError;
}),
"[project]/node_modules/es-errors/ref.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./ref')} */ module.exports = ReferenceError;
}),
"[project]/node_modules/es-errors/syntax.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./syntax')} */ module.exports = SyntaxError;
}),
"[project]/node_modules/es-errors/type.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./type')} */ module.exports = TypeError;
}),
"[project]/node_modules/es-errors/uri.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./uri')} */ module.exports = URIError;
}),
"[project]/node_modules/math-intrinsics/abs.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./abs')} */ module.exports = Math.abs;
}),
"[project]/node_modules/math-intrinsics/floor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./floor')} */ module.exports = Math.floor;
}),
"[project]/node_modules/math-intrinsics/max.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./max')} */ module.exports = Math.max;
}),
"[project]/node_modules/math-intrinsics/min.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./min')} */ module.exports = Math.min;
}),
"[project]/node_modules/math-intrinsics/pow.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./pow')} */ module.exports = Math.pow;
}),
"[project]/node_modules/math-intrinsics/round.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./round')} */ module.exports = Math.round;
}),
"[project]/node_modules/math-intrinsics/isNaN.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./isNaN')} */ module.exports = Number.isNaN || function isNaN(a) {
    return a !== a;
};
}),
"[project]/node_modules/math-intrinsics/sign.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var $isNaN = __turbopack_context__.r("[project]/node_modules/math-intrinsics/isNaN.js [app-route] (ecmascript)");
/** @type {import('./sign')} */ module.exports = function sign(number) {
    if ($isNaN(number) || number === 0) {
        return number;
    }
    return number < 0 ? -1 : +1;
};
}),
"[project]/node_modules/gopd/gOPD.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./gOPD')} */ module.exports = Object.getOwnPropertyDescriptor;
}),
"[project]/node_modules/gopd/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('.')} */ var $gOPD = __turbopack_context__.r("[project]/node_modules/gopd/gOPD.js [app-route] (ecmascript)");
if ($gOPD) {
    try {
        $gOPD([], 'length');
    } catch (e) {
        // IE 8 has a broken gOPD
        $gOPD = null;
    }
}
module.exports = $gOPD;
}),
"[project]/node_modules/es-define-property/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('.')} */ var $defineProperty = Object.defineProperty || false;
if ($defineProperty) {
    try {
        $defineProperty({}, 'a', {
            value: 1
        });
    } catch (e) {
        // IE 8 has a broken defineProperty
        $defineProperty = false;
    }
}
module.exports = $defineProperty;
}),
"[project]/node_modules/has-symbols/shams.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./shams')} */ /* eslint complexity: [2, 18], max-statements: [2, 33] */ module.exports = function hasSymbols() {
    if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
        return false;
    }
    if (typeof Symbol.iterator === 'symbol') {
        return true;
    }
    /** @type {{ [k in symbol]?: unknown }} */ var obj = {};
    var sym = Symbol('test');
    var symObj = Object(sym);
    if (typeof sym === 'string') {
        return false;
    }
    if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
        return false;
    }
    if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
        return false;
    }
    // temp disabled per https://github.com/ljharb/object.assign/issues/17
    // if (sym instanceof Symbol) { return false; }
    // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
    // if (!(symObj instanceof Symbol)) { return false; }
    // if (typeof Symbol.prototype.toString !== 'function') { return false; }
    // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }
    var symVal = 42;
    obj[sym] = symVal;
    for(var _ in obj){
        return false;
    } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
    if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
        return false;
    }
    if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
    }
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym) {
        return false;
    }
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
    }
    if (typeof Object.getOwnPropertyDescriptor === 'function') {
        // eslint-disable-next-line no-extra-parens
        var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
        }
    }
    return true;
};
}),
"[project]/node_modules/has-symbols/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __turbopack_context__.r("[project]/node_modules/has-symbols/shams.js [app-route] (ecmascript)");
/** @type {import('.')} */ module.exports = function hasNativeSymbols() {
    if (typeof origSymbol !== 'function') {
        return false;
    }
    if (typeof Symbol !== 'function') {
        return false;
    }
    if (typeof origSymbol('foo') !== 'symbol') {
        return false;
    }
    if (typeof Symbol('bar') !== 'symbol') {
        return false;
    }
    return hasSymbolSham();
};
}),
"[project]/node_modules/get-proto/Reflect.getPrototypeOf.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./Reflect.getPrototypeOf')} */ module.exports = typeof Reflect !== 'undefined' && Reflect.getPrototypeOf || null;
}),
"[project]/node_modules/get-proto/Object.getPrototypeOf.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var $Object = __turbopack_context__.r("[project]/node_modules/es-object-atoms/index.js [app-route] (ecmascript)");
/** @type {import('./Object.getPrototypeOf')} */ module.exports = $Object.getPrototypeOf || null;
}),
"[project]/node_modules/get-proto/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var reflectGetProto = __turbopack_context__.r("[project]/node_modules/get-proto/Reflect.getPrototypeOf.js [app-route] (ecmascript)");
var originalGetProto = __turbopack_context__.r("[project]/node_modules/get-proto/Object.getPrototypeOf.js [app-route] (ecmascript)");
var getDunderProto = __turbopack_context__.r("[project]/node_modules/dunder-proto/get.js [app-route] (ecmascript)");
/** @type {import('.')} */ module.exports = reflectGetProto ? function getProto(O) {
    // @ts-expect-error TS can't narrow inside a closure, for some reason
    return reflectGetProto(O);
} : originalGetProto ? function getProto(O) {
    if (!O || typeof O !== 'object' && typeof O !== 'function') {
        throw new TypeError('getProto: not an object');
    }
    // @ts-expect-error TS can't narrow inside a closure, for some reason
    return originalGetProto(O);
} : getDunderProto ? function getProto(O) {
    // @ts-expect-error TS can't narrow inside a closure, for some reason
    return getDunderProto(O);
} : null;
}),
"[project]/node_modules/function-bind/implementation.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint no-invalid-this: 1 */ var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';
var concatty = function concatty(a, b) {
    var arr = [];
    for(var i = 0; i < a.length; i += 1){
        arr[i] = a[i];
    }
    for(var j = 0; j < b.length; j += 1){
        arr[j + a.length] = b[j];
    }
    return arr;
};
var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for(var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1){
        arr[j] = arrLike[i];
    }
    return arr;
};
var joiny = function(arr, joiner) {
    var str = '';
    for(var i = 0; i < arr.length; i += 1){
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};
module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);
    var bound;
    var binder = function() {
        if (this instanceof bound) {
            var result = target.apply(this, concatty(args, arguments));
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(that, concatty(args, arguments));
    };
    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for(var i = 0; i < boundLength; i++){
        boundArgs[i] = '$' + i;
    }
    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);
    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }
    return bound;
};
}),
"[project]/node_modules/function-bind/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var implementation = __turbopack_context__.r("[project]/node_modules/function-bind/implementation.js [app-route] (ecmascript)");
module.exports = Function.prototype.bind || implementation;
}),
"[project]/node_modules/call-bind-apply-helpers/functionCall.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./functionCall')} */ module.exports = Function.prototype.call;
}),
"[project]/node_modules/call-bind-apply-helpers/functionApply.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./functionApply')} */ module.exports = Function.prototype.apply;
}),
"[project]/node_modules/call-bind-apply-helpers/reflectApply.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/** @type {import('./reflectApply')} */ module.exports = typeof Reflect !== 'undefined' && Reflect && Reflect.apply;
}),
"[project]/node_modules/call-bind-apply-helpers/actualApply.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var bind = __turbopack_context__.r("[project]/node_modules/function-bind/index.js [app-route] (ecmascript)");
var $apply = __turbopack_context__.r("[project]/node_modules/call-bind-apply-helpers/functionApply.js [app-route] (ecmascript)");
var $call = __turbopack_context__.r("[project]/node_modules/call-bind-apply-helpers/functionCall.js [app-route] (ecmascript)");
var $reflectApply = __turbopack_context__.r("[project]/node_modules/call-bind-apply-helpers/reflectApply.js [app-route] (ecmascript)");
/** @type {import('./actualApply')} */ module.exports = $reflectApply || bind.call($call, $apply);
}),
"[project]/node_modules/call-bind-apply-helpers/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var bind = __turbopack_context__.r("[project]/node_modules/function-bind/index.js [app-route] (ecmascript)");
var $TypeError = __turbopack_context__.r("[project]/node_modules/es-errors/type.js [app-route] (ecmascript)");
var $call = __turbopack_context__.r("[project]/node_modules/call-bind-apply-helpers/functionCall.js [app-route] (ecmascript)");
var $actualApply = __turbopack_context__.r("[project]/node_modules/call-bind-apply-helpers/actualApply.js [app-route] (ecmascript)");
/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */ module.exports = function callBindBasic(args) {
    if (args.length < 1 || typeof args[0] !== 'function') {
        throw new $TypeError('a function is required');
    }
    return $actualApply(bind, $call, args);
};
}),
"[project]/node_modules/dunder-proto/get.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var callBind = __turbopack_context__.r("[project]/node_modules/call-bind-apply-helpers/index.js [app-route] (ecmascript)");
var gOPD = __turbopack_context__.r("[project]/node_modules/gopd/index.js [app-route] (ecmascript)");
var hasProtoAccessor;
try {
    // eslint-disable-next-line no-extra-parens, no-proto
    hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */ [].__proto__ === Array.prototype;
} catch (e) {
    if (!e || typeof e !== 'object' || !('code' in e) || e.code !== 'ERR_PROTO_ACCESS') {
        throw e;
    }
}
// eslint-disable-next-line no-extra-parens
var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, '__proto__');
var $Object = Object;
var $getPrototypeOf = $Object.getPrototypeOf;
/** @type {import('./get')} */ module.exports = desc && typeof desc.get === 'function' ? callBind([
    desc.get
]) : typeof $getPrototypeOf === 'function' ? /** @type {import('./get')} */ function getDunder(value) {
    // eslint-disable-next-line eqeqeq
    return $getPrototypeOf(value == null ? value : $Object(value));
} : false;
}),
"[project]/node_modules/hasown/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = __turbopack_context__.r("[project]/node_modules/function-bind/index.js [app-route] (ecmascript)");
/** @type {import('.')} */ module.exports = bind.call(call, $hasOwn);
}),
"[project]/node_modules/get-intrinsic/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var undefined1;
var $Object = __turbopack_context__.r("[project]/node_modules/es-object-atoms/index.js [app-route] (ecmascript)");
var $Error = __turbopack_context__.r("[project]/node_modules/es-errors/index.js [app-route] (ecmascript)");
var $EvalError = __turbopack_context__.r("[project]/node_modules/es-errors/eval.js [app-route] (ecmascript)");
var $RangeError = __turbopack_context__.r("[project]/node_modules/es-errors/range.js [app-route] (ecmascript)");
var $ReferenceError = __turbopack_context__.r("[project]/node_modules/es-errors/ref.js [app-route] (ecmascript)");
var $SyntaxError = __turbopack_context__.r("[project]/node_modules/es-errors/syntax.js [app-route] (ecmascript)");
var $TypeError = __turbopack_context__.r("[project]/node_modules/es-errors/type.js [app-route] (ecmascript)");
var $URIError = __turbopack_context__.r("[project]/node_modules/es-errors/uri.js [app-route] (ecmascript)");
var abs = __turbopack_context__.r("[project]/node_modules/math-intrinsics/abs.js [app-route] (ecmascript)");
var floor = __turbopack_context__.r("[project]/node_modules/math-intrinsics/floor.js [app-route] (ecmascript)");
var max = __turbopack_context__.r("[project]/node_modules/math-intrinsics/max.js [app-route] (ecmascript)");
var min = __turbopack_context__.r("[project]/node_modules/math-intrinsics/min.js [app-route] (ecmascript)");
var pow = __turbopack_context__.r("[project]/node_modules/math-intrinsics/pow.js [app-route] (ecmascript)");
var round = __turbopack_context__.r("[project]/node_modules/math-intrinsics/round.js [app-route] (ecmascript)");
var sign = __turbopack_context__.r("[project]/node_modules/math-intrinsics/sign.js [app-route] (ecmascript)");
var $Function = Function;
// eslint-disable-next-line consistent-return
var getEvalledConstructor = function(expressionSyntax) {
    try {
        return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
    } catch (e) {}
};
var $gOPD = __turbopack_context__.r("[project]/node_modules/gopd/index.js [app-route] (ecmascript)");
var $defineProperty = __turbopack_context__.r("[project]/node_modules/es-define-property/index.js [app-route] (ecmascript)");
var throwTypeError = function() {
    throw new $TypeError();
};
var ThrowTypeError = $gOPD ? function() {
    try {
        // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
        arguments.callee; // IE 8 does not throw here
        return throwTypeError;
    } catch (calleeThrows) {
        try {
            // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
            return $gOPD(arguments, 'callee').get;
        } catch (gOPDthrows) {
            return throwTypeError;
        }
    }
}() : throwTypeError;
var hasSymbols = __turbopack_context__.r("[project]/node_modules/has-symbols/index.js [app-route] (ecmascript)")();
var getProto = __turbopack_context__.r("[project]/node_modules/get-proto/index.js [app-route] (ecmascript)");
var $ObjectGPO = __turbopack_context__.r("[project]/node_modules/get-proto/Object.getPrototypeOf.js [app-route] (ecmascript)");
var $ReflectGPO = __turbopack_context__.r("[project]/node_modules/get-proto/Reflect.getPrototypeOf.js [app-route] (ecmascript)");
var $apply = __turbopack_context__.r("[project]/node_modules/call-bind-apply-helpers/functionApply.js [app-route] (ecmascript)");
var $call = __turbopack_context__.r("[project]/node_modules/call-bind-apply-helpers/functionCall.js [app-route] (ecmascript)");
var needsEval = {};
var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);
var INTRINSICS = {
    __proto__: null,
    '%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
    '%Array%': Array,
    '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
    '%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
    '%AsyncFromSyncIteratorPrototype%': undefined,
    '%AsyncFunction%': needsEval,
    '%AsyncGenerator%': needsEval,
    '%AsyncGeneratorFunction%': needsEval,
    '%AsyncIteratorPrototype%': needsEval,
    '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
    '%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
    '%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
    '%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
    '%Boolean%': Boolean,
    '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
    '%Date%': Date,
    '%decodeURI%': decodeURI,
    '%decodeURIComponent%': decodeURIComponent,
    '%encodeURI%': encodeURI,
    '%encodeURIComponent%': encodeURIComponent,
    '%Error%': $Error,
    '%eval%': eval,
    '%EvalError%': $EvalError,
    '%Float16Array%': typeof Float16Array === 'undefined' ? undefined : Float16Array,
    '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
    '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
    '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
    '%Function%': $Function,
    '%GeneratorFunction%': needsEval,
    '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
    '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
    '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
    '%isFinite%': isFinite,
    '%isNaN%': isNaN,
    '%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
    '%JSON%': typeof JSON === 'object' ? JSON : undefined,
    '%Map%': typeof Map === 'undefined' ? undefined : Map,
    '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
    '%Math%': Math,
    '%Number%': Number,
    '%Object%': $Object,
    '%Object.getOwnPropertyDescriptor%': $gOPD,
    '%parseFloat%': parseFloat,
    '%parseInt%': parseInt,
    '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
    '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
    '%RangeError%': $RangeError,
    '%ReferenceError%': $ReferenceError,
    '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
    '%RegExp%': RegExp,
    '%Set%': typeof Set === 'undefined' ? undefined : Set,
    '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
    '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
    '%String%': String,
    '%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
    '%Symbol%': hasSymbols ? Symbol : undefined,
    '%SyntaxError%': $SyntaxError,
    '%ThrowTypeError%': ThrowTypeError,
    '%TypedArray%': TypedArray,
    '%TypeError%': $TypeError,
    '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
    '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
    '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
    '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
    '%URIError%': $URIError,
    '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
    '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
    '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,
    '%Function.prototype.call%': $call,
    '%Function.prototype.apply%': $apply,
    '%Object.defineProperty%': $defineProperty,
    '%Object.getPrototypeOf%': $ObjectGPO,
    '%Math.abs%': abs,
    '%Math.floor%': floor,
    '%Math.max%': max,
    '%Math.min%': min,
    '%Math.pow%': pow,
    '%Math.round%': round,
    '%Math.sign%': sign,
    '%Reflect.getPrototypeOf%': $ReflectGPO
};
if (getProto) {
    try {
        null.error; // eslint-disable-line no-unused-expressions
    } catch (e) {
        // https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
        var errorProto = getProto(getProto(e));
        INTRINSICS['%Error.prototype%'] = errorProto;
    }
}
var doEval = function doEval(name) {
    var value;
    if (name === '%AsyncFunction%') {
        value = getEvalledConstructor('async function () {}');
    } else if (name === '%GeneratorFunction%') {
        value = getEvalledConstructor('function* () {}');
    } else if (name === '%AsyncGeneratorFunction%') {
        value = getEvalledConstructor('async function* () {}');
    } else if (name === '%AsyncGenerator%') {
        var fn = doEval('%AsyncGeneratorFunction%');
        if (fn) {
            value = fn.prototype;
        }
    } else if (name === '%AsyncIteratorPrototype%') {
        var gen = doEval('%AsyncGenerator%');
        if (gen && getProto) {
            value = getProto(gen.prototype);
        }
    }
    INTRINSICS[name] = value;
    return value;
};
var LEGACY_ALIASES = {
    __proto__: null,
    '%ArrayBufferPrototype%': [
        'ArrayBuffer',
        'prototype'
    ],
    '%ArrayPrototype%': [
        'Array',
        'prototype'
    ],
    '%ArrayProto_entries%': [
        'Array',
        'prototype',
        'entries'
    ],
    '%ArrayProto_forEach%': [
        'Array',
        'prototype',
        'forEach'
    ],
    '%ArrayProto_keys%': [
        'Array',
        'prototype',
        'keys'
    ],
    '%ArrayProto_values%': [
        'Array',
        'prototype',
        'values'
    ],
    '%AsyncFunctionPrototype%': [
        'AsyncFunction',
        'prototype'
    ],
    '%AsyncGenerator%': [
        'AsyncGeneratorFunction',
        'prototype'
    ],
    '%AsyncGeneratorPrototype%': [
        'AsyncGeneratorFunction',
        'prototype',
        'prototype'
    ],
    '%BooleanPrototype%': [
        'Boolean',
        'prototype'
    ],
    '%DataViewPrototype%': [
        'DataView',
        'prototype'
    ],
    '%DatePrototype%': [
        'Date',
        'prototype'
    ],
    '%ErrorPrototype%': [
        'Error',
        'prototype'
    ],
    '%EvalErrorPrototype%': [
        'EvalError',
        'prototype'
    ],
    '%Float32ArrayPrototype%': [
        'Float32Array',
        'prototype'
    ],
    '%Float64ArrayPrototype%': [
        'Float64Array',
        'prototype'
    ],
    '%FunctionPrototype%': [
        'Function',
        'prototype'
    ],
    '%Generator%': [
        'GeneratorFunction',
        'prototype'
    ],
    '%GeneratorPrototype%': [
        'GeneratorFunction',
        'prototype',
        'prototype'
    ],
    '%Int8ArrayPrototype%': [
        'Int8Array',
        'prototype'
    ],
    '%Int16ArrayPrototype%': [
        'Int16Array',
        'prototype'
    ],
    '%Int32ArrayPrototype%': [
        'Int32Array',
        'prototype'
    ],
    '%JSONParse%': [
        'JSON',
        'parse'
    ],
    '%JSONStringify%': [
        'JSON',
        'stringify'
    ],
    '%MapPrototype%': [
        'Map',
        'prototype'
    ],
    '%NumberPrototype%': [
        'Number',
        'prototype'
    ],
    '%ObjectPrototype%': [
        'Object',
        'prototype'
    ],
    '%ObjProto_toString%': [
        'Object',
        'prototype',
        'toString'
    ],
    '%ObjProto_valueOf%': [
        'Object',
        'prototype',
        'valueOf'
    ],
    '%PromisePrototype%': [
        'Promise',
        'prototype'
    ],
    '%PromiseProto_then%': [
        'Promise',
        'prototype',
        'then'
    ],
    '%Promise_all%': [
        'Promise',
        'all'
    ],
    '%Promise_reject%': [
        'Promise',
        'reject'
    ],
    '%Promise_resolve%': [
        'Promise',
        'resolve'
    ],
    '%RangeErrorPrototype%': [
        'RangeError',
        'prototype'
    ],
    '%ReferenceErrorPrototype%': [
        'ReferenceError',
        'prototype'
    ],
    '%RegExpPrototype%': [
        'RegExp',
        'prototype'
    ],
    '%SetPrototype%': [
        'Set',
        'prototype'
    ],
    '%SharedArrayBufferPrototype%': [
        'SharedArrayBuffer',
        'prototype'
    ],
    '%StringPrototype%': [
        'String',
        'prototype'
    ],
    '%SymbolPrototype%': [
        'Symbol',
        'prototype'
    ],
    '%SyntaxErrorPrototype%': [
        'SyntaxError',
        'prototype'
    ],
    '%TypedArrayPrototype%': [
        'TypedArray',
        'prototype'
    ],
    '%TypeErrorPrototype%': [
        'TypeError',
        'prototype'
    ],
    '%Uint8ArrayPrototype%': [
        'Uint8Array',
        'prototype'
    ],
    '%Uint8ClampedArrayPrototype%': [
        'Uint8ClampedArray',
        'prototype'
    ],
    '%Uint16ArrayPrototype%': [
        'Uint16Array',
        'prototype'
    ],
    '%Uint32ArrayPrototype%': [
        'Uint32Array',
        'prototype'
    ],
    '%URIErrorPrototype%': [
        'URIError',
        'prototype'
    ],
    '%WeakMapPrototype%': [
        'WeakMap',
        'prototype'
    ],
    '%WeakSetPrototype%': [
        'WeakSet',
        'prototype'
    ]
};
var bind = __turbopack_context__.r("[project]/node_modules/function-bind/index.js [app-route] (ecmascript)");
var hasOwn = __turbopack_context__.r("[project]/node_modules/hasown/index.js [app-route] (ecmascript)");
var $concat = bind.call($call, Array.prototype.concat);
var $spliceApply = bind.call($apply, Array.prototype.splice);
var $replace = bind.call($call, String.prototype.replace);
var $strSlice = bind.call($call, String.prototype.slice);
var $exec = bind.call($call, RegExp.prototype.exec);
/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */ var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */ 
var stringToPath = function stringToPath(string) {
    var first = $strSlice(string, 0, 1);
    var last = $strSlice(string, -1);
    if (first === '%' && last !== '%') {
        throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
    } else if (last === '%' && first !== '%') {
        throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
    }
    var result = [];
    $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
    });
    return result;
};
/* end adaptation */ var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
    var intrinsicName = name;
    var alias;
    if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = '%' + alias[0] + '%';
    }
    if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
            value = doEval(intrinsicName);
        }
        if (typeof value === 'undefined' && !allowMissing) {
            throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
        }
        return {
            alias: alias,
            name: intrinsicName,
            value: value
        };
    }
    throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};
module.exports = function GetIntrinsic(name, allowMissing) {
    if (typeof name !== 'string' || name.length === 0) {
        throw new $TypeError('intrinsic name must be a non-empty string');
    }
    if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
        throw new $TypeError('"allowMissing" argument must be a boolean');
    }
    if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
    }
    var parts = stringToPath(name);
    var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
    var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
    var intrinsicRealName = intrinsic.name;
    var value = intrinsic.value;
    var skipFurtherCaching = false;
    var alias = intrinsic.alias;
    if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([
            0,
            1
        ], alias));
    }
    for(var i = 1, isOwn = true; i < parts.length; i += 1){
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === '`' || last === '"' || last === "'" || last === '`') && first !== last) {
            throw new $SyntaxError('property names with quotes must have matching quotes');
        }
        if (part === 'constructor' || !isOwn) {
            skipFurtherCaching = true;
        }
        intrinsicBaseName += '.' + part;
        intrinsicRealName = '%' + intrinsicBaseName + '%';
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
            if (!(part in value)) {
                if (!allowMissing) {
                    throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
                }
                return void undefined;
            }
            if ($gOPD && i + 1 >= parts.length) {
                var desc = $gOPD(value, part);
                isOwn = !!desc;
                // By convention, when a data property is converted to an accessor
                // property to emulate a data property that does not suffer from
                // the override mistake, that accessor's getter is marked with
                // an `originalValue` property. Here, when we detect this, we
                // uphold the illusion by pretending to see that original data
                // property, i.e., returning the value rather than the getter
                // itself.
                if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
                    value = desc.get;
                } else {
                    value = value[part];
                }
            } else {
                isOwn = hasOwn(value, part);
                value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
                INTRINSICS[intrinsicRealName] = value;
            }
        }
    }
    return value;
};
}),
"[project]/node_modules/has-tostringtag/shams.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var hasSymbols = __turbopack_context__.r("[project]/node_modules/has-symbols/shams.js [app-route] (ecmascript)");
/** @type {import('.')} */ module.exports = function hasToStringTagShams() {
    return hasSymbols() && !!Symbol.toStringTag;
};
}),
"[project]/node_modules/es-set-tostringtag/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var GetIntrinsic = __turbopack_context__.r("[project]/node_modules/get-intrinsic/index.js [app-route] (ecmascript)");
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var hasToStringTag = __turbopack_context__.r("[project]/node_modules/has-tostringtag/shams.js [app-route] (ecmascript)")();
var hasOwn = __turbopack_context__.r("[project]/node_modules/hasown/index.js [app-route] (ecmascript)");
var $TypeError = __turbopack_context__.r("[project]/node_modules/es-errors/type.js [app-route] (ecmascript)");
var toStringTag = hasToStringTag ? Symbol.toStringTag : null;
/** @type {import('.')} */ module.exports = function setToStringTag(object, value) {
    var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
    var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
    if (typeof overrideIfSet !== 'undefined' && typeof overrideIfSet !== 'boolean' || typeof nonConfigurable !== 'undefined' && typeof nonConfigurable !== 'boolean') {
        throw new $TypeError('if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans');
    }
    if (toStringTag && (overrideIfSet || !hasOwn(object, toStringTag))) {
        if ($defineProperty) {
            $defineProperty(object, toStringTag, {
                configurable: !nonConfigurable,
                enumerable: false,
                value: value,
                writable: false
            });
        } else {
            object[toStringTag] = value; // eslint-disable-line no-param-reassign
        }
    }
};
}),
"[project]/node_modules/form-data/lib/populate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// populates missing values
module.exports = function(dst, src) {
    Object.keys(src).forEach(function(prop) {
        dst[prop] = dst[prop] || src[prop]; // eslint-disable-line no-param-reassign
    });
    return dst;
};
}),
"[project]/node_modules/form-data/lib/form_data.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var CombinedStream = __turbopack_context__.r("[project]/node_modules/combined-stream/lib/combined_stream.js [app-route] (ecmascript)");
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
var http = __turbopack_context__.r("[externals]/http [external] (http, cjs)");
var https = __turbopack_context__.r("[externals]/https [external] (https, cjs)");
var parseUrl = __turbopack_context__.r("[externals]/url [external] (url, cjs)").parse;
var fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Stream;
var crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
var mime = __turbopack_context__.r("[project]/node_modules/form-data/node_modules/mime-types/index.js [app-route] (ecmascript)");
var asynckit = __turbopack_context__.r("[project]/node_modules/asynckit/index.js [app-route] (ecmascript)");
var setToStringTag = __turbopack_context__.r("[project]/node_modules/es-set-tostringtag/index.js [app-route] (ecmascript)");
var hasOwn = __turbopack_context__.r("[project]/node_modules/hasown/index.js [app-route] (ecmascript)");
var populate = __turbopack_context__.r("[project]/node_modules/form-data/lib/populate.js [app-route] (ecmascript)");
/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {object} options - Properties to be added/overriden for FormData and CombinedStream
 */ function FormData(options) {
    if (!(this instanceof FormData)) {
        return new FormData(options);
    }
    this._overheadLength = 0;
    this._valueLength = 0;
    this._valuesToMeasure = [];
    CombinedStream.call(this);
    options = options || {}; // eslint-disable-line no-param-reassign
    for(var option in options){
        this[option] = options[option];
    }
}
// make it a Stream
util.inherits(FormData, CombinedStream);
FormData.LINE_BREAK = '\r\n';
FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';
FormData.prototype.append = function(field, value, options) {
    options = options || {}; // eslint-disable-line no-param-reassign
    // allow filename as single option
    if (typeof options === 'string') {
        options = {
            filename: options
        }; // eslint-disable-line no-param-reassign
    }
    var append = CombinedStream.prototype.append.bind(this);
    // all that streamy business can't handle numbers
    if (typeof value === 'number' || value == null) {
        value = String(value); // eslint-disable-line no-param-reassign
    }
    // https://github.com/felixge/node-form-data/issues/38
    if (Array.isArray(value)) {
        /*
     * Please convert your array into string
     * the way web server expects it
     */ this._error(new Error('Arrays are not supported.'));
        return;
    }
    var header = this._multiPartHeader(field, value, options);
    var footer = this._multiPartFooter();
    append(header);
    append(value);
    append(footer);
    // pass along options.knownLength
    this._trackLength(header, value, options);
};
FormData.prototype._trackLength = function(header, value, options) {
    var valueLength = 0;
    /*
   * used w/ getLengthSync(), when length is known.
   * e.g. for streaming directly from a remote server,
   * w/ a known file a size, and not wanting to wait for
   * incoming file to finish to get its size.
   */ if (options.knownLength != null) {
        valueLength += Number(options.knownLength);
    } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
    } else if (typeof value === 'string') {
        valueLength = Buffer.byteLength(value);
    }
    this._valueLength += valueLength;
    // @check why add CRLF? does this account for custom/multiple CRLFs?
    this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;
    // empty or either doesn't have path or not an http response or not a stream
    if (!value || !value.path && !(value.readable && hasOwn(value, 'httpVersion')) && !(value instanceof Stream)) {
        return;
    }
    // no need to bother with the length
    if (!options.knownLength) {
        this._valuesToMeasure.push(value);
    }
};
FormData.prototype._lengthRetriever = function(value, callback) {
    if (hasOwn(value, 'fd')) {
        // take read range into a account
        // `end` = Infinity –> read file till the end
        //
        // TODO: Looks like there is bug in Node fs.createReadStream
        // it doesn't respect `end` options without `start` options
        // Fix it when node fixes it.
        // https://github.com/joyent/node/issues/7819
        if (value.end != undefined && value.end != Infinity && value.start != undefined) {
            // when end specified
            // no need to calculate range
            // inclusive, starts with 0
            callback(null, value.end + 1 - (value.start ? value.start : 0)); // eslint-disable-line callback-return
        // not that fast snoopy
        } else {
            // still need to fetch file size from fs
            fs.stat(value.path, function(err, stat) {
                if (err) {
                    callback(err);
                    return;
                }
                // update final size based on the range options
                var fileSize = stat.size - (value.start ? value.start : 0);
                callback(null, fileSize);
            });
        }
    // or http response
    } else if (hasOwn(value, 'httpVersion')) {
        callback(null, Number(value.headers['content-length'])); // eslint-disable-line callback-return
    // or request stream http://github.com/mikeal/request
    } else if (hasOwn(value, 'httpModule')) {
        // wait till response come back
        value.on('response', function(response) {
            value.pause();
            callback(null, Number(response.headers['content-length']));
        });
        value.resume();
    // something else
    } else {
        callback('Unknown stream'); // eslint-disable-line callback-return
    }
};
FormData.prototype._multiPartHeader = function(field, value, options) {
    /*
   * custom header specified (as string)?
   * it becomes responsible for boundary
   * (e.g. to handle extra CRLFs on .NET servers)
   */ if (typeof options.header === 'string') {
        return options.header;
    }
    var contentDisposition = this._getContentDisposition(value, options);
    var contentType = this._getContentType(value, options);
    var contents = '';
    var headers = {
        // add custom disposition as third element or keep it two elements if not
        'Content-Disposition': [
            'form-data',
            'name="' + field + '"'
        ].concat(contentDisposition || []),
        // if no content type. allow it to be empty array
        'Content-Type': [].concat(contentType || [])
    };
    // allow custom headers.
    if (typeof options.header === 'object') {
        populate(headers, options.header);
    }
    var header;
    for(var prop in headers){
        if (hasOwn(headers, prop)) {
            header = headers[prop];
            // skip nullish headers.
            if (header == null) {
                continue; // eslint-disable-line no-restricted-syntax, no-continue
            }
            // convert all headers to arrays.
            if (!Array.isArray(header)) {
                header = [
                    header
                ];
            }
            // add non-empty headers.
            if (header.length) {
                contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
            }
        }
    }
    return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
};
FormData.prototype._getContentDisposition = function(value, options) {
    var filename;
    if (typeof options.filepath === 'string') {
        // custom filepath for relative paths
        filename = path.normalize(options.filepath).replace(/\\/g, '/');
    } else if (options.filename || value && (value.name || value.path)) {
        /*
     * custom filename take precedence
     * formidable and the browser add a name property
     * fs- and request- streams have path property
     */ filename = path.basename(options.filename || value && (value.name || value.path));
    } else if (value && value.readable && hasOwn(value, 'httpVersion')) {
        // or try http response
        filename = path.basename(value.client._httpMessage.path || '');
    }
    if (filename) {
        return 'filename="' + filename + '"';
    }
};
FormData.prototype._getContentType = function(value, options) {
    // use custom content-type above all
    var contentType = options.contentType;
    // or try `name` from formidable, browser
    if (!contentType && value && value.name) {
        contentType = mime.lookup(value.name);
    }
    // or try `path` from fs-, request- streams
    if (!contentType && value && value.path) {
        contentType = mime.lookup(value.path);
    }
    // or if it's http-reponse
    if (!contentType && value && value.readable && hasOwn(value, 'httpVersion')) {
        contentType = value.headers['content-type'];
    }
    // or guess it from the filepath or filename
    if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
    }
    // fallback to the default content type if `value` is not simple value
    if (!contentType && value && typeof value === 'object') {
        contentType = FormData.DEFAULT_CONTENT_TYPE;
    }
    return contentType;
};
FormData.prototype._multiPartFooter = function() {
    return (function(next) {
        var footer = FormData.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
            footer += this._lastBoundary();
        }
        next(footer);
    }).bind(this);
};
FormData.prototype._lastBoundary = function() {
    return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
};
FormData.prototype.getHeaders = function(userHeaders) {
    var header;
    var formHeaders = {
        'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
    };
    for(header in userHeaders){
        if (hasOwn(userHeaders, header)) {
            formHeaders[header.toLowerCase()] = userHeaders[header];
        }
    }
    return formHeaders;
};
FormData.prototype.setBoundary = function(boundary) {
    if (typeof boundary !== 'string') {
        throw new TypeError('FormData boundary must be a string');
    }
    this._boundary = boundary;
};
FormData.prototype.getBoundary = function() {
    if (!this._boundary) {
        this._generateBoundary();
    }
    return this._boundary;
};
FormData.prototype.getBuffer = function() {
    var dataBuffer = new Buffer.alloc(0); // eslint-disable-line new-cap
    var boundary = this.getBoundary();
    // Create the form content. Add Line breaks to the end of data.
    for(var i = 0, len = this._streams.length; i < len; i++){
        if (typeof this._streams[i] !== 'function') {
            // Add content to the buffer.
            if (Buffer.isBuffer(this._streams[i])) {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    this._streams[i]
                ]);
            } else {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    Buffer.from(this._streams[i])
                ]);
            }
            // Add break after content.
            if (typeof this._streams[i] !== 'string' || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    Buffer.from(FormData.LINE_BREAK)
                ]);
            }
        }
    }
    // Add the footer and return the Buffer object.
    return Buffer.concat([
        dataBuffer,
        Buffer.from(this._lastBoundary())
    ]);
};
FormData.prototype._generateBoundary = function() {
    // This generates a 50 character boundary similar to those used by Firefox.
    // They are optimized for boyer-moore parsing.
    this._boundary = '--------------------------' + crypto.randomBytes(12).toString('hex');
};
// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually and add it as knownLength option
FormData.prototype.getLengthSync = function() {
    var knownLength = this._overheadLength + this._valueLength;
    // Don't get confused, there are 3 "internal" streams for each keyval pair so it basically checks if there is any value added to the form
    if (this._streams.length) {
        knownLength += this._lastBoundary().length;
    }
    // https://github.com/form-data/form-data/issues/40
    if (!this.hasKnownLength()) {
        /*
     * Some async length retrievers are present
     * therefore synchronous length calculation is false.
     * Please use getLength(callback) to get proper length
     */ this._error(new Error('Cannot calculate proper length in synchronous way.'));
    }
    return knownLength;
};
// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function() {
    var hasKnownLength = true;
    if (this._valuesToMeasure.length) {
        hasKnownLength = false;
    }
    return hasKnownLength;
};
FormData.prototype.getLength = function(cb) {
    var knownLength = this._overheadLength + this._valueLength;
    if (this._streams.length) {
        knownLength += this._lastBoundary().length;
    }
    if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
    }
    asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
        if (err) {
            cb(err);
            return;
        }
        values.forEach(function(length) {
            knownLength += length;
        });
        cb(null, knownLength);
    });
};
FormData.prototype.submit = function(params, cb) {
    var request;
    var options;
    var defaults = {
        method: 'post'
    };
    // parse provided url if it's string or treat it as options object
    if (typeof params === 'string') {
        params = parseUrl(params); // eslint-disable-line no-param-reassign
        /* eslint sort-keys: 0 */ options = populate({
            port: params.port,
            path: params.pathname,
            host: params.hostname,
            protocol: params.protocol
        }, defaults);
    } else {
        options = populate(params, defaults);
        // if no port provided use default one
        if (!options.port) {
            options.port = options.protocol === 'https:' ? 443 : 80;
        }
    }
    // put that good code in getHeaders to some use
    options.headers = this.getHeaders(params.headers);
    // https if specified, fallback to http in any other case
    if (options.protocol === 'https:') {
        request = https.request(options);
    } else {
        request = http.request(options);
    }
    // get content length and fire away
    this.getLength((function(err, length) {
        if (err && err !== 'Unknown stream') {
            this._error(err);
            return;
        }
        // add content length
        if (length) {
            request.setHeader('Content-Length', length);
        }
        this.pipe(request);
        if (cb) {
            var onResponse;
            var callback = function(error, responce) {
                request.removeListener('error', callback);
                request.removeListener('response', onResponse);
                return cb.call(this, error, responce);
            };
            onResponse = callback.bind(this, null);
            request.on('error', callback);
            request.on('response', onResponse);
        }
    }).bind(this));
    return request;
};
FormData.prototype._error = function(err) {
    if (!this.error) {
        this.error = err;
        this.pause();
        this.emit('error', err);
    }
};
FormData.prototype.toString = function() {
    return '[object FormData]';
};
setToStringTag(FormData.prototype, 'FormData');
// Public API
module.exports = FormData;
}),
"[project]/node_modules/proxy-from-env/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var parseUrl = __turbopack_context__.r("[externals]/url [external] (url, cjs)").parse;
var DEFAULT_PORTS = {
    ftp: 21,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
};
var stringEndsWith = String.prototype.endsWith || function(s) {
    return s.length <= this.length && this.indexOf(s, this.length - s.length) !== -1;
};
/**
 * @param {string|object} url - The URL, or the result from url.parse.
 * @return {string} The URL of the proxy that should handle the request to the
 *  given URL. If no proxy is set, this will be an empty string.
 */ function getProxyForUrl(url) {
    var parsedUrl = typeof url === 'string' ? parseUrl(url) : url || {};
    var proto = parsedUrl.protocol;
    var hostname = parsedUrl.host;
    var port = parsedUrl.port;
    if (typeof hostname !== 'string' || !hostname || typeof proto !== 'string') {
        return ''; // Don't proxy URLs without a valid scheme or host.
    }
    proto = proto.split(':', 1)[0];
    // Stripping ports in this way instead of using parsedUrl.hostname to make
    // sure that the brackets around IPv6 addresses are kept.
    hostname = hostname.replace(/:\d*$/, '');
    port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
    if (!shouldProxy(hostname, port)) {
        return ''; // Don't proxy URLs that match NO_PROXY.
    }
    var proxy = getEnv('npm_config_' + proto + '_proxy') || getEnv(proto + '_proxy') || getEnv('npm_config_proxy') || getEnv('all_proxy');
    if (proxy && proxy.indexOf('://') === -1) {
        // Missing scheme in proxy, default to the requested URL's scheme.
        proxy = proto + '://' + proxy;
    }
    return proxy;
}
/**
 * Determines whether a given URL should be proxied.
 *
 * @param {string} hostname - The host name of the URL.
 * @param {number} port - The effective port of the URL.
 * @returns {boolean} Whether the given URL should be proxied.
 * @private
 */ function shouldProxy(hostname, port) {
    var NO_PROXY = (getEnv('npm_config_no_proxy') || getEnv('no_proxy')).toLowerCase();
    if (!NO_PROXY) {
        return true; // Always proxy if NO_PROXY is not set.
    }
    if (NO_PROXY === '*') {
        return false; // Never proxy if wildcard is set.
    }
    return NO_PROXY.split(/[,\s]/).every(function(proxy) {
        if (!proxy) {
            return true; // Skip zero-length hosts.
        }
        var parsedProxy = proxy.match(/^(.+):(\d+)$/);
        var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
        var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
        if (parsedProxyPort && parsedProxyPort !== port) {
            return true; // Skip if ports don't match.
        }
        if (!/^[.*]/.test(parsedProxyHostname)) {
            // No wildcards, so stop proxying if there is an exact match.
            return hostname !== parsedProxyHostname;
        }
        if (parsedProxyHostname.charAt(0) === '*') {
            // Remove leading wildcard.
            parsedProxyHostname = parsedProxyHostname.slice(1);
        }
        // Stop proxying if the hostname ends with the no_proxy host.
        return !stringEndsWith.call(hostname, parsedProxyHostname);
    });
}
/**
 * Get the value for an environment variable.
 *
 * @param {string} key - The name of the environment variable.
 * @return {string} The value of the environment variable.
 * @private
 */ function getEnv(key) {
    return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || '';
}
exports.getProxyForUrl = getProxyForUrl;
}),
"[project]/node_modules/ms/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Helpers.
 */ var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */ module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
        return parse(val);
    } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};
/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */ function parse(str) {
    str = String(str);
    if (str.length > 100) {
        return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
        return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch(type){
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y;
        case 'weeks':
        case 'week':
        case 'w':
            return n * w;
        case 'days':
        case 'day':
        case 'd':
            return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n;
        default:
            return undefined;
    }
}
/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
    }
    if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
    }
    if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
    }
    if (msAbs >= s) {
        return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
}
/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
    }
    return ms + ' ms';
}
/**
 * Pluralization helper.
 */ function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}
}),
"[project]/node_modules/debug/src/common.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */ function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = __turbopack_context__.r("[project]/node_modules/ms/index.js [app-route] (ecmascript)");
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key)=>{
        createDebug[key] = env[key];
    });
    /**
	* The currently active debug mode names, and names to skip.
	*/ createDebug.names = [];
    createDebug.skips = [];
    /**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/ createDebug.formatters = {};
    /**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/ function selectColor(namespace) {
        let hash = 0;
        for(let i = 0; i < namespace.length; i++){
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    /**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/ function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
            // Disabled?
            if (!debug.enabled) {
                return;
            }
            const self = debug;
            // Set `diff` timestamp
            const curr = Number(new Date());
            const ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== 'string') {
                // Anything else let's inspect with %O
                args.unshift('%O');
            }
            // Apply any `formatters` transformations
            let index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format)=>{
                // If we encounter an escaped % then don't increase the array index
                if (match === '%%') {
                    return '%';
                }
                index++;
                const formatter = createDebug.formatters[format];
                if (typeof formatter === 'function') {
                    const val = args[index];
                    match = formatter.call(self, val);
                    // Now we need to remove `args[index]` since it's inlined in the `format`
                    args.splice(index, 1);
                    index--;
                }
                return match;
            });
            // Apply env-specific formatting (colors, etc.)
            createDebug.formatArgs.call(self, args);
            const logFn = self.log || createDebug.log;
            logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.
        Object.defineProperty(debug, 'enabled', {
            enumerable: true,
            configurable: false,
            get: ()=>{
                if (enableOverride !== null) {
                    return enableOverride;
                }
                if (namespacesCache !== createDebug.namespaces) {
                    namespacesCache = createDebug.namespaces;
                    enabledCache = createDebug.enabled(namespace);
                }
                return enabledCache;
            },
            set: (v)=>{
                enableOverride = v;
            }
        });
        // Env-specific initialization logic for debug instances
        if (typeof createDebug.init === 'function') {
            createDebug.init(debug);
        }
        return debug;
    }
    function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
    }
    /**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/ function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === 'string' ? namespaces : '').trim().replace(/\s+/g, ',').split(',').filter(Boolean);
        for (const ns of split){
            if (ns[0] === '-') {
                createDebug.skips.push(ns.slice(1));
            } else {
                createDebug.names.push(ns);
            }
        }
    }
    /**
	 * Checks if the given string matches a namespace template, honoring
	 * asterisks as wildcards.
	 *
	 * @param {String} search
	 * @param {String} template
	 * @return {Boolean}
	 */ function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while(searchIndex < search.length){
            if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
                // Match character or proceed with wildcard
                if (template[templateIndex] === '*') {
                    starIndex = templateIndex;
                    matchIndex = searchIndex;
                    templateIndex++; // Skip the '*'
                } else {
                    searchIndex++;
                    templateIndex++;
                }
            } else if (starIndex !== -1) {
                // Backtrack to the last '*' and try to match more characters
                templateIndex = starIndex + 1;
                matchIndex++;
                searchIndex = matchIndex;
            } else {
                return false; // No match
            }
        }
        // Handle trailing '*' in template
        while(templateIndex < template.length && template[templateIndex] === '*'){
            templateIndex++;
        }
        return templateIndex === template.length;
    }
    /**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/ function disable() {
        const namespaces = [
            ...createDebug.names,
            ...createDebug.skips.map((namespace)=>'-' + namespace)
        ].join(',');
        createDebug.enable('');
        return namespaces;
    }
    /**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/ function enabled(name) {
        for (const skip of createDebug.skips){
            if (matchesTemplate(name, skip)) {
                return false;
            }
        }
        for (const ns of createDebug.names){
            if (matchesTemplate(name, ns)) {
                return true;
            }
        }
        return false;
    }
    /**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/ function coerce(val) {
        if (val instanceof Error) {
            return val.stack || val.message;
        }
        return val;
    }
    /**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/ function destroy() {
        console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    }
    createDebug.enable(createDebug.load());
    return createDebug;
}
module.exports = setup;
}),
"[project]/node_modules/debug/src/node.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Module dependencies.
 */ const tty = __turbopack_context__.r("[externals]/tty [external] (tty, cjs)");
const util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
/**
 * This is the Node.js implementation of `debug()`.
 */ exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(()=>{}, 'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
/**
 * Colors.
 */ exports.colors = [
    6,
    2,
    3,
    4,
    5,
    1
];
try {
    // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
    // eslint-disable-next-line import/no-extraneous-dependencies
    const supportsColor = __turbopack_context__.r("[project]/node_modules/supports-color/index.js [app-route] (ecmascript)");
    if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
            20,
            21,
            26,
            27,
            32,
            33,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            56,
            57,
            62,
            63,
            68,
            69,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            92,
            93,
            98,
            99,
            112,
            113,
            128,
            129,
            134,
            135,
            148,
            149,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            178,
            179,
            184,
            185,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            214,
            215,
            220,
            221
        ];
    }
} catch (error) {
// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}
/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */ exports.inspectOpts = Object.keys(process.env).filter((key)=>{
    return /^debug_/i.test(key);
}).reduce((obj, key)=>{
    // Camel-case
    const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k)=>{
        return k.toUpperCase();
    });
    // Coerce string value into JS value
    let val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
    } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
    } else if (val === 'null') {
        val = null;
    } else {
        val = Number(val);
    }
    obj[prop] = val;
    return obj;
}, {});
/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */ function useColors() {
    return 'colors' in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    const { namespace: name, useColors } = this;
    if (useColors) {
        const c = this.color;
        const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
        const prefix = `  ${colorCode};1m${name} \u001B[0m`;
        args[0] = prefix + args[0].split('\n').join('\n' + prefix);
        args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
    } else {
        args[0] = getDate() + name + ' ' + args[0];
    }
}
function getDate() {
    if (exports.inspectOpts.hideDate) {
        return '';
    }
    return new Date().toISOString() + ' ';
}
/**
 * Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
 */ function log(...args) {
    return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + '\n');
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    if (namespaces) {
        process.env.DEBUG = namespaces;
    } else {
        // If you set a process.env field to null or undefined, it gets cast to the
        // string 'null' or 'undefined'. Just delete instead.
        delete process.env.DEBUG;
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    return process.env.DEBUG;
}
/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */ function init(debug) {
    debug.inspectOpts = {};
    const keys = Object.keys(exports.inspectOpts);
    for(let i = 0; i < keys.length; i++){
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
}
module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/common.js [app-route] (ecmascript)")(exports);
const { formatters } = module.exports;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */ formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).split('\n').map((str)=>str.trim()).join(' ');
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */ formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
};
}),
"[project]/node_modules/debug/src/browser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* eslint-env browser */ /**
 * This is the web browser implementation of `debug()`.
 */ exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (()=>{
    let warned = false;
    return ()=>{
        if (!warned) {
            warned = true;
            console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
        }
    };
})();
/**
 * Colors.
 */ exports.colors = [
    '#0000CC',
    '#0000FF',
    '#0033CC',
    '#0033FF',
    '#0066CC',
    '#0066FF',
    '#0099CC',
    '#0099FF',
    '#00CC00',
    '#00CC33',
    '#00CC66',
    '#00CC99',
    '#00CCCC',
    '#00CCFF',
    '#3300CC',
    '#3300FF',
    '#3333CC',
    '#3333FF',
    '#3366CC',
    '#3366FF',
    '#3399CC',
    '#3399FF',
    '#33CC00',
    '#33CC33',
    '#33CC66',
    '#33CC99',
    '#33CCCC',
    '#33CCFF',
    '#6600CC',
    '#6600FF',
    '#6633CC',
    '#6633FF',
    '#66CC00',
    '#66CC33',
    '#9900CC',
    '#9900FF',
    '#9933CC',
    '#9933FF',
    '#99CC00',
    '#99CC33',
    '#CC0000',
    '#CC0033',
    '#CC0066',
    '#CC0099',
    '#CC00CC',
    '#CC00FF',
    '#CC3300',
    '#CC3333',
    '#CC3366',
    '#CC3399',
    '#CC33CC',
    '#CC33FF',
    '#CC6600',
    '#CC6633',
    '#CC9900',
    '#CC9933',
    '#CCCC00',
    '#CCCC33',
    '#FF0000',
    '#FF0033',
    '#FF0066',
    '#FF0099',
    '#FF00CC',
    '#FF00FF',
    '#FF3300',
    '#FF3333',
    '#FF3366',
    '#FF3399',
    '#FF33CC',
    '#FF33FF',
    '#FF6600',
    '#FF6633',
    '#FF9900',
    '#FF9933',
    '#FFCC00',
    '#FFCC33'
];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */ // eslint-disable-next-line complexity
function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Internet Explorer and Edge do not support colors.
    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
    }
    let m;
    // Is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    // eslint-disable-next-line no-return-assign
    return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || ("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);
    if (!this.useColors) {
        return;
    }
    const c = 'color: ' + this.color;
    args.splice(1, 0, c, 'color: inherit');
    // The final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match)=>{
        if (match === '%%') {
            return;
        }
        index++;
        if (match === '%c') {
            // We only are interested in the *last* %c
            // (the user may have provided their own)
            lastC = index;
        }
    });
    args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */ exports.log = console.debug || console.log || (()=>{});
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    try {
        if (namespaces) {
            exports.storage.setItem('debug', namespaces);
        } else {
            exports.storage.removeItem('debug');
        }
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    let r;
    try {
        r = exports.storage.getItem('debug') || exports.storage.getItem('DEBUG');
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== 'undefined' && 'env' in process) {
        r = process.env.DEBUG;
    }
    return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */ function localstorage() {
    try {
        // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
        // The Browser also has localStorage in the global context.
        return localStorage;
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/common.js [app-route] (ecmascript)")(exports);
const { formatters } = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */ formatters.j = function(v) {
    try {
        return JSON.stringify(v);
    } catch (error) {
        return '[UnexpectedJSONParseError]: ' + error.message;
    }
};
}),
"[project]/node_modules/debug/src/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */ if (typeof process === 'undefined' || process.type === 'renderer' || ("TURBOPACK compile-time value", false) === true || process.__nwjs) {
    module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/browser.js [app-route] (ecmascript)");
} else {
    module.exports = __turbopack_context__.r("[project]/node_modules/debug/src/node.js [app-route] (ecmascript)");
}
}),
"[project]/node_modules/has-flag/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = (flag, argv = process.argv)=>{
    const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--';
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf('--');
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};
}),
"[project]/node_modules/supports-color/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const os = __turbopack_context__.r("[externals]/os [external] (os, cjs)");
const tty = __turbopack_context__.r("[externals]/tty [external] (tty, cjs)");
const hasFlag = __turbopack_context__.r("[project]/node_modules/has-flag/index.js [app-route] (ecmascript)");
const { env } = process;
let forceColor;
if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false') || hasFlag('color=never')) {
    forceColor = 0;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
    forceColor = 1;
}
if ('FORCE_COLOR' in env) {
    if (env.FORCE_COLOR === 'true') {
        forceColor = 1;
    } else if (env.FORCE_COLOR === 'false') {
        forceColor = 0;
    } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
}
function translateLevel(level) {
    if (level === 0) {
        return false;
    }
    return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
    };
}
function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
        return 0;
    }
    if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) {
        return 3;
    }
    if (hasFlag('color=256')) {
        return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === undefined) {
        return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === 'dumb') {
        return min;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        // Windows 10 build 10586 is the first Windows release that supports 256 colors.
        // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
        const osRelease = os.release().split('.');
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
            return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
    }
    //TURBOPACK unreachable
    ;
}
function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
}
module.exports = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};
}),
"[project]/node_modules/follow-redirects/debug.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var debug;
module.exports = function() {
    if (!debug) {
        try {
            /* eslint global-require: off */ debug = __turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)")("follow-redirects");
        } catch (error) {}
        if (typeof debug !== "function") {
            debug = function() {};
        }
    }
    debug.apply(null, arguments);
};
}),
"[project]/node_modules/follow-redirects/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var url = __turbopack_context__.r("[externals]/url [external] (url, cjs)");
var URL = url.URL;
var http = __turbopack_context__.r("[externals]/http [external] (http, cjs)");
var https = __turbopack_context__.r("[externals]/https [external] (https, cjs)");
var Writable = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)").Writable;
var assert = __turbopack_context__.r("[externals]/assert [external] (assert, cjs)");
var debug = __turbopack_context__.r("[project]/node_modules/follow-redirects/debug.js [app-route] (ecmascript)");
// Preventive platform detection
// istanbul ignore next
(function detectUnsupportedEnvironment() {
    var looksLikeNode = typeof process !== "undefined";
    var looksLikeBrowser = ("TURBOPACK compile-time value", "undefined") !== "undefined" && typeof document !== "undefined";
    var looksLikeV8 = isFunction(Error.captureStackTrace);
    if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) {
        console.warn("The follow-redirects package should be excluded from browser builds.");
    }
})();
// Whether to use the native URL object or the legacy url module
var useNativeURL = false;
try {
    assert(new URL(""));
} catch (error) {
    useNativeURL = error.code === "ERR_INVALID_URL";
}
// URL fields to preserve in copy operations
var preservedUrlFields = [
    "auth",
    "host",
    "hostname",
    "href",
    "path",
    "pathname",
    "port",
    "protocol",
    "query",
    "search",
    "hash"
];
// Create handlers that pass events from native requests
var events = [
    "abort",
    "aborted",
    "connect",
    "error",
    "socket",
    "timeout"
];
var eventHandlers = Object.create(null);
events.forEach(function(event) {
    eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
    };
});
// Error types with codes
var InvalidUrlError = createErrorType("ERR_INVALID_URL", "Invalid URL", TypeError);
var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "Redirected request failed");
var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded", RedirectionError);
var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
// istanbul ignore next
var destroy = Writable.prototype.destroy || noop;
// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
    // Initialize the request
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];
    // Attach a callback if passed
    if (responseCallback) {
        this.on("response", responseCallback);
    }
    // React to responses of native requests
    var self = this;
    this._onNativeResponse = function(response) {
        try {
            self._processResponse(response);
        } catch (cause) {
            self.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({
                cause: cause
            }));
        }
    };
    // Perform the first request
    this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);
RedirectableRequest.prototype.abort = function() {
    destroyRequest(this._currentRequest);
    this._currentRequest.abort();
    this.emit("abort");
};
RedirectableRequest.prototype.destroy = function(error) {
    destroyRequest(this._currentRequest, error);
    destroy.call(this, error);
    return this;
};
// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function(data, encoding, callback) {
    // Writing is not allowed if end has been called
    if (this._ending) {
        throw new WriteAfterEndError();
    }
    // Validate input and shift parameters if necessary
    if (!isString(data) && !isBuffer(data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
    }
    // Ignore empty buffers, since writing them doesn't invoke the callback
    // https://github.com/nodejs/node/issues/22066
    if (data.length === 0) {
        if (callback) {
            callback();
        }
        return;
    }
    // Only write when we don't exceed the maximum body length
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({
            data: data,
            encoding: encoding
        });
        this._currentRequest.write(data, encoding, callback);
    } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
    }
};
// Ends the current native request
RedirectableRequest.prototype.end = function(data, encoding, callback) {
    // Shift parameters if necessary
    if (isFunction(data)) {
        callback = data;
        data = encoding = null;
    } else if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
    }
    // Write data if needed and end
    if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
    } else {
        var self = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function() {
            self._ended = true;
            currentRequest.end(null, null, callback);
        });
        this._ending = true;
    }
};
// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function(name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
};
// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function(name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
};
// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
    var self = this;
    // Destroys the socket on timeout
    function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
    }
    // Sets up a timer to trigger a timeout event
    function startTimer(socket) {
        if (self._timeout) {
            clearTimeout(self._timeout);
        }
        self._timeout = setTimeout(function() {
            self.emit("timeout");
            clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
    }
    // Stops a timeout from triggering
    function clearTimer() {
        // Clear the timeout
        if (self._timeout) {
            clearTimeout(self._timeout);
            self._timeout = null;
        }
        // Clean up all attached listeners
        self.removeListener("abort", clearTimer);
        self.removeListener("error", clearTimer);
        self.removeListener("response", clearTimer);
        self.removeListener("close", clearTimer);
        if (callback) {
            self.removeListener("timeout", callback);
        }
        if (!self.socket) {
            self._currentRequest.removeListener("socket", startTimer);
        }
    }
    // Attach callback if passed
    if (callback) {
        this.on("timeout", callback);
    }
    // Start the timer if or when the socket is opened
    if (this.socket) {
        startTimer(this.socket);
    } else {
        this._currentRequest.once("socket", startTimer);
    }
    // Clean up on events
    this.on("socket", destroyOnTimeout);
    this.on("abort", clearTimer);
    this.on("error", clearTimer);
    this.on("response", clearTimer);
    this.on("close", clearTimer);
    return this;
};
// Proxy all other public ClientRequest methods
[
    "flushHeaders",
    "getHeader",
    "setNoDelay",
    "setSocketKeepAlive"
].forEach(function(method) {
    RedirectableRequest.prototype[method] = function(a, b) {
        return this._currentRequest[method](a, b);
    };
});
// Proxy all public ClientRequest properties
[
    "aborted",
    "connection",
    "socket"
].forEach(function(property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function() {
            return this._currentRequest[property];
        }
    });
});
RedirectableRequest.prototype._sanitizeOptions = function(options) {
    // Ensure headers are always present
    if (!options.headers) {
        options.headers = {};
    }
    // Since http.request treats host as an alias of hostname,
    // but the url module interprets host as hostname plus port,
    // eliminate the host property to avoid confusion.
    if (options.host) {
        // Use hostname if set, because it has precedence
        if (!options.hostname) {
            options.hostname = options.host;
        }
        delete options.host;
    }
    // Complete the URL object when necessary
    if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
            options.pathname = options.path;
        } else {
            options.pathname = options.path.substring(0, searchPos);
            options.search = options.path.substring(searchPos);
        }
    }
};
// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function() {
    // Load the native protocol
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
        throw new TypeError("Unsupported protocol " + protocol);
    }
    // If specified, use the agent corresponding to the protocol
    // (HTTP and HTTPS use different types of agents)
    if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
    }
    // Create the native request and set up its event handlers
    var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
    request._redirectable = this;
    for (var event of events){
        request.on(event, eventHandlers[event]);
    }
    // RFC7230§5.3.1: When making a request directly to an origin server, […]
    // a client MUST send only the absolute path […] as the request-target.
    this._currentUrl = /^\//.test(this._options.path) ? url.format(this._options) : // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path;
    // End a redirected request
    // (The first request must be ended explicitly with RedirectableRequest#end)
    if (this._isRedirect) {
        // Write the request entity and end
        var i = 0;
        var self = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
            // Only write if this request has not been redirected yet
            // istanbul ignore else
            if (request === self._currentRequest) {
                // Report any write errors
                // istanbul ignore if
                if (error) {
                    self.emit("error", error);
                } else if (i < buffers.length) {
                    var buffer = buffers[i++];
                    // istanbul ignore else
                    if (!request.finished) {
                        request.write(buffer.data, buffer.encoding, writeNext);
                    }
                } else if (self._ended) {
                    request.end();
                }
            }
        })();
    }
};
// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function(response) {
    // Store the redirected response
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
        this._redirects.push({
            url: this._currentUrl,
            headers: response.headers,
            statusCode: statusCode
        });
    }
    // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
    // that further action needs to be taken by the user agent in order to
    // fulfill the request. If a Location header field is provided,
    // the user agent MAY automatically redirect its request to the URI
    // referenced by the Location field value,
    // even if the specific status code is not understood.
    // If the response is not a redirect; return it as-is
    var location = response.headers.location;
    if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        // Clean up
        this._requestBodyBuffers = [];
        return;
    }
    // The response is a redirect, so abort the current request
    destroyRequest(this._currentRequest);
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();
    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
        throw new TooManyRedirectsError();
    }
    // Store the request headers if applicable
    var requestHeaders;
    var beforeRedirect = this._options.beforeRedirect;
    if (beforeRedirect) {
        requestHeaders = Object.assign({
            // The Host header was set by nativeProtocol.request
            Host: response.req.getHeader("host")
        }, this._options.headers);
    }
    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    var method = this._options.method;
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
    // the server is redirecting the user agent to a different resource […]
    // A user agent can perform a retrieval request targeting that URI
    // (a GET or HEAD request if using HTTP) […]
    statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        // Drop a possible entity and headers related to it
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
    }
    // Drop the Host header, as the redirect might lead to a different host
    var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
    // If the redirect is relative, carry over the host of the last request
    var currentUrlParts = parseUrl(this._currentUrl);
    var currentHost = currentHostHeader || currentUrlParts.host;
    var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url.format(Object.assign(currentUrlParts, {
        host: currentHost
    }));
    // Create the redirected request
    var redirectUrl = resolveUrl(location, currentUrl);
    debug("redirecting to", redirectUrl.href);
    this._isRedirect = true;
    spreadUrlObject(redirectUrl, this._options);
    // Drop confidential headers when redirecting to a less secure protocol
    // or to a different domain that is not a superdomain
    if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) {
        removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
    }
    // Evaluate the beforeRedirect callback
    if (isFunction(beforeRedirect)) {
        var responseDetails = {
            headers: response.headers,
            statusCode: statusCode
        };
        var requestDetails = {
            url: currentUrl,
            method: method,
            headers: requestHeaders
        };
        beforeRedirect(this._options, responseDetails, requestDetails);
        this._sanitizeOptions(this._options);
    }
    // Perform the redirected request
    this._performRequest();
};
// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
    // Default settings
    var exports = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024
    };
    // Wrap each protocol
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function(scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);
        // Executes a request, following redirects
        function request(input, options, callback) {
            // Parse parameters, ensuring that input is an object
            if (isURL(input)) {
                input = spreadUrlObject(input);
            } else if (isString(input)) {
                input = spreadUrlObject(parseUrl(input));
            } else {
                callback = options;
                options = validateUrl(input);
                input = {
                    protocol: protocol
                };
            }
            if (isFunction(options)) {
                callback = options;
                options = null;
            }
            // Set defaults
            options = Object.assign({
                maxRedirects: exports.maxRedirects,
                maxBodyLength: exports.maxBodyLength
            }, input, options);
            options.nativeProtocols = nativeProtocols;
            if (!isString(options.host) && !isString(options.hostname)) {
                options.hostname = "::1";
            }
            assert.equal(options.protocol, protocol, "protocol mismatch");
            debug("options", options);
            return new RedirectableRequest(options, callback);
        }
        // Executes a GET request, following redirects
        function get(input, options, callback) {
            var wrappedRequest = wrappedProtocol.request(input, options, callback);
            wrappedRequest.end();
            return wrappedRequest;
        }
        // Expose the properties on the wrapped protocol
        Object.defineProperties(wrappedProtocol, {
            request: {
                value: request,
                configurable: true,
                enumerable: true,
                writable: true
            },
            get: {
                value: get,
                configurable: true,
                enumerable: true,
                writable: true
            }
        });
    });
    return exports;
}
function noop() {}
function parseUrl(input) {
    var parsed;
    // istanbul ignore else
    if (useNativeURL) {
        parsed = new URL(input);
    } else {
        // Ensure the URL is valid and absolute
        parsed = validateUrl(url.parse(input));
        if (!isString(parsed.protocol)) {
            throw new InvalidUrlError({
                input
            });
        }
    }
    return parsed;
}
function resolveUrl(relative, base) {
    // istanbul ignore next
    return useNativeURL ? new URL(relative, base) : parseUrl(url.resolve(base, relative));
}
function validateUrl(input) {
    if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
        throw new InvalidUrlError({
            input: input.href || input
        });
    }
    if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
        throw new InvalidUrlError({
            input: input.href || input
        });
    }
    return input;
}
function spreadUrlObject(urlObject, target) {
    var spread = target || {};
    for (var key of preservedUrlFields){
        spread[key] = urlObject[key];
    }
    // Fix IPv6 hostname
    if (spread.hostname.startsWith("[")) {
        spread.hostname = spread.hostname.slice(1, -1);
    }
    // Ensure port is a number
    if (spread.port !== "") {
        spread.port = Number(spread.port);
    }
    // Concatenate path
    spread.path = spread.search ? spread.pathname + spread.search : spread.pathname;
    return spread;
}
function removeMatchingHeaders(regex, headers) {
    var lastValue;
    for(var header in headers){
        if (regex.test(header)) {
            lastValue = headers[header];
            delete headers[header];
        }
    }
    return lastValue === null || typeof lastValue === "undefined" ? undefined : String(lastValue).trim();
}
function createErrorType(code, message, baseClass) {
    // Create constructor
    function CustomError(properties) {
        // istanbul ignore else
        if (isFunction(Error.captureStackTrace)) {
            Error.captureStackTrace(this, this.constructor);
        }
        Object.assign(this, properties || {});
        this.code = code;
        this.message = this.cause ? message + ": " + this.cause.message : message;
    }
    // Attach constructor and set default properties
    CustomError.prototype = new (baseClass || Error)();
    Object.defineProperties(CustomError.prototype, {
        constructor: {
            value: CustomError,
            enumerable: false
        },
        name: {
            value: "Error [" + code + "]",
            enumerable: false
        }
    });
    return CustomError;
}
function destroyRequest(request, error) {
    for (var event of events){
        request.removeListener(event, eventHandlers[event]);
    }
    request.on("error", noop);
    request.destroy(error);
}
function isSubdomain(subdomain, domain) {
    assert(isString(subdomain) && isString(domain));
    var dot = subdomain.length - domain.length - 1;
    return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}
function isString(value) {
    return typeof value === "string" || value instanceof String;
}
function isFunction(value) {
    return typeof value === "function";
}
function isBuffer(value) {
    return typeof value === "object" && "length" in value;
}
function isURL(value) {
    return URL && value instanceof URL;
}
// Exports
module.exports = wrap({
    http: http,
    https: https
});
module.exports.wrap = wrap;
}),
"[project]/node_modules/base64-js/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for(var i = 0, len = code.length; i < len; ++i){
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
function getLens(b64) {
    var len = b64.length;
    if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
    }
    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    var validLen = b64.indexOf('=');
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [
        validLen,
        placeHoldersLen
    ];
}
// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    // if there are placeholders, only get up to the last complete 4 chars
    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;
    for(i = 0; i < len; i += 4){
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 0xFF;
    }
    if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
    }
    return arr;
}
function tripletToBase64(num) {
    return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for(var i = start; i < end; i += 3){
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64(tmp));
    }
    return output.join('');
}
function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    ;
    var parts = [];
    var maxChunkLength = 16383 // must be multiple of 3
    ;
    // go through the array every three bytes, we'll deal with trailing stuff later
    for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength){
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    }
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
    }
    return parts.join('');
}
}),
"[project]/node_modules/agent-base/dist/helpers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.req = exports.json = exports.toBuffer = void 0;
const http = __importStar(__turbopack_context__.r("[externals]/http [external] (http, cjs)"));
const https = __importStar(__turbopack_context__.r("[externals]/https [external] (https, cjs)"));
async function toBuffer(stream) {
    let length = 0;
    const chunks = [];
    for await (const chunk of stream){
        length += chunk.length;
        chunks.push(chunk);
    }
    return Buffer.concat(chunks, length);
}
exports.toBuffer = toBuffer;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function json(stream) {
    const buf = await toBuffer(stream);
    const str = buf.toString('utf8');
    try {
        return JSON.parse(str);
    } catch (_err) {
        const err = _err;
        err.message += ` (input: ${str})`;
        throw err;
    }
}
exports.json = json;
function req(url, opts = {}) {
    const href = typeof url === 'string' ? url : url.href;
    const req1 = (href.startsWith('https:') ? https : http).request(url, opts);
    const promise = new Promise((resolve, reject)=>{
        req1.once('response', resolve).once('error', reject).end();
    });
    req1.then = promise.then.bind(promise);
    return req1;
}
exports.req = req; //# sourceMappingURL=helpers.js.map
}),
"[project]/node_modules/agent-base/dist/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Agent = void 0;
const net = __importStar(__turbopack_context__.r("[externals]/net [external] (net, cjs)"));
const http = __importStar(__turbopack_context__.r("[externals]/http [external] (http, cjs)"));
const https_1 = __turbopack_context__.r("[externals]/https [external] (https, cjs)");
__exportStar(__turbopack_context__.r("[project]/node_modules/agent-base/dist/helpers.js [app-route] (ecmascript)"), exports);
const INTERNAL = Symbol('AgentBaseInternalState');
class Agent extends http.Agent {
    constructor(opts){
        super(opts);
        this[INTERNAL] = {};
    }
    /**
     * Determine whether this is an `http` or `https` request.
     */ isSecureEndpoint(options) {
        if (options) {
            // First check the `secureEndpoint` property explicitly, since this
            // means that a parent `Agent` is "passing through" to this instance.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof options.secureEndpoint === 'boolean') {
                return options.secureEndpoint;
            }
            // If no explicit `secure` endpoint, check if `protocol` property is
            // set. This will usually be the case since using a full string URL
            // or `URL` instance should be the most common usage.
            if (typeof options.protocol === 'string') {
                return options.protocol === 'https:';
            }
        }
        // Finally, if no `protocol` property was set, then fall back to
        // checking the stack trace of the current call stack, and try to
        // detect the "https" module.
        const { stack } = new Error();
        if (typeof stack !== 'string') return false;
        return stack.split('\n').some((l)=>l.indexOf('(https.js:') !== -1 || l.indexOf('node:https:') !== -1);
    }
    // In order to support async signatures in `connect()` and Node's native
    // connection pooling in `http.Agent`, the array of sockets for each origin
    // has to be updated synchronously. This is so the length of the array is
    // accurate when `addRequest()` is next called. We achieve this by creating a
    // fake socket and adding it to `sockets[origin]` and incrementing
    // `totalSocketCount`.
    incrementSockets(name) {
        // If `maxSockets` and `maxTotalSockets` are both Infinity then there is no
        // need to create a fake socket because Node.js native connection pooling
        // will never be invoked.
        if (this.maxSockets === Infinity && this.maxTotalSockets === Infinity) {
            return null;
        }
        // All instances of `sockets` are expected TypeScript errors. The
        // alternative is to add it as a private property of this class but that
        // will break TypeScript subclassing.
        if (!this.sockets[name]) {
            // @ts-expect-error `sockets` is readonly in `@types/node`
            this.sockets[name] = [];
        }
        const fakeSocket = new net.Socket({
            writable: false
        });
        this.sockets[name].push(fakeSocket);
        // @ts-expect-error `totalSocketCount` isn't defined in `@types/node`
        this.totalSocketCount++;
        return fakeSocket;
    }
    decrementSockets(name, socket) {
        if (!this.sockets[name] || socket === null) {
            return;
        }
        const sockets = this.sockets[name];
        const index = sockets.indexOf(socket);
        if (index !== -1) {
            sockets.splice(index, 1);
            // @ts-expect-error  `totalSocketCount` isn't defined in `@types/node`
            this.totalSocketCount--;
            if (sockets.length === 0) {
                // @ts-expect-error `sockets` is readonly in `@types/node`
                delete this.sockets[name];
            }
        }
    }
    // In order to properly update the socket pool, we need to call `getName()` on
    // the core `https.Agent` if it is a secureEndpoint.
    getName(options) {
        const secureEndpoint = this.isSecureEndpoint(options);
        if (secureEndpoint) {
            // @ts-expect-error `getName()` isn't defined in `@types/node`
            return https_1.Agent.prototype.getName.call(this, options);
        }
        // @ts-expect-error `getName()` isn't defined in `@types/node`
        return super.getName(options);
    }
    createSocket(req, options, cb) {
        const connectOpts = {
            ...options,
            secureEndpoint: this.isSecureEndpoint(options)
        };
        const name = this.getName(connectOpts);
        const fakeSocket = this.incrementSockets(name);
        Promise.resolve().then(()=>this.connect(req, connectOpts)).then((socket)=>{
            this.decrementSockets(name, fakeSocket);
            if (socket instanceof http.Agent) {
                try {
                    // @ts-expect-error `addRequest()` isn't defined in `@types/node`
                    return socket.addRequest(req, connectOpts);
                } catch (err) {
                    return cb(err);
                }
            }
            this[INTERNAL].currentSocket = socket;
            // @ts-expect-error `createSocket()` isn't defined in `@types/node`
            super.createSocket(req, options, cb);
        }, (err)=>{
            this.decrementSockets(name, fakeSocket);
            cb(err);
        });
    }
    createConnection() {
        const socket = this[INTERNAL].currentSocket;
        this[INTERNAL].currentSocket = undefined;
        if (!socket) {
            throw new Error('No socket was returned in the `connect()` function');
        }
        return socket;
    }
    get defaultPort() {
        return this[INTERNAL].defaultPort ?? (this.protocol === 'https:' ? 443 : 80);
    }
    set defaultPort(v) {
        if (this[INTERNAL]) {
            this[INTERNAL].defaultPort = v;
        }
    }
    get protocol() {
        return this[INTERNAL].protocol ?? (this.isSecureEndpoint() ? 'https:' : 'http:');
    }
    set protocol(v) {
        if (this[INTERNAL]) {
            this[INTERNAL].protocol = v;
        }
    }
}
exports.Agent = Agent; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/https-proxy-agent/dist/parse-proxy-response.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseProxyResponse = void 0;
const debug_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)"));
const debug = (0, debug_1.default)('https-proxy-agent:parse-proxy-response');
function parseProxyResponse(socket) {
    return new Promise((resolve, reject)=>{
        // we need to buffer any HTTP traffic that happens with the proxy before we get
        // the CONNECT response, so that if the response is anything other than an "200"
        // response code, then we can re-play the "data" events on the socket once the
        // HTTP parser is hooked up...
        let buffersLength = 0;
        const buffers = [];
        function read() {
            const b = socket.read();
            if (b) ondata(b);
            else socket.once('readable', read);
        }
        function cleanup() {
            socket.removeListener('end', onend);
            socket.removeListener('error', onerror);
            socket.removeListener('readable', read);
        }
        function onend() {
            cleanup();
            debug('onend');
            reject(new Error('Proxy connection ended before receiving CONNECT response'));
        }
        function onerror(err) {
            cleanup();
            debug('onerror %o', err);
            reject(err);
        }
        function ondata(b) {
            buffers.push(b);
            buffersLength += b.length;
            const buffered = Buffer.concat(buffers, buffersLength);
            const endOfHeaders = buffered.indexOf('\r\n\r\n');
            if (endOfHeaders === -1) {
                // keep buffering
                debug('have not received end of HTTP headers yet...');
                read();
                return;
            }
            const headerParts = buffered.slice(0, endOfHeaders).toString('ascii').split('\r\n');
            const firstLine = headerParts.shift();
            if (!firstLine) {
                socket.destroy();
                return reject(new Error('No header received from proxy CONNECT response'));
            }
            const firstLineParts = firstLine.split(' ');
            const statusCode = +firstLineParts[1];
            const statusText = firstLineParts.slice(2).join(' ');
            const headers = {};
            for (const header of headerParts){
                if (!header) continue;
                const firstColon = header.indexOf(':');
                if (firstColon === -1) {
                    socket.destroy();
                    return reject(new Error(`Invalid header from proxy CONNECT response: "${header}"`));
                }
                const key = header.slice(0, firstColon).toLowerCase();
                const value = header.slice(firstColon + 1).trimStart();
                const current = headers[key];
                if (typeof current === 'string') {
                    headers[key] = [
                        current,
                        value
                    ];
                } else if (Array.isArray(current)) {
                    current.push(value);
                } else {
                    headers[key] = value;
                }
            }
            debug('got proxy server response: %o %o', firstLine, headers);
            cleanup();
            resolve({
                connect: {
                    statusCode,
                    statusText,
                    headers
                },
                buffered
            });
        }
        socket.on('error', onerror);
        socket.on('end', onend);
        read();
    });
}
exports.parseProxyResponse = parseProxyResponse; //# sourceMappingURL=parse-proxy-response.js.map
}),
"[project]/node_modules/https-proxy-agent/dist/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HttpsProxyAgent = void 0;
const net = __importStar(__turbopack_context__.r("[externals]/net [external] (net, cjs)"));
const tls = __importStar(__turbopack_context__.r("[externals]/tls [external] (tls, cjs)"));
const assert_1 = __importDefault(__turbopack_context__.r("[externals]/assert [external] (assert, cjs)"));
const debug_1 = __importDefault(__turbopack_context__.r("[project]/node_modules/debug/src/index.js [app-route] (ecmascript)"));
const agent_base_1 = __turbopack_context__.r("[project]/node_modules/agent-base/dist/index.js [app-route] (ecmascript)");
const url_1 = __turbopack_context__.r("[externals]/url [external] (url, cjs)");
const parse_proxy_response_1 = __turbopack_context__.r("[project]/node_modules/https-proxy-agent/dist/parse-proxy-response.js [app-route] (ecmascript)");
const debug = (0, debug_1.default)('https-proxy-agent');
const setServernameFromNonIpHost = (options)=>{
    if (options.servername === undefined && options.host && !net.isIP(options.host)) {
        return {
            ...options,
            servername: options.host
        };
    }
    return options;
};
/**
 * The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to
 * the specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
 *
 * Outgoing HTTP requests are first tunneled through the proxy server using the
 * `CONNECT` HTTP request method to establish a connection to the proxy server,
 * and then the proxy server connects to the destination target and issues the
 * HTTP request from the proxy server.
 *
 * `https:` requests have their socket connection upgraded to TLS once
 * the connection to the proxy server has been established.
 */ class HttpsProxyAgent extends agent_base_1.Agent {
    constructor(proxy, opts){
        super(opts);
        this.options = {
            path: undefined
        };
        this.proxy = typeof proxy === 'string' ? new url_1.URL(proxy) : proxy;
        this.proxyHeaders = opts?.headers ?? {};
        debug('Creating new HttpsProxyAgent instance: %o', this.proxy.href);
        // Trim off the brackets from IPv6 addresses
        const host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, '');
        const port = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === 'https:' ? 443 : 80;
        this.connectOpts = {
            // Attempt to negotiate http/1.1 for proxy servers that support http/2
            ALPNProtocols: [
                'http/1.1'
            ],
            ...opts ? omit(opts, 'headers') : null,
            host,
            port
        };
    }
    /**
     * Called when the node-core HTTP client library is creating a
     * new HTTP request.
     */ async connect(req, opts) {
        const { proxy } = this;
        if (!opts.host) {
            throw new TypeError('No "host" provided');
        }
        // Create a socket connection to the proxy server.
        let socket;
        if (proxy.protocol === 'https:') {
            debug('Creating `tls.Socket`: %o', this.connectOpts);
            socket = tls.connect(setServernameFromNonIpHost(this.connectOpts));
        } else {
            debug('Creating `net.Socket`: %o', this.connectOpts);
            socket = net.connect(this.connectOpts);
        }
        const headers = typeof this.proxyHeaders === 'function' ? this.proxyHeaders() : {
            ...this.proxyHeaders
        };
        const host = net.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
        let payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r\n`;
        // Inject the `Proxy-Authorization` header if necessary.
        if (proxy.username || proxy.password) {
            const auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
            headers['Proxy-Authorization'] = `Basic ${Buffer.from(auth).toString('base64')}`;
        }
        headers.Host = `${host}:${opts.port}`;
        if (!headers['Proxy-Connection']) {
            headers['Proxy-Connection'] = this.keepAlive ? 'Keep-Alive' : 'close';
        }
        for (const name of Object.keys(headers)){
            payload += `${name}: ${headers[name]}\r\n`;
        }
        const proxyResponsePromise = (0, parse_proxy_response_1.parseProxyResponse)(socket);
        socket.write(`${payload}\r\n`);
        const { connect, buffered } = await proxyResponsePromise;
        req.emit('proxyConnect', connect);
        this.emit('proxyConnect', connect, req);
        if (connect.statusCode === 200) {
            req.once('socket', resume);
            if (opts.secureEndpoint) {
                // The proxy is connecting to a TLS server, so upgrade
                // this socket connection to a TLS connection.
                debug('Upgrading socket connection to TLS');
                return tls.connect({
                    ...omit(setServernameFromNonIpHost(opts), 'host', 'path', 'port'),
                    socket
                });
            }
            return socket;
        }
        // Some other status code that's not 200... need to re-play the HTTP
        // header "data" events onto the socket once the HTTP machinery is
        // attached so that the node core `http` can parse and handle the
        // error status code.
        // Close the original socket, and a new "fake" socket is returned
        // instead, so that the proxy doesn't get the HTTP request
        // written to it (which may contain `Authorization` headers or other
        // sensitive data).
        //
        // See: https://hackerone.com/reports/541502
        socket.destroy();
        const fakeSocket = new net.Socket({
            writable: false
        });
        fakeSocket.readable = true;
        // Need to wait for the "socket" event to re-play the "data" events.
        req.once('socket', (s)=>{
            debug('Replaying proxy buffer for failed request');
            (0, assert_1.default)(s.listenerCount('data') > 0);
            // Replay the "buffered" Buffer onto the fake `socket`, since at
            // this point the HTTP module machinery has been hooked up for
            // the user.
            s.push(buffered);
            s.push(null);
        });
        return fakeSocket;
    }
}
HttpsProxyAgent.protocols = [
    'http',
    'https'
];
exports.HttpsProxyAgent = HttpsProxyAgent;
function resume(socket) {
    socket.resume();
}
function omit(obj, ...keys) {
    const ret = {};
    let key;
    for(key in obj){
        if (!keys.includes(key)) {
            ret[key] = obj[key];
        }
    }
    return ret;
} //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/@tavily/core/dist/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tavily",
    ()=>tavily
]);
// src/search.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/axios/index.js [app-route] (ecmascript) <locals>");
// src/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$tiktoken$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/js-tiktoken/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$https$2d$proxy$2d$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/https-proxy-agent/dist/index.js [app-route] (ecmascript)");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __knownSymbol = (name, symbol)=>(symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
var __defNormalProp = (obj, key, value)=>key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
    }) : obj[key] = value;
var __spreadValues = (a, b)=>{
    for(var prop in b || (b = {}))if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)){
        if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
    return a;
};
var __objRest = (source, exclude)=>{
    var target = {};
    for(var prop in source)if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols) for (var prop of __getOwnPropSymbols(source)){
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
    }
    return target;
};
var __async = (__this, __arguments, generator)=>{
    return new Promise((resolve, reject)=>{
        var fulfilled = (value)=>{
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        };
        var rejected = (value)=>{
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        };
        var step = (x)=>x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
        step((generator = generator.apply(__this, __arguments)).next());
    });
};
var __await = function(promise, isYieldStar) {
    this[0] = promise;
    this[1] = isYieldStar;
};
var __asyncGenerator = (__this, __arguments, generator)=>{
    var resume = (k, v, yes, no)=>{
        try {
            var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
            Promise.resolve(isAwait ? v[0] : v).then((y)=>isAwait ? resume(k === "return" ? k : "next", v[1] ? {
                    done: y.done,
                    value: y.value
                } : y, yes, no) : yes({
                    value: y,
                    done
                })).catch((e)=>resume("throw", e, yes, no));
        } catch (e) {
            no(e);
        }
    }, method = (k)=>it[k] = (x)=>new Promise((yes, no)=>resume(k, x, yes, no)), it = {};
    return generator = generator.apply(__this, __arguments), it[__knownSymbol("asyncIterator")] = ()=>it, method("next"), method("throw"), method("return"), it;
};
var __forAwait = (obj, it, method)=>(it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn)=>(fn = obj[key]) && (it[key] = (arg)=>new Promise((yes, no, done)=>(arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value)=>yes({
                        value,
                        done
                    }), no)))), method("next"), method("return"), it);
;
;
;
;
var BASE_URL = "https://api.tavily.com";
var DEFAULT_MODEL_ENCODING = "gpt-3.5-turbo";
var DEFAULT_MAX_TOKENS = 4e3;
function post(endpoint, body, requestConfig, timeout, responseType) {
    return __async(this, null, function*() {
        const { apiKey, proxies, apiBaseURL, clientSource, projectId } = requestConfig;
        const requestTimeout = endpoint === "research" ? timeout : timeout != null ? timeout : 60;
        const url = `${apiBaseURL || BASE_URL}/${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "X-Client-Source": clientSource || "tavily-js"
        };
        if (projectId) headers["X-Project-ID"] = projectId;
        const config = {
            headers
        };
        if (requestTimeout !== void 0) {
            const timeoutInMillis = requestTimeout * 1e3;
            config.timeout = timeoutInMillis;
        }
        if (proxies) {
            if (proxies.http) {
                config.httpAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$https$2d$proxy$2d$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpsProxyAgent"](proxies.http);
            }
            if (proxies.https) {
                config.httpsAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$https$2d$proxy$2d$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpsProxyAgent"](proxies.https);
            }
        }
        if (responseType) {
            config.responseType = responseType;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].post(url, body, config);
    });
}
function get(endpoint, requestConfig, timeout) {
    return __async(this, null, function*() {
        const { apiKey, proxies, apiBaseURL, clientSource, projectId } = requestConfig;
        const url = `${apiBaseURL || BASE_URL}/${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "X-Client-Source": clientSource || "tavily-js"
        };
        if (projectId) headers["X-Project-ID"] = projectId;
        const requestTimeout = endpoint.includes("research") ? timeout : timeout != null ? timeout : 60;
        const timeoutInMillis = requestTimeout ? requestTimeout * 1e3 : void 0;
        const config = {
            headers,
            timeout: timeoutInMillis
        };
        if (proxies) {
            if (proxies.http) {
                config.httpAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$https$2d$proxy$2d$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpsProxyAgent"](proxies.http);
            }
            if (proxies.https) {
                config.httpsAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$https$2d$proxy$2d$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpsProxyAgent"](proxies.https);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].get(url, config);
    });
}
function getTotalTokensFromString(str, encodingName = DEFAULT_MODEL_ENCODING) {
    const encoding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$tiktoken$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["encodingForModel"])(encodingName);
    return encoding.encode(str).length;
}
function getMaxTokensFromList(data, maxTokens = DEFAULT_MAX_TOKENS) {
    var result = [];
    let currentTokens = 0;
    for (let item of data){
        let itemString = JSON.stringify(item);
        let newTotalTokens = currentTokens + getTotalTokensFromString(itemString);
        if (newTotalTokens > maxTokens) {
            break;
        }
        result.push(item);
        currentTokens = newTotalTokens;
    }
    return JSON.stringify(result);
}
function handleRequestError(res) {
    var _a, _b, _c, _d;
    const status = res.status;
    const message = (_b = (_a = res.data) == null ? void 0 : _a.detail) == null ? void 0 : _b.error;
    if (!message) {
        throw new Error(`${status} Error: ${JSON.stringify(res.data)}`);
    }
    throw new Error(`${(_d = (_c = res.data) == null ? void 0 : _c.detail) == null ? void 0 : _d.error}`);
}
function handleTimeoutError(timeout) {
    throw new Error(`Request timed out after ${timeout} seconds.`);
}
// src/search.ts
function _search(requestConfig) {
    return function search(_0) {
        return __async(this, arguments, function*(query, options = {}) {
            var _b, _c, _d, _e, _f;
            const _a = options, { searchDepth, topic, days, maxResults, includeImages, includeImageDescriptions, includeAnswer, includeRawContent, includeDomains, excludeDomains, timeRange, chunksPerSource, country, startDate, endDate, autoParameters, timeout, includeFavicon, includeUsage } = _a, kwargs = __objRest(_a, [
                "searchDepth",
                "topic",
                "days",
                "maxResults",
                "includeImages",
                "includeImageDescriptions",
                "includeAnswer",
                "includeRawContent",
                "includeDomains",
                "excludeDomains",
                "timeRange",
                "chunksPerSource",
                "country",
                "startDate",
                "endDate",
                "autoParameters",
                "timeout",
                "includeFavicon",
                "includeUsage"
            ]);
            const requestTimeout = timeout != null ? timeout : 60;
            try {
                const response = yield post("search", __spreadValues({
                    query,
                    search_depth: searchDepth,
                    topic,
                    days,
                    max_results: maxResults,
                    include_images: includeImages,
                    include_image_descriptions: includeImageDescriptions,
                    include_answer: includeAnswer,
                    include_raw_content: includeRawContent,
                    include_domains: includeDomains,
                    exclude_domains: excludeDomains,
                    time_range: timeRange,
                    chunks_per_source: chunksPerSource,
                    country,
                    start_date: startDate,
                    end_date: endDate,
                    auto_parameters: autoParameters,
                    include_favicon: includeFavicon,
                    include_usage: includeUsage
                }, kwargs), requestConfig, requestTimeout);
                return __spreadValues(__spreadValues({
                    query,
                    responseTime: response.data.response_time,
                    images: response.data.images.map((image)=>{
                        return {
                            url: (image == null ? void 0 : image.url) || image,
                            description: image.description
                        };
                    }),
                    results: response.data.results.map((result)=>{
                        return {
                            title: result.title,
                            url: result.url,
                            content: result.content,
                            rawContent: result.raw_content,
                            score: result.score,
                            publishedDate: result.published_date,
                            favicon: result.favicon
                        };
                    }),
                    answer: response.data.answer,
                    requestId: response.data.request_id
                }, response.data.usage !== void 0 && {
                    usage: response.data.usage
                }), response.data.auto_parameters && {
                    autoParameters: {
                        includeDomains: (_b = response.data.auto_parameters) == null ? void 0 : _b.include_domains,
                        excludeDomains: (_c = response.data.auto_parameters) == null ? void 0 : _c.exclude_domains,
                        topic: (_d = response.data.auto_parameters) == null ? void 0 : _d.topic,
                        timeRange: (_e = response.data.auto_parameters) == null ? void 0 : _e.time_range,
                        searchDepth: (_f = response.data.auto_parameters) == null ? void 0 : _f.search_depth
                    }
                });
            } catch (err) {
                if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                    if (err.code === "ECONNABORTED") {
                        handleTimeoutError(requestTimeout);
                    }
                    if (err.response) {
                        handleRequestError(err.response);
                    }
                }
                throw new Error(`An unexpected error occurred while making the request. Error: ${err}`);
            }
        });
    };
}
function _searchQNA(requestConfig) {
    return function searchQNA(_0) {
        return __async(this, arguments, function*(query, options = {}) {
            var _a, _b;
            console.warn("searchQNA() is deprecated and will be removed in a future version. Use search() with includeAnswer: true instead.");
            const requestTimeout = (_a = options == null ? void 0 : options.timeout) != null ? _a : 60;
            try {
                const response = yield post("search", {
                    query,
                    search_depth: (_b = options.searchDepth) != null ? _b : "advanced",
                    topic: options.topic,
                    days: options.days,
                    max_results: options.maxResults,
                    include_answer: true,
                    include_domains: options.includeDomains,
                    exclude_domains: options.excludeDomains,
                    chunks_per_source: options.chunksPerSource,
                    include_favicon: options.includeFavicon
                }, requestConfig, requestTimeout);
                const answer = response.data.answer;
                return answer;
            } catch (err) {
                if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                    if (err.code === "ECONNABORTED") {
                        handleTimeoutError(requestTimeout);
                    }
                    if (err.response) {
                        handleRequestError(err.response);
                    }
                }
                throw new Error(`An unexpected error occurred while making the request. Error: ${err}`);
            }
        });
    };
}
function _searchContext(requestConfig) {
    return function searchContext(_0) {
        return __async(this, arguments, function*(query, options = {}) {
            var _a, _b, _c;
            console.warn("searchContext() is deprecated and will be removed in a future version. Use search() directly and process the results as needed.");
            const timeout = (_a = options == null ? void 0 : options.timeout) != null ? _a : 60;
            try {
                const response = yield post("search", {
                    query,
                    search_depth: options.searchDepth,
                    topic: options.topic,
                    days: options.days,
                    max_results: options.maxResults,
                    include_domains: options.includeDomains,
                    exclude_domains: options.excludeDomains,
                    chunks_per_source: options.chunksPerSource,
                    include_favicon: options.includeFavicon
                }, requestConfig, timeout);
                const sources = ((_b = response.data) == null ? void 0 : _b.results) || [];
                const context = sources.map((source)=>{
                    return {
                        url: source.url,
                        content: source.content
                    };
                });
                return JSON.stringify(getMaxTokensFromList(context, (_c = options.maxTokens) != null ? _c : DEFAULT_MAX_TOKENS));
            } catch (err) {
                if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                    if (err.code === "ECONNABORTED") {
                        handleTimeoutError(timeout);
                    }
                    if (err.response) {
                        handleRequestError(err.response);
                    }
                }
                throw new Error(`An unexpected error occurred while making the request. Error: ${err}`);
            }
        });
    };
}
;
function _extract(requestConfig) {
    return function extract(_0) {
        return __async(this, arguments, function*(urls, options = {}) {
            const _a = options, { includeImages, extractDepth, format, timeout, includeFavicon, includeUsage, query, chunksPerSource } = _a, kwargs = __objRest(_a, [
                "includeImages",
                "extractDepth",
                "format",
                "timeout",
                "includeFavicon",
                "includeUsage",
                "query",
                "chunksPerSource"
            ]);
            const requestTimeout = timeout != null ? timeout : 30;
            try {
                const response = yield post("extract", __spreadValues({
                    urls,
                    include_images: includeImages,
                    extract_depth: extractDepth,
                    format,
                    include_favicon: includeFavicon,
                    timeout,
                    // Add timeout to the payload
                    include_usage: includeUsage,
                    query,
                    chunks_per_source: chunksPerSource
                }, kwargs), requestConfig, requestTimeout);
                return __spreadValues({
                    responseTime: response.data.response_time,
                    results: response.data.results.map((result)=>{
                        return {
                            url: result.url,
                            title: result.title,
                            rawContent: result.raw_content,
                            images: result.images,
                            favicon: result.favicon
                        };
                    }),
                    failedResults: response.data.failed_results.map((result)=>{
                        return {
                            url: result.url,
                            error: result.error
                        };
                    }),
                    requestId: response.data.request_id
                }, response.data.usage !== void 0 && {
                    usage: response.data.usage
                });
            } catch (err) {
                if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                    if (err.code === "ECONNABORTED") {
                        handleTimeoutError(requestTimeout);
                    }
                    if (err.response) {
                        handleRequestError(err.response);
                    }
                }
                throw new Error(`An unexpected error occurred while making the request. Error: ${err}`);
            }
        });
    };
}
;
function _crawl(requestConfig) {
    return function crawl(_0) {
        return __async(this, arguments, function*(url, options = {}) {
            const _a = options, { maxDepth, maxBreadth, limit, extractDepth, selectPaths, selectDomains, excludePaths, excludeDomains, allowExternal, includeImages, instructions, format, timeout, includeFavicon, includeUsage, chunksPerSource } = _a, kwargs = __objRest(_a, [
                "maxDepth",
                "maxBreadth",
                "limit",
                "extractDepth",
                "selectPaths",
                "selectDomains",
                "excludePaths",
                "excludeDomains",
                "allowExternal",
                "includeImages",
                "instructions",
                "format",
                "timeout",
                "includeFavicon",
                "includeUsage",
                "chunksPerSource"
            ]);
            const requestTimeout = timeout != null ? timeout : 150;
            try {
                const response = yield post("crawl", __spreadValues({
                    url,
                    max_depth: maxDepth,
                    max_breadth: maxBreadth,
                    limit,
                    extract_depth: extractDepth,
                    select_paths: selectPaths,
                    select_domains: selectDomains,
                    exclude_paths: excludePaths,
                    exclude_domains: excludeDomains,
                    allow_external: allowExternal,
                    include_images: includeImages,
                    instructions,
                    format,
                    timeout,
                    include_favicon: includeFavicon,
                    include_usage: includeUsage,
                    chunks_per_source: chunksPerSource
                }, kwargs), requestConfig, requestTimeout);
                return __spreadValues({
                    responseTime: response.data.response_time,
                    baseUrl: response.data.base_url,
                    results: response.data.results.map((item)=>{
                        return {
                            url: item.url,
                            rawContent: item.raw_content,
                            images: item.images,
                            favicon: item.favicon
                        };
                    }),
                    requestId: response.data.request_id
                }, response.data.usage !== void 0 && {
                    usage: response.data.usage
                });
            } catch (err) {
                if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                    if (err.code === "ECONNABORTED") {
                        handleTimeoutError(requestTimeout);
                    }
                    if (err.response) {
                        handleRequestError(err.response);
                    }
                }
                throw new Error(`An unexpected error occurred while making the request. Error: ${err}`);
            }
        });
    };
}
;
function _map(requestConfig) {
    return function map(_0) {
        return __async(this, arguments, function*(url, options = {}) {
            const _a = options, { maxDepth, maxBreadth, limit, selectPaths, selectDomains, excludePaths, excludeDomains, allowExternal, instructions, timeout, includeUsage } = _a, kwargs = __objRest(_a, [
                "maxDepth",
                "maxBreadth",
                "limit",
                "selectPaths",
                "selectDomains",
                "excludePaths",
                "excludeDomains",
                "allowExternal",
                "instructions",
                "timeout",
                "includeUsage"
            ]);
            const requestTimeout = timeout != null ? timeout : 150;
            try {
                const response = yield post("map", __spreadValues({
                    url,
                    max_depth: maxDepth,
                    max_breadth: maxBreadth,
                    limit,
                    select_paths: selectPaths,
                    select_domains: selectDomains,
                    exclude_paths: excludePaths,
                    exclude_domains: excludeDomains,
                    allow_external: allowExternal,
                    instructions,
                    timeout,
                    include_usage: includeUsage
                }, kwargs), requestConfig, requestTimeout);
                return __spreadValues({
                    responseTime: response.data.response_time,
                    baseUrl: response.data.base_url,
                    results: response.data.results,
                    requestId: response.data.request_id
                }, response.data.usage !== void 0 && {
                    usage: response.data.usage
                });
            } catch (err) {
                if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                    if (err.code === "ECONNABORTED") {
                        handleTimeoutError(requestTimeout);
                    }
                    if (err.response) {
                        handleRequestError(err.response);
                    }
                }
                throw new Error(`An unexpected error occurred while making the request. Error: ${err}`);
            }
        });
    };
}
;
function _research(requestConfig) {
    return function research(_0) {
        return __async(this, arguments, function*(input, options = {}) {
            const _a = options, { model, outputSchema, stream, citationFormat, timeout } = _a, kwargs = __objRest(_a, [
                "model",
                "outputSchema",
                "stream",
                "citationFormat",
                "timeout"
            ]);
            if (stream) {
                try {
                    const response = yield post("research", __spreadValues({
                        input,
                        model,
                        output_schema: outputSchema,
                        stream,
                        citation_format: citationFormat
                    }, kwargs), requestConfig, timeout, "stream");
                    function streamGenerator() {
                        return __asyncGenerator(this, null, function*() {
                            const stream2 = response.data;
                            try {
                                try {
                                    for(var iter = __forAwait(stream2), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false){
                                        const chunk = temp.value;
                                        if (chunk) {
                                            yield chunk;
                                        }
                                    }
                                } catch (temp) {
                                    error = [
                                        temp
                                    ];
                                } finally{
                                    try {
                                        more && (temp = iter.return) && (yield new __await(temp.call(iter)));
                                    } finally{
                                        if (error) throw error[0];
                                    }
                                }
                            } finally{
                                if (!stream2.destroyed) {
                                    stream2.destroy();
                                }
                            }
                        });
                    }
                    return streamGenerator();
                } catch (err) {
                    if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                        if (err.code === "ECONNABORTED") {
                            handleTimeoutError(timeout || 0);
                        }
                        if (err.response) {
                            handleRequestError(err.response);
                        }
                    }
                    throw new Error(`An unexpected error occurred while making the request. Error: ${err}`);
                }
            } else {
                try {
                    const response = yield post("research", __spreadValues({
                        input,
                        model,
                        output_schema: outputSchema,
                        stream,
                        citation_format: citationFormat
                    }, kwargs), requestConfig, timeout);
                    return {
                        requestId: response.data.request_id,
                        createdAt: response.data.created_at,
                        status: response.data.status,
                        input: response.data.input,
                        model: response.data.model,
                        responseTime: response.data.response_time
                    };
                } catch (err) {
                    if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                        if (err.code === "ECONNABORTED") {
                            handleTimeoutError(timeout || 0);
                        }
                        if (err.response) {
                            handleRequestError(err.response);
                        }
                    }
                    throw new Error(`An unexpected error occurred while making the request. Error: ${err}`);
                }
            }
        });
    };
}
function _getResearch(requestConfig) {
    return function getResearch(requestId) {
        return __async(this, null, function*() {
            const requestTimeout = 60;
            try {
                const response = yield get(`research/${requestId}`, requestConfig, requestTimeout);
                return response.data;
            } catch (err) {
                if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AxiosError"]) {
                    if (err.code === "ECONNABORTED") {
                        handleTimeoutError(requestTimeout);
                    }
                    if (err.response) {
                        handleRequestError(err.response);
                    }
                }
                throw new Error(`An unexpected error occurred while making the request. Error: ${err}`);
            }
        });
    };
}
// src/client.ts
function tavily(options) {
    const apiKey = (options == null ? void 0 : options.apiKey) || process.env.TAVILY_API_KEY;
    const proxies = (()=>{
        var _a, _b;
        const http = ((_a = options == null ? void 0 : options.proxies) == null ? void 0 : _a.http) || process.env.TAVILY_HTTP_PROXY;
        const https = ((_b = options == null ? void 0 : options.proxies) == null ? void 0 : _b.https) || process.env.TAVILY_HTTPS_PROXY;
        const result = {};
        if (http) result.http = http;
        if (https) result.https = https;
        return Object.keys(result).length > 0 ? result : void 0;
    })();
    if (!apiKey) {
        throw new Error("No API key provided. Please provide the api_key attribute or set the TAVILY_API_KEY environment variable.");
    }
    const requestConfig = {
        apiKey,
        proxies,
        apiBaseURL: options == null ? void 0 : options.apiBaseURL,
        clientSource: options == null ? void 0 : options.clientSource,
        projectId: (options == null ? void 0 : options.projectId) || process.env.TAVILY_PROJECT
    };
    return {
        search: _search(requestConfig),
        extract: _extract(requestConfig),
        searchQNA: _searchQNA(requestConfig),
        searchContext: _searchContext(requestConfig),
        crawl: _crawl(requestConfig),
        map: _map(requestConfig),
        research: _research(requestConfig),
        getResearch: _getResearch(requestConfig)
    };
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/process-nextick-args/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if (typeof process === 'undefined' || !process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
    module.exports = {
        nextTick: nextTick
    };
} else {
    module.exports = process;
}
function nextTick(fn, arg1, arg2, arg3) {
    if (typeof fn !== 'function') {
        throw new TypeError('"callback" argument must be a function');
    }
    var len = arguments.length;
    var args, i;
    switch(len){
        case 0:
        case 1:
            return process.nextTick(fn);
        case 2:
            return process.nextTick(function afterTickOne() {
                fn.call(null, arg1);
            });
        case 3:
            return process.nextTick(function afterTickTwo() {
                fn.call(null, arg1, arg2);
            });
        case 4:
            return process.nextTick(function afterTickThree() {
                fn.call(null, arg1, arg2, arg3);
            });
        default:
            args = new Array(len - 1);
            i = 0;
            while(i < args.length){
                args[i++] = arguments[i];
            }
            return process.nextTick(function afterTick() {
                fn.apply(null, args);
            });
    }
}
}),
"[project]/node_modules/readable-stream/node_modules/isarray/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var toString = {}.toString;
module.exports = Array.isArray || function(arr) {
    return toString.call(arr) == '[object Array]';
};
}),
"[project]/node_modules/readable-stream/lib/internal/streams/stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
}),
"[project]/node_modules/readable-stream/lib/internal/streams/BufferList.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
function copyBuffer(src, target, offset) {
    src.copy(target, offset);
}
module.exports = function() {
    function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    BufferList.prototype.push = function push(v) {
        var entry = {
            data: v,
            next: null
        };
        if (this.length > 0) this.tail.next = entry;
        else this.head = entry;
        this.tail = entry;
        ++this.length;
    };
    BufferList.prototype.unshift = function unshift(v) {
        var entry = {
            data: v,
            next: this.head
        };
        if (this.length === 0) this.tail = entry;
        this.head = entry;
        ++this.length;
    };
    BufferList.prototype.shift = function shift() {
        if (this.length === 0) return;
        var ret = this.head.data;
        if (this.length === 1) this.head = this.tail = null;
        else this.head = this.head.next;
        --this.length;
        return ret;
    };
    BufferList.prototype.clear = function clear() {
        this.head = this.tail = null;
        this.length = 0;
    };
    BufferList.prototype.join = function join(s) {
        if (this.length === 0) return '';
        var p = this.head;
        var ret = '' + p.data;
        while(p = p.next){
            ret += s + p.data;
        }
        return ret;
    };
    BufferList.prototype.concat = function concat(n) {
        if (this.length === 0) return Buffer.alloc(0);
        var ret = Buffer.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while(p){
            copyBuffer(p.data, ret, i);
            i += p.data.length;
            p = p.next;
        }
        return ret;
    };
    return BufferList;
}();
if (util && util.inspect && util.inspect.custom) {
    module.exports.prototype[util.inspect.custom] = function() {
        var obj = util.inspect({
            length: this.length
        });
        return this.constructor.name + ' ' + obj;
    };
}
}),
"[project]/node_modules/readable-stream/lib/internal/streams/destroy.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*<replacement>*/ var pna = __turbopack_context__.r("[project]/node_modules/process-nextick-args/index.js [app-route] (ecmascript)");
/*</replacement>*/ // undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
    var _this = this;
    var readableDestroyed = this._readableState && this._readableState.destroyed;
    var writableDestroyed = this._writableState && this._writableState.destroyed;
    if (readableDestroyed || writableDestroyed) {
        if (cb) {
            cb(err);
        } else if (err) {
            if (!this._writableState) {
                pna.nextTick(emitErrorNT, this, err);
            } else if (!this._writableState.errorEmitted) {
                this._writableState.errorEmitted = true;
                pna.nextTick(emitErrorNT, this, err);
            }
        }
        return this;
    }
    // we set destroyed to true before firing error callbacks in order
    // to make it re-entrance safe in case destroy() is called within callbacks
    if (this._readableState) {
        this._readableState.destroyed = true;
    }
    // if this is a duplex stream mark the writable part as destroyed as well
    if (this._writableState) {
        this._writableState.destroyed = true;
    }
    this._destroy(err || null, function(err) {
        if (!cb && err) {
            if (!_this._writableState) {
                pna.nextTick(emitErrorNT, _this, err);
            } else if (!_this._writableState.errorEmitted) {
                _this._writableState.errorEmitted = true;
                pna.nextTick(emitErrorNT, _this, err);
            }
        } else if (cb) {
            cb(err);
        }
    });
    return this;
}
function undestroy() {
    if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
    }
    if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
    }
}
function emitErrorNT(self, err) {
    self.emit('error', err);
}
module.exports = {
    destroy: destroy,
    undestroy: undestroy
};
}),
"[project]/node_modules/readable-stream/lib/_stream_writable.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.
/*<replacement>*/ var pna = __turbopack_context__.r("[project]/node_modules/process-nextick-args/index.js [app-route] (ecmascript)");
/*</replacement>*/ module.exports = Writable;
/* <replacement> */ function WriteReq(chunk, encoding, cb) {
    this.chunk = chunk;
    this.encoding = encoding;
    this.callback = cb;
    this.next = null;
}
// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
    var _this = this;
    this.next = null;
    this.entry = null;
    this.finish = function() {
        onCorkedFinish(_this, state);
    };
}
/* </replacement> */ /*<replacement>*/ var asyncWrite = !("TURBOPACK compile-time value", false) && [
    'v0.10',
    'v0.9.'
].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/ /*<replacement>*/ var Duplex;
/*</replacement>*/ Writable.WritableState = WritableState;
/*<replacement>*/ var util = Object.create(__turbopack_context__.r("[project]/node_modules/core-util-is/lib/util.js [app-route] (ecmascript)"));
util.inherits = __turbopack_context__.r("[project]/node_modules/inherits/inherits.js [app-route] (ecmascript)");
/*</replacement>*/ /*<replacement>*/ var internalUtil = {
    deprecate: __turbopack_context__.r("[project]/node_modules/util-deprecate/node.js [app-route] (ecmascript)")
};
/*</replacement>*/ /*<replacement>*/ var Stream = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/internal/streams/stream.js [app-route] (ecmascript)");
/*</replacement>*/ /*<replacement>*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var OurUint8Array = (("TURBOPACK compile-time truthy", 1) ? /*TURBOPACK member replacement*/ __turbopack_context__.g : "TURBOPACK unreachable").Uint8Array || function() {};
function _uint8ArrayToBuffer(chunk) {
    return Buffer.from(chunk);
}
function _isUint8Array(obj) {
    return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/ var destroyImpl = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/internal/streams/destroy.js [app-route] (ecmascript)");
util.inherits(Writable, Stream);
function nop() {}
function WritableState(options, stream) {
    Duplex = Duplex || __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_duplex.js [app-route] (ecmascript)");
    options = options || {};
    // Duplex streams are both readable and writable, but share
    // the same options object.
    // However, some cases require setting options to different
    // values for the readable and the writable sides of the duplex stream.
    // These options can be provided separately as readableXXX and writableXXX.
    var isDuplex = stream instanceof Duplex;
    // object stream flag to indicate whether or not this stream
    // contains buffers or objects.
    this.objectMode = !!options.objectMode;
    if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
    // the point at which write() starts returning false
    // Note: 0 is a valid value, means that we always return false if
    // the entire buffer is not flushed immediately on write()
    var hwm = options.highWaterMark;
    var writableHwm = options.writableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
    if (hwm || hwm === 0) this.highWaterMark = hwm;
    else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;
    else this.highWaterMark = defaultHwm;
    // cast to ints.
    this.highWaterMark = Math.floor(this.highWaterMark);
    // if _final has been called
    this.finalCalled = false;
    // drain event flag.
    this.needDrain = false;
    // at the start of calling end()
    this.ending = false;
    // when end() has been called, and returned
    this.ended = false;
    // when 'finish' is emitted
    this.finished = false;
    // has it been destroyed
    this.destroyed = false;
    // should we decode strings into buffers before passing to _write?
    // this is here so that some node-core streams can optimize string
    // handling at a lower level.
    var noDecode = options.decodeStrings === false;
    this.decodeStrings = !noDecode;
    // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.
    this.defaultEncoding = options.defaultEncoding || 'utf8';
    // not an actual buffer we keep track of, but a measurement
    // of how much we're waiting to get pushed to some underlying
    // socket or file.
    this.length = 0;
    // a flag to see when we're in the middle of a write.
    this.writing = false;
    // when true all writes will be buffered until .uncork() call
    this.corked = 0;
    // a flag to be able to tell if the onwrite cb is called immediately,
    // or on a later tick.  We set this to true at first, because any
    // actions that shouldn't happen until "later" should generally also
    // not happen before the first write call.
    this.sync = true;
    // a flag to know if we're processing previously buffered items, which
    // may call the _write() callback in the same tick, so that we don't
    // end up in an overlapped onwrite situation.
    this.bufferProcessing = false;
    // the callback that's passed to _write(chunk,cb)
    this.onwrite = function(er) {
        onwrite(stream, er);
    };
    // the callback that the user supplies to write(chunk,encoding,cb)
    this.writecb = null;
    // the amount that is being written when _write is called.
    this.writelen = 0;
    this.bufferedRequest = null;
    this.lastBufferedRequest = null;
    // number of pending user-supplied write callbacks
    // this must be 0 before 'finish' can be emitted
    this.pendingcb = 0;
    // emit prefinish if the only thing we're waiting for is _write cbs
    // This is relevant for synchronous Transform streams
    this.prefinished = false;
    // True if the error was already emitted and should not be thrown again
    this.errorEmitted = false;
    // count buffered requests
    this.bufferedRequestCount = 0;
    // allocate the first CorkedRequest, there is always
    // one allocated and free to use, and we maintain at most two
    this.corkedRequestsFree = new CorkedRequest(this);
}
WritableState.prototype.getBuffer = function getBuffer() {
    var current = this.bufferedRequest;
    var out = [];
    while(current){
        out.push(current);
        current = current.next;
    }
    return out;
};
(function() {
    try {
        Object.defineProperty(WritableState.prototype, 'buffer', {
            get: internalUtil.deprecate(function() {
                return this.getBuffer();
            }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
        });
    } catch (_) {}
})();
// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
    realHasInstance = Function.prototype[Symbol.hasInstance];
    Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function(object) {
            if (realHasInstance.call(this, object)) return true;
            if (this !== Writable) return false;
            return object && object._writableState instanceof WritableState;
        }
    });
} else {
    realHasInstance = function(object) {
        return object instanceof this;
    };
}
function Writable(options) {
    Duplex = Duplex || __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_duplex.js [app-route] (ecmascript)");
    // Writable ctor is applied to Duplexes, too.
    // `realHasInstance` is necessary because using plain `instanceof`
    // would return false, as no `_writableState` property is attached.
    // Trying to use the custom `instanceof` for Writable here will also break the
    // Node.js LazyTransform implementation, which has a non-trivial getter for
    // `_writableState` that would lead to infinite recursion.
    if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
        return new Writable(options);
    }
    this._writableState = new WritableState(options, this);
    // legacy.
    this.writable = true;
    if (options) {
        if (typeof options.write === 'function') this._write = options.write;
        if (typeof options.writev === 'function') this._writev = options.writev;
        if (typeof options.destroy === 'function') this._destroy = options.destroy;
        if (typeof options.final === 'function') this._final = options.final;
    }
    Stream.call(this);
}
// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
    this.emit('error', new Error('Cannot pipe, not readable'));
};
function writeAfterEnd(stream, cb) {
    var er = new Error('write after end');
    // TODO: defer error events consistently everywhere, not just the cb
    stream.emit('error', er);
    pna.nextTick(cb, er);
}
// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
    var valid = true;
    var er = false;
    if (chunk === null) {
        er = new TypeError('May not write null values to stream');
    } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
        er = new TypeError('Invalid non-string/buffer chunk');
    }
    if (er) {
        stream.emit('error', er);
        pna.nextTick(cb, er);
        valid = false;
    }
    return valid;
}
Writable.prototype.write = function(chunk, encoding, cb) {
    var state = this._writableState;
    var ret = false;
    var isBuf = !state.objectMode && _isUint8Array(chunk);
    if (isBuf && !Buffer.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
    }
    if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
    }
    if (isBuf) encoding = 'buffer';
    else if (!encoding) encoding = state.defaultEncoding;
    if (typeof cb !== 'function') cb = nop;
    if (state.ended) writeAfterEnd(this, cb);
    else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
    }
    return ret;
};
Writable.prototype.cork = function() {
    var state = this._writableState;
    state.corked++;
};
Writable.prototype.uncork = function() {
    var state = this._writableState;
    if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
    }
};
Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    // node::ParseEncoding() requires lower case.
    if (typeof encoding === 'string') encoding = encoding.toLowerCase();
    if (!([
        'hex',
        'utf8',
        'utf-8',
        'ascii',
        'binary',
        'base64',
        'ucs2',
        'ucs-2',
        'utf16le',
        'utf-16le',
        'raw'
    ].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
    this._writableState.defaultEncoding = encoding;
    return this;
};
function decodeChunk(state, chunk, encoding) {
    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
        chunk = Buffer.from(chunk, encoding);
    }
    return chunk;
}
Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function() {
        return this._writableState.highWaterMark;
    }
});
// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
    if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
            isBuf = true;
            encoding = 'buffer';
            chunk = newChunk;
        }
    }
    var len = state.objectMode ? 1 : chunk.length;
    state.length += len;
    var ret = state.length < state.highWaterMark;
    // we must ensure that previous needDrain will not be reset to false.
    if (!ret) state.needDrain = true;
    if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
            chunk: chunk,
            encoding: encoding,
            isBuf: isBuf,
            callback: cb,
            next: null
        };
        if (last) {
            last.next = state.lastBufferedRequest;
        } else {
            state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
    } else {
        doWrite(stream, state, false, len, chunk, encoding, cb);
    }
    return ret;
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    if (writev) stream._writev(chunk, state.onwrite);
    else stream._write(chunk, encoding, state.onwrite);
    state.sync = false;
}
function onwriteError(stream, state, sync, er, cb) {
    --state.pendingcb;
    if (sync) {
        // defer the callback if we are being called synchronously
        // to avoid piling up things on the stack
        pna.nextTick(cb, er);
        // this can emit finish, and it will always happen
        // after error
        pna.nextTick(finishMaybe, stream, state);
        stream._writableState.errorEmitted = true;
        stream.emit('error', er);
    } else {
        // the caller expect this to happen before if
        // it is async
        cb(er);
        stream._writableState.errorEmitted = true;
        stream.emit('error', er);
        // this can emit finish, but finish must
        // always follow error
        finishMaybe(stream, state);
    }
}
function onwriteStateUpdate(state) {
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
}
function onwrite(stream, er) {
    var state = stream._writableState;
    var sync = state.sync;
    var cb = state.writecb;
    onwriteStateUpdate(state);
    if (er) onwriteError(stream, state, sync, er, cb);
    else {
        // Check if we're actually ready to finish, but don't emit yet
        var finished = needFinish(state);
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
            clearBuffer(stream, state);
        }
        if (sync) {
            /*<replacement>*/ asyncWrite(afterWrite, stream, state, finished, cb);
        /*</replacement>*/ } else {
            afterWrite(stream, state, finished, cb);
        }
    }
}
function afterWrite(stream, state, finished, cb) {
    if (!finished) onwriteDrain(stream, state);
    state.pendingcb--;
    cb();
    finishMaybe(stream, state);
}
// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
    if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit('drain');
    }
}
// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
    state.bufferProcessing = true;
    var entry = state.bufferedRequest;
    if (stream._writev && entry && entry.next) {
        // Fast case, write everything using _writev()
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while(entry){
            buffer[count] = entry;
            if (!entry.isBuf) allBuffers = false;
            entry = entry.next;
            count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream, state, true, state.length, buffer, '', holder.finish);
        // doWrite is almost always async, defer these to save a bit of time
        // as the hot path ends with doWrite
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
            state.corkedRequestsFree = holder.next;
            holder.next = null;
        } else {
            state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
    } else {
        // Slow case, write chunks one-by-one
        while(entry){
            var chunk = entry.chunk;
            var encoding = entry.encoding;
            var cb = entry.callback;
            var len = state.objectMode ? 1 : chunk.length;
            doWrite(stream, state, false, len, chunk, encoding, cb);
            entry = entry.next;
            state.bufferedRequestCount--;
            // if we didn't call the onwrite immediately, then
            // it means that we need to wait until it does.
            // also, that means that the chunk and cb are currently
            // being processed, so move the buffer counter past them.
            if (state.writing) {
                break;
            }
        }
        if (entry === null) state.lastBufferedRequest = null;
    }
    state.bufferedRequest = entry;
    state.bufferProcessing = false;
}
Writable.prototype._write = function(chunk, encoding, cb) {
    cb(new Error('_write() is not implemented'));
};
Writable.prototype._writev = null;
Writable.prototype.end = function(chunk, encoding, cb) {
    var state = this._writableState;
    if (typeof chunk === 'function') {
        cb = chunk;
        chunk = null;
        encoding = null;
    } else if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
    }
    if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);
    // .end() fully uncorks
    if (state.corked) {
        state.corked = 1;
        this.uncork();
    }
    // ignore unnecessary end() calls.
    if (!state.ending) endWritable(this, state, cb);
};
function needFinish(state) {
    return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
    stream._final(function(err) {
        state.pendingcb--;
        if (err) {
            stream.emit('error', err);
        }
        state.prefinished = true;
        stream.emit('prefinish');
        finishMaybe(stream, state);
    });
}
function prefinish(stream, state) {
    if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === 'function') {
            state.pendingcb++;
            state.finalCalled = true;
            pna.nextTick(callFinal, stream, state);
        } else {
            state.prefinished = true;
            stream.emit('prefinish');
        }
    }
}
function finishMaybe(stream, state) {
    var need = needFinish(state);
    if (need) {
        prefinish(stream, state);
        if (state.pendingcb === 0) {
            state.finished = true;
            stream.emit('finish');
        }
    }
    return need;
}
function endWritable(stream, state, cb) {
    state.ending = true;
    finishMaybe(stream, state);
    if (cb) {
        if (state.finished) pna.nextTick(cb);
        else stream.once('finish', cb);
    }
    state.ended = true;
    stream.writable = false;
}
function onCorkedFinish(corkReq, state, err) {
    var entry = corkReq.entry;
    corkReq.entry = null;
    while(entry){
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
    }
    // reuse the free corkReq.
    state.corkedRequestsFree.next = corkReq;
}
Object.defineProperty(Writable.prototype, 'destroyed', {
    get: function() {
        if (this._writableState === undefined) {
            return false;
        }
        return this._writableState.destroyed;
    },
    set: function(value) {
        // we ignore the value if the stream
        // has not been initialized yet
        if (!this._writableState) {
            return;
        }
        // backward compatibility, the user is explicitly
        // managing destroyed
        this._writableState.destroyed = value;
    }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function(err, cb) {
    this.end();
    cb(err);
};
}),
"[project]/node_modules/readable-stream/lib/_stream_duplex.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.
/*<replacement>*/ var pna = __turbopack_context__.r("[project]/node_modules/process-nextick-args/index.js [app-route] (ecmascript)");
/*</replacement>*/ /*<replacement>*/ var objectKeys = Object.keys || function(obj) {
    var keys = [];
    for(var key in obj){
        keys.push(key);
    }
    return keys;
};
/*</replacement>*/ module.exports = Duplex;
/*<replacement>*/ var util = Object.create(__turbopack_context__.r("[project]/node_modules/core-util-is/lib/util.js [app-route] (ecmascript)"));
util.inherits = __turbopack_context__.r("[project]/node_modules/inherits/inherits.js [app-route] (ecmascript)");
/*</replacement>*/ var Readable = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_readable.js [app-route] (ecmascript)");
var Writable = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_writable.js [app-route] (ecmascript)");
util.inherits(Duplex, Readable);
{
    // avoid scope creep, the keys array can then be collected
    var keys = objectKeys(Writable.prototype);
    for(var v = 0; v < keys.length; v++){
        var method = keys[v];
        if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
    }
}function Duplex(options) {
    if (!(this instanceof Duplex)) return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    if (options && options.readable === false) this.readable = false;
    if (options && options.writable === false) this.writable = false;
    this.allowHalfOpen = true;
    if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
    this.once('end', onend);
}
Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function() {
        return this._writableState.highWaterMark;
    }
});
// the no-half-open enforcer
function onend() {
    // if we allow half-open state, or if the writable side ended,
    // then we're ok.
    if (this.allowHalfOpen || this._writableState.ended) return;
    // no more data can be written.
    // But allow more writes to happen in this tick.
    pna.nextTick(onEndNT, this);
}
function onEndNT(self) {
    self.end();
}
Object.defineProperty(Duplex.prototype, 'destroyed', {
    get: function() {
        if (this._readableState === undefined || this._writableState === undefined) {
            return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(value) {
        // we ignore the value if the stream
        // has not been initialized yet
        if (this._readableState === undefined || this._writableState === undefined) {
            return;
        }
        // backward compatibility, the user is explicitly
        // managing destroyed
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
    }
});
Duplex.prototype._destroy = function(err, cb) {
    this.push(null);
    this.end();
    pna.nextTick(cb, err);
};
}),
"[project]/node_modules/readable-stream/lib/_stream_readable.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
/*<replacement>*/ var pna = __turbopack_context__.r("[project]/node_modules/process-nextick-args/index.js [app-route] (ecmascript)");
/*</replacement>*/ module.exports = Readable;
/*<replacement>*/ var isArray = __turbopack_context__.r("[project]/node_modules/readable-stream/node_modules/isarray/index.js [app-route] (ecmascript)");
/*</replacement>*/ /*<replacement>*/ var Duplex;
/*</replacement>*/ Readable.ReadableState = ReadableState;
/*<replacement>*/ var EE = __turbopack_context__.r("[externals]/events [external] (events, cjs)").EventEmitter;
var EElistenerCount = function(emitter, type) {
    return emitter.listeners(type).length;
};
/*</replacement>*/ /*<replacement>*/ var Stream = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/internal/streams/stream.js [app-route] (ecmascript)");
/*</replacement>*/ /*<replacement>*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
var OurUint8Array = (("TURBOPACK compile-time truthy", 1) ? /*TURBOPACK member replacement*/ __turbopack_context__.g : "TURBOPACK unreachable").Uint8Array || function() {};
function _uint8ArrayToBuffer(chunk) {
    return Buffer.from(chunk);
}
function _isUint8Array(obj) {
    return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/ /*<replacement>*/ var util = Object.create(__turbopack_context__.r("[project]/node_modules/core-util-is/lib/util.js [app-route] (ecmascript)"));
util.inherits = __turbopack_context__.r("[project]/node_modules/inherits/inherits.js [app-route] (ecmascript)");
/*</replacement>*/ /*<replacement>*/ var debugUtil = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
    debug = debugUtil.debuglog('stream');
} else {
    debug = function() {};
}
/*</replacement>*/ var BufferList = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/internal/streams/BufferList.js [app-route] (ecmascript)");
var destroyImpl = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/internal/streams/destroy.js [app-route] (ecmascript)");
var StringDecoder;
util.inherits(Readable, Stream);
var kProxyEvents = [
    'error',
    'close',
    'destroy',
    'pause',
    'resume'
];
function prependListener(emitter, event, fn) {
    // Sadly this is not cacheable as some libraries bundle their own
    // event emitter implementation with them.
    if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
    else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);
    else emitter._events[event] = [
        fn,
        emitter._events[event]
    ];
}
function ReadableState(options, stream) {
    Duplex = Duplex || __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_duplex.js [app-route] (ecmascript)");
    options = options || {};
    // Duplex streams are both readable and writable, but share
    // the same options object.
    // However, some cases require setting options to different
    // values for the readable and the writable sides of the duplex stream.
    // These options can be provided separately as readableXXX and writableXXX.
    var isDuplex = stream instanceof Duplex;
    // object stream flag. Used to make read(n) ignore n and to
    // make all the buffer merging and length checks go away
    this.objectMode = !!options.objectMode;
    if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
    // the point at which it stops calling _read() to fill the buffer
    // Note: 0 is a valid value, means "don't call _read preemptively ever"
    var hwm = options.highWaterMark;
    var readableHwm = options.readableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
    if (hwm || hwm === 0) this.highWaterMark = hwm;
    else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;
    else this.highWaterMark = defaultHwm;
    // cast to ints.
    this.highWaterMark = Math.floor(this.highWaterMark);
    // A linked list is used to store data chunks instead of an array because the
    // linked list can remove elements from the beginning faster than
    // array.shift()
    this.buffer = new BufferList();
    this.length = 0;
    this.pipes = null;
    this.pipesCount = 0;
    this.flowing = null;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false;
    // a flag to be able to tell if the event 'readable'/'data' is emitted
    // immediately, or on a later tick.  We set this to true at first, because
    // any actions that shouldn't happen until "later" should generally also
    // not happen before the first read call.
    this.sync = true;
    // whenever we return null, then we set a flag to say
    // that we're awaiting a 'readable' event emission.
    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.resumeScheduled = false;
    // has it been destroyed
    this.destroyed = false;
    // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.
    this.defaultEncoding = options.defaultEncoding || 'utf8';
    // the number of writers that are awaiting a drain event in .pipe()s
    this.awaitDrain = 0;
    // if true, a maybeReadMore has been scheduled
    this.readingMore = false;
    this.decoder = null;
    this.encoding = null;
    if (options.encoding) {
        if (!StringDecoder) StringDecoder = __turbopack_context__.f({
            "string_decoder": {
                id: ()=>"[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)",
                module: ()=>__turbopack_context__.r("[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)")
            },
            "string_decoder/": {
                id: ()=>"[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)",
                module: ()=>__turbopack_context__.r("[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)")
            }
        })('string_decoder/').StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
    }
}
function Readable(options) {
    Duplex = Duplex || __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_duplex.js [app-route] (ecmascript)");
    if (!(this instanceof Readable)) return new Readable(options);
    this._readableState = new ReadableState(options, this);
    // legacy
    this.readable = true;
    if (options) {
        if (typeof options.read === 'function') this._read = options.read;
        if (typeof options.destroy === 'function') this._destroy = options.destroy;
    }
    Stream.call(this);
}
Object.defineProperty(Readable.prototype, 'destroyed', {
    get: function() {
        if (this._readableState === undefined) {
            return false;
        }
        return this._readableState.destroyed;
    },
    set: function(value) {
        // we ignore the value if the stream
        // has not been initialized yet
        if (!this._readableState) {
            return;
        }
        // backward compatibility, the user is explicitly
        // managing destroyed
        this._readableState.destroyed = value;
    }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function(err, cb) {
    this.push(null);
    cb(err);
};
// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
    var state = this._readableState;
    var skipChunkCheck;
    if (!state.objectMode) {
        if (typeof chunk === 'string') {
            encoding = encoding || state.defaultEncoding;
            if (encoding !== state.encoding) {
                chunk = Buffer.from(chunk, encoding);
                encoding = '';
            }
            skipChunkCheck = true;
        }
    } else {
        skipChunkCheck = true;
    }
    return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};
// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
    return readableAddChunk(this, chunk, null, true, false);
};
function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
    var state = stream._readableState;
    if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
    } else {
        var er;
        if (!skipChunkCheck) er = chunkInvalid(state, chunk);
        if (er) {
            stream.emit('error', er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
            if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
                chunk = _uint8ArrayToBuffer(chunk);
            }
            if (addToFront) {
                if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));
                else addChunk(stream, state, chunk, true);
            } else if (state.ended) {
                stream.emit('error', new Error('stream.push() after EOF'));
            } else {
                state.reading = false;
                if (state.decoder && !encoding) {
                    chunk = state.decoder.write(chunk);
                    if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);
                    else maybeReadMore(stream, state);
                } else {
                    addChunk(stream, state, chunk, false);
                }
            }
        } else if (!addToFront) {
            state.reading = false;
        }
    }
    return needMoreData(state);
}
function addChunk(stream, state, chunk, addToFront) {
    if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit('data', chunk);
        stream.read(0);
    } else {
        // update the buffer info.
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) state.buffer.unshift(chunk);
        else state.buffer.push(chunk);
        if (state.needReadable) emitReadable(stream);
    }
    maybeReadMore(stream, state);
}
function chunkInvalid(state, chunk) {
    var er;
    if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
        er = new TypeError('Invalid non-string/buffer chunk');
    }
    return er;
}
// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}
Readable.prototype.isPaused = function() {
    return this._readableState.flowing === false;
};
// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
    if (!StringDecoder) StringDecoder = __turbopack_context__.f({
        "string_decoder": {
            id: ()=>"[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)",
            module: ()=>__turbopack_context__.r("[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)")
        },
        "string_decoder/": {
            id: ()=>"[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)",
            module: ()=>__turbopack_context__.r("[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)")
        }
    })('string_decoder/').StringDecoder;
    this._readableState.decoder = new StringDecoder(enc);
    this._readableState.encoding = enc;
    return this;
};
// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
    if (n >= MAX_HWM) {
        n = MAX_HWM;
    } else {
        // Get the next highest power of 2 to prevent increasing hwm excessively in
        // tiny amounts
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
    }
    return n;
}
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
    if (n <= 0 || state.length === 0 && state.ended) return 0;
    if (state.objectMode) return 1;
    if (n !== n) {
        // Only flow one buffer at a time
        if (state.flowing && state.length) return state.buffer.head.data.length;
        else return state.length;
    }
    // If we're asking for more than the current hwm, then raise the hwm.
    if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
    if (n <= state.length) return n;
    // Don't have enough
    if (!state.ended) {
        state.needReadable = true;
        return 0;
    }
    return state.length;
}
// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
    debug('read', n);
    n = parseInt(n, 10);
    var state = this._readableState;
    var nOrig = n;
    if (n !== 0) state.emittedReadable = false;
    // if we're doing read(0) to trigger a readable event, but we
    // already have a bunch of data in the buffer, then just trigger
    // the 'readable' event and move on.
    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        debug('read: emitReadable', state.length, state.ended);
        if (state.length === 0 && state.ended) endReadable(this);
        else emitReadable(this);
        return null;
    }
    n = howMuchToRead(n, state);
    // if we've ended, and we're now clear, then finish it up.
    if (n === 0 && state.ended) {
        if (state.length === 0) endReadable(this);
        return null;
    }
    // All the actual chunk generation logic needs to be
    // *below* the call to _read.  The reason is that in certain
    // synthetic stream cases, such as passthrough streams, _read
    // may be a completely synchronous operation which may change
    // the state of the read buffer, providing enough data when
    // before there was *not* enough.
    //
    // So, the steps are:
    // 1. Figure out what the state of things will be after we do
    // a read from the buffer.
    //
    // 2. If that resulting state will trigger a _read, then call _read.
    // Note that this may be asynchronous, or synchronous.  Yes, it is
    // deeply ugly to write APIs this way, but that still doesn't mean
    // that the Readable class should behave improperly, as streams are
    // designed to be sync/async agnostic.
    // Take note if the _read call is sync or async (ie, if the read call
    // has returned yet), so that we know whether or not it's safe to emit
    // 'readable' etc.
    //
    // 3. Actually pull the requested chunks out of the buffer and return.
    // if we need a readable event, then we need to do some reading.
    var doRead = state.needReadable;
    debug('need readable', doRead);
    // if we currently have less than the highWaterMark, then also read some
    if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug('length less than watermark', doRead);
    }
    // however, if we've ended, then there's no point, and if we're already
    // reading, then it's unnecessary.
    if (state.ended || state.reading) {
        doRead = false;
        debug('reading or ended', doRead);
    } else if (doRead) {
        debug('do read');
        state.reading = true;
        state.sync = true;
        // if the length is currently zero, then we *need* a readable event.
        if (state.length === 0) state.needReadable = true;
        // call internal read method
        this._read(state.highWaterMark);
        state.sync = false;
        // If _read pushed data synchronously, then `reading` will be false,
        // and we need to re-evaluate how much data we can return to the user.
        if (!state.reading) n = howMuchToRead(nOrig, state);
    }
    var ret;
    if (n > 0) ret = fromList(n, state);
    else ret = null;
    if (ret === null) {
        state.needReadable = true;
        n = 0;
    } else {
        state.length -= n;
    }
    if (state.length === 0) {
        // If we have nothing in the buffer, then we want to know
        // as soon as we *do* get something into the buffer.
        if (!state.ended) state.needReadable = true;
        // If we tried to read() past the EOF, then emit end on the next tick.
        if (nOrig !== n && state.ended) endReadable(this);
    }
    if (ret !== null) this.emit('data', ret);
    return ret;
};
function onEofChunk(stream, state) {
    if (state.ended) return;
    if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
            state.buffer.push(chunk);
            state.length += state.objectMode ? 1 : chunk.length;
        }
    }
    state.ended = true;
    // emit 'readable' now to make sure it gets picked up.
    emitReadable(stream);
}
// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
    var state = stream._readableState;
    state.needReadable = false;
    if (!state.emittedReadable) {
        debug('emitReadable', state.flowing);
        state.emittedReadable = true;
        if (state.sync) pna.nextTick(emitReadable_, stream);
        else emitReadable_(stream);
    }
}
function emitReadable_(stream) {
    debug('emit readable');
    stream.emit('readable');
    flow(stream);
}
// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
    if (!state.readingMore) {
        state.readingMore = true;
        pna.nextTick(maybeReadMore_, stream, state);
    }
}
function maybeReadMore_(stream, state) {
    var len = state.length;
    while(!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark){
        debug('maybeReadMore read 0');
        stream.read(0);
        if (len === state.length) break;
        else len = state.length;
    }
    state.readingMore = false;
}
// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
    this.emit('error', new Error('_read() is not implemented'));
};
Readable.prototype.pipe = function(dest, pipeOpts) {
    var src = this;
    var state = this._readableState;
    switch(state.pipesCount){
        case 0:
            state.pipes = dest;
            break;
        case 1:
            state.pipes = [
                state.pipes,
                dest
            ];
            break;
        default:
            state.pipes.push(dest);
            break;
    }
    state.pipesCount += 1;
    debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
    var endFn = doEnd ? onend : unpipe;
    if (state.endEmitted) pna.nextTick(endFn);
    else src.once('end', endFn);
    dest.on('unpipe', onunpipe);
    function onunpipe(readable, unpipeInfo) {
        debug('onunpipe');
        if (readable === src) {
            if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
                unpipeInfo.hasUnpiped = true;
                cleanup();
            }
        }
    }
    function onend() {
        debug('onend');
        dest.end();
    }
    // when the dest drains, it reduces the awaitDrain counter
    // on the source.  This would be more elegant with a .once()
    // handler in flow(), but adding and removing repeatedly is
    // too slow.
    var ondrain = pipeOnDrain(src);
    dest.on('drain', ondrain);
    var cleanedUp = false;
    function cleanup() {
        debug('cleanup');
        // cleanup event handlers once the pipe is broken
        dest.removeListener('close', onclose);
        dest.removeListener('finish', onfinish);
        dest.removeListener('drain', ondrain);
        dest.removeListener('error', onerror);
        dest.removeListener('unpipe', onunpipe);
        src.removeListener('end', onend);
        src.removeListener('end', unpipe);
        src.removeListener('data', ondata);
        cleanedUp = true;
        // if the reader is waiting for a drain event from this
        // specific writer, then it would cause it to never start
        // flowing again.
        // So, if this is awaiting a drain, then we just call it now.
        // If we don't know, then assume that we are waiting for one.
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
    }
    // If the user pushes more data while we're writing to dest then we'll end up
    // in ondata again. However, we only want to increase awaitDrain once because
    // dest will only emit one 'drain' event for the multiple writes.
    // => Introduce a guard on increasing awaitDrain.
    var increasedAwaitDrain = false;
    src.on('data', ondata);
    function ondata(chunk) {
        debug('ondata');
        increasedAwaitDrain = false;
        var ret = dest.write(chunk);
        if (false === ret && !increasedAwaitDrain) {
            // If the user unpiped during `dest.write()`, it is possible
            // to get stuck in a permanently paused state if that write
            // also returned false.
            // => Check whether `dest` is still a piping destination.
            if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
                debug('false write response, pause', state.awaitDrain);
                state.awaitDrain++;
                increasedAwaitDrain = true;
            }
            src.pause();
        }
    }
    // if the dest has an error, then stop piping into it.
    // however, don't suppress the throwing behavior for this.
    function onerror(er) {
        debug('onerror', er);
        unpipe();
        dest.removeListener('error', onerror);
        if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
    }
    // Make sure our error handler is attached before userland ones.
    prependListener(dest, 'error', onerror);
    // Both close and finish should trigger unpipe, but only once.
    function onclose() {
        dest.removeListener('finish', onfinish);
        unpipe();
    }
    dest.once('close', onclose);
    function onfinish() {
        debug('onfinish');
        dest.removeListener('close', onclose);
        unpipe();
    }
    dest.once('finish', onfinish);
    function unpipe() {
        debug('unpipe');
        src.unpipe(dest);
    }
    // tell the dest that it's being piped to
    dest.emit('pipe', src);
    // start the flow if it hasn't been started already.
    if (!state.flowing) {
        debug('pipe resume');
        src.resume();
    }
    return dest;
};
function pipeOnDrain(src) {
    return function() {
        var state = src._readableState;
        debug('pipeOnDrain', state.awaitDrain);
        if (state.awaitDrain) state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
            state.flowing = true;
            flow(src);
        }
    };
}
Readable.prototype.unpipe = function(dest) {
    var state = this._readableState;
    var unpipeInfo = {
        hasUnpiped: false
    };
    // if we're not piping anywhere, then do nothing.
    if (state.pipesCount === 0) return this;
    // just one destination.  most common case.
    if (state.pipesCount === 1) {
        // passed in one, but it's not the right one.
        if (dest && dest !== state.pipes) return this;
        if (!dest) dest = state.pipes;
        // got a match.
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest) dest.emit('unpipe', this, unpipeInfo);
        return this;
    }
    // slow case. multiple pipe destinations.
    if (!dest) {
        // remove all.
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for(var i = 0; i < len; i++){
            dests[i].emit('unpipe', this, {
                hasUnpiped: false
            });
        }
        return this;
    }
    // try to find the right one.
    var index = indexOf(state.pipes, dest);
    if (index === -1) return this;
    state.pipes.splice(index, 1);
    state.pipesCount -= 1;
    if (state.pipesCount === 1) state.pipes = state.pipes[0];
    dest.emit('unpipe', this, unpipeInfo);
    return this;
};
// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
    var res = Stream.prototype.on.call(this, ev, fn);
    if (ev === 'data') {
        // Start flowing on next tick if stream isn't explicitly paused
        if (this._readableState.flowing !== false) this.resume();
    } else if (ev === 'readable') {
        var state = this._readableState;
        if (!state.endEmitted && !state.readableListening) {
            state.readableListening = state.needReadable = true;
            state.emittedReadable = false;
            if (!state.reading) {
                pna.nextTick(nReadingNextTick, this);
            } else if (state.length) {
                emitReadable(this);
            }
        }
    }
    return res;
};
Readable.prototype.addListener = Readable.prototype.on;
function nReadingNextTick(self) {
    debug('readable nexttick read 0');
    self.read(0);
}
// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
    var state = this._readableState;
    if (!state.flowing) {
        debug('resume');
        state.flowing = true;
        resume(this, state);
    }
    return this;
};
function resume(stream, state) {
    if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        pna.nextTick(resume_, stream, state);
    }
}
function resume_(stream, state) {
    if (!state.reading) {
        debug('resume read 0');
        stream.read(0);
    }
    state.resumeScheduled = false;
    state.awaitDrain = 0;
    stream.emit('resume');
    flow(stream);
    if (state.flowing && !state.reading) stream.read(0);
}
Readable.prototype.pause = function() {
    debug('call pause flowing=%j', this._readableState.flowing);
    if (false !== this._readableState.flowing) {
        debug('pause');
        this._readableState.flowing = false;
        this.emit('pause');
    }
    return this;
};
function flow(stream) {
    var state = stream._readableState;
    debug('flow', state.flowing);
    while(state.flowing && stream.read() !== null){}
}
// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
    var _this = this;
    var state = this._readableState;
    var paused = false;
    stream.on('end', function() {
        debug('wrapped end');
        if (state.decoder && !state.ended) {
            var chunk = state.decoder.end();
            if (chunk && chunk.length) _this.push(chunk);
        }
        _this.push(null);
    });
    stream.on('data', function(chunk) {
        debug('wrapped data');
        if (state.decoder) chunk = state.decoder.write(chunk);
        // don't skip over falsy values in objectMode
        if (state.objectMode && (chunk === null || chunk === undefined)) return;
        else if (!state.objectMode && (!chunk || !chunk.length)) return;
        var ret = _this.push(chunk);
        if (!ret) {
            paused = true;
            stream.pause();
        }
    });
    // proxy all the other methods.
    // important when wrapping filters and duplexes.
    for(var i in stream){
        if (this[i] === undefined && typeof stream[i] === 'function') {
            this[i] = function(method) {
                return function() {
                    return stream[method].apply(stream, arguments);
                };
            }(i);
        }
    }
    // proxy certain important events.
    for(var n = 0; n < kProxyEvents.length; n++){
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
    }
    // when we try to consume some more bytes, simply unpause the
    // underlying stream.
    this._read = function(n) {
        debug('wrapped _read', n);
        if (paused) {
            paused = false;
            stream.resume();
        }
    };
    return this;
};
Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function() {
        return this._readableState.highWaterMark;
    }
});
// exposed for testing purposes only.
Readable._fromList = fromList;
// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
    // nothing buffered
    if (state.length === 0) return null;
    var ret;
    if (state.objectMode) ret = state.buffer.shift();
    else if (!n || n >= state.length) {
        // read it all, truncate the list
        if (state.decoder) ret = state.buffer.join('');
        else if (state.buffer.length === 1) ret = state.buffer.head.data;
        else ret = state.buffer.concat(state.length);
        state.buffer.clear();
    } else {
        // read part of list
        ret = fromListPartial(n, state.buffer, state.decoder);
    }
    return ret;
}
// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
    var ret;
    if (n < list.head.data.length) {
        // slice is the same for buffers and strings
        ret = list.head.data.slice(0, n);
        list.head.data = list.head.data.slice(n);
    } else if (n === list.head.data.length) {
        // first chunk is a perfect match
        ret = list.shift();
    } else {
        // result spans more than one buffer
        ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
    }
    return ret;
}
// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
    var p = list.head;
    var c = 1;
    var ret = p.data;
    n -= ret.length;
    while(p = p.next){
        var str = p.data;
        var nb = n > str.length ? str.length : n;
        if (nb === str.length) ret += str;
        else ret += str.slice(0, n);
        n -= nb;
        if (n === 0) {
            if (nb === str.length) {
                ++c;
                if (p.next) list.head = p.next;
                else list.head = list.tail = null;
            } else {
                list.head = p;
                p.data = str.slice(nb);
            }
            break;
        }
        ++c;
    }
    list.length -= c;
    return ret;
}
// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
    var ret = Buffer.allocUnsafe(n);
    var p = list.head;
    var c = 1;
    p.data.copy(ret);
    n -= p.data.length;
    while(p = p.next){
        var buf = p.data;
        var nb = n > buf.length ? buf.length : n;
        buf.copy(ret, ret.length - n, 0, nb);
        n -= nb;
        if (n === 0) {
            if (nb === buf.length) {
                ++c;
                if (p.next) list.head = p.next;
                else list.head = list.tail = null;
            } else {
                list.head = p;
                p.data = buf.slice(nb);
            }
            break;
        }
        ++c;
    }
    list.length -= c;
    return ret;
}
function endReadable(stream) {
    var state = stream._readableState;
    // If we get here before consuming all the bytes, then that is a
    // bug in node.  Should never happen.
    if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
    if (!state.endEmitted) {
        state.ended = true;
        pna.nextTick(endReadableNT, state, stream);
    }
}
function endReadableNT(state, stream) {
    // Check that we didn't get one last unshift.
    if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
    }
}
function indexOf(xs, x) {
    for(var i = 0, l = xs.length; i < l; i++){
        if (xs[i] === x) return i;
    }
    return -1;
}
}),
"[project]/node_modules/readable-stream/lib/_stream_transform.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.
module.exports = Transform;
var Duplex = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_duplex.js [app-route] (ecmascript)");
/*<replacement>*/ var util = Object.create(__turbopack_context__.r("[project]/node_modules/core-util-is/lib/util.js [app-route] (ecmascript)"));
util.inherits = __turbopack_context__.r("[project]/node_modules/inherits/inherits.js [app-route] (ecmascript)");
/*</replacement>*/ util.inherits(Transform, Duplex);
function afterTransform(er, data) {
    var ts = this._transformState;
    ts.transforming = false;
    var cb = ts.writecb;
    if (!cb) {
        return this.emit('error', new Error('write callback called multiple times'));
    }
    ts.writechunk = null;
    ts.writecb = null;
    if (data != null) this.push(data);
    cb(er);
    var rs = this._readableState;
    rs.reading = false;
    if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
    }
}
function Transform(options) {
    if (!(this instanceof Transform)) return new Transform(options);
    Duplex.call(this, options);
    this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
    };
    // start out asking for a readable event once data is transformed.
    this._readableState.needReadable = true;
    // we have implemented the _read method, and done the other things
    // that Readable wants before the first _read call, so unset the
    // sync guard flag.
    this._readableState.sync = false;
    if (options) {
        if (typeof options.transform === 'function') this._transform = options.transform;
        if (typeof options.flush === 'function') this._flush = options.flush;
    }
    // When the writable side finishes, then flush out anything remaining.
    this.on('prefinish', prefinish);
}
function prefinish() {
    var _this = this;
    if (typeof this._flush === 'function') {
        this._flush(function(er, data) {
            done(_this, er, data);
        });
    } else {
        done(this, null, null);
    }
}
Transform.prototype.push = function(chunk, encoding) {
    this._transformState.needTransform = false;
    return Duplex.prototype.push.call(this, chunk, encoding);
};
// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
    throw new Error('_transform() is not implemented');
};
Transform.prototype._write = function(chunk, encoding, cb) {
    var ts = this._transformState;
    ts.writecb = cb;
    ts.writechunk = chunk;
    ts.writeencoding = encoding;
    if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
    }
};
// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
    var ts = this._transformState;
    if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
    } else {
        // mark that we need a transform, so that any data that comes in
        // will get processed, now that we've asked for it.
        ts.needTransform = true;
    }
};
Transform.prototype._destroy = function(err, cb) {
    var _this2 = this;
    Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
        _this2.emit('close');
    });
};
function done(stream, er, data) {
    if (er) return stream.emit('error', er);
    if (data != null) stream.push(data);
    // if there's nothing in the write buffer, then that means
    // that nothing more will ever be provided
    if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');
    if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');
    return stream.push(null);
}
}),
"[project]/node_modules/readable-stream/lib/_stream_passthrough.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.
module.exports = PassThrough;
var Transform = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_transform.js [app-route] (ecmascript)");
/*<replacement>*/ var util = Object.create(__turbopack_context__.r("[project]/node_modules/core-util-is/lib/util.js [app-route] (ecmascript)"));
util.inherits = __turbopack_context__.r("[project]/node_modules/inherits/inherits.js [app-route] (ecmascript)");
/*</replacement>*/ util.inherits(PassThrough, Transform);
function PassThrough(options) {
    if (!(this instanceof PassThrough)) return new PassThrough(options);
    Transform.call(this, options);
}
PassThrough.prototype._transform = function(chunk, encoding, cb) {
    cb(null, chunk);
};
}),
"[project]/node_modules/readable-stream/readable.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
if (process.env.READABLE_STREAM === 'disable' && Stream) {
    module.exports = Stream;
    exports = module.exports = Stream.Readable;
    exports.Readable = Stream.Readable;
    exports.Writable = Stream.Writable;
    exports.Duplex = Stream.Duplex;
    exports.Transform = Stream.Transform;
    exports.PassThrough = Stream.PassThrough;
    exports.Stream = Stream;
} else {
    exports = module.exports = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_readable.js [app-route] (ecmascript)");
    exports.Stream = Stream || exports;
    exports.Readable = exports;
    exports.Writable = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_writable.js [app-route] (ecmascript)");
    exports.Duplex = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_duplex.js [app-route] (ecmascript)");
    exports.Transform = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_transform.js [app-route] (ecmascript)");
    exports.PassThrough = __turbopack_context__.r("[project]/node_modules/readable-stream/lib/_stream_passthrough.js [app-route] (ecmascript)");
}
}),
"[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* eslint-disable node/no-deprecated-api */ var buffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)");
var Buffer = buffer.Buffer;
// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
    for(var key in src){
        dst[key] = src[key];
    }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
    module.exports = buffer;
} else {
    // Copy properties from require('buffer')
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
}
function SafeBuffer(arg, encodingOrOffset, length) {
    return Buffer(arg, encodingOrOffset, length);
}
// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);
SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
        throw new TypeError('Argument must not be a number');
    }
    return Buffer(arg, encodingOrOffset, length);
};
SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    var buf = Buffer(size);
    if (fill !== undefined) {
        if (typeof encoding === 'string') {
            buf.fill(fill, encoding);
        } else {
            buf.fill(fill);
        }
    } else {
        buf.fill(0);
    }
    return buf;
};
SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return Buffer(size);
};
SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number');
    }
    return buffer.SlowBuffer(size);
};
}),
"[project]/node_modules/core-util-is/lib/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(arg) {
    if (Array.isArray) {
        return Array.isArray(arg);
    }
    return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;
function isBoolean(arg) {
    return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;
function isNull(arg) {
    return arg === null;
}
exports.isNull = isNull;
function isNullOrUndefined(arg) {
    return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;
function isNumber(arg) {
    return typeof arg === 'number';
}
exports.isNumber = isNumber;
function isString(arg) {
    return typeof arg === 'string';
}
exports.isString = isString;
function isSymbol(arg) {
    return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;
function isUndefined(arg) {
    return arg === void 0;
}
exports.isUndefined = isUndefined;
function isRegExp(re) {
    return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;
function isDate(d) {
    return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
function isError(e) {
    return objectToString(e) === '[object Error]' || e instanceof Error;
}
exports.isError = isError;
function isFunction(arg) {
    return typeof arg === 'function';
}
exports.isFunction = isFunction;
function isPrimitive(arg) {
    return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
    typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;
exports.isBuffer = __turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)").Buffer.isBuffer;
function objectToString(o) {
    return Object.prototype.toString.call(o);
}
}),
"[project]/node_modules/inherits/inherits_browser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
        }
    };
} else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {};
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
        }
    };
}
}),
"[project]/node_modules/inherits/inherits.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

try {
    var util = __turbopack_context__.r("[externals]/util [external] (util, cjs)");
    /* istanbul ignore next */ if (typeof util.inherits !== 'function') throw '';
    module.exports = util.inherits;
} catch (e) {
    /* istanbul ignore next */ module.exports = __turbopack_context__.r("[project]/node_modules/inherits/inherits_browser.js [app-route] (ecmascript)");
}
}),
"[project]/node_modules/util-deprecate/node.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * For Node.js, simply re-export the core `util.deprecate` function.
 */ module.exports = __turbopack_context__.r("[externals]/util [external] (util, cjs)").deprecate;
}),
"[project]/node_modules/string_decoder/lib/string_decoder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
/*<replacement>*/ var Buffer = __turbopack_context__.r("[project]/node_modules/safe-buffer/index.js [app-route] (ecmascript)").Buffer;
/*</replacement>*/ var isEncoding = Buffer.isEncoding || function(encoding) {
    encoding = '' + encoding;
    switch(encoding && encoding.toLowerCase()){
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
        case 'raw':
            return true;
        default:
            return false;
    }
};
function _normalizeEncoding(enc) {
    if (!enc) return 'utf8';
    var retried;
    while(true){
        switch(enc){
            case 'utf8':
            case 'utf-8':
                return 'utf8';
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return 'utf16le';
            case 'latin1':
            case 'binary':
                return 'latin1';
            case 'base64':
            case 'ascii':
            case 'hex':
                return enc;
            default:
                if (retried) return; // undefined
                enc = ('' + enc).toLowerCase();
                retried = true;
        }
    }
}
;
// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
    return nenc || enc;
}
// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch(this.encoding){
        case 'utf16le':
            this.text = utf16Text;
            this.end = utf16End;
            nb = 4;
            break;
        case 'utf8':
            this.fillLast = utf8FillLast;
            nb = 4;
            break;
        case 'base64':
            this.text = base64Text;
            this.end = base64End;
            nb = 3;
            break;
        default:
            this.write = simpleWrite;
            this.end = simpleEnd;
            return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer.allocUnsafe(nb);
}
StringDecoder.prototype.write = function(buf) {
    if (buf.length === 0) return '';
    var r;
    var i;
    if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === undefined) return '';
        i = this.lastNeed;
        this.lastNeed = 0;
    } else {
        i = 0;
    }
    if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || '';
};
StringDecoder.prototype.end = utf8End;
// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;
// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function(buf) {
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
};
// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
    if (byte <= 0x7F) return 0;
    else if (byte >> 5 === 0x06) return 2;
    else if (byte >> 4 === 0x0E) return 3;
    else if (byte >> 3 === 0x1E) return 4;
    return byte >> 6 === 0x02 ? -1 : -2;
}
// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
    var j = buf.length - 1;
    if (j < i) return 0;
    var nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 1;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 2;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) {
            if (nb === 2) nb = 0;
            else self.lastNeed = nb - 3;
        }
        return nb;
    }
    return 0;
}
// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
    if ((buf[0] & 0xC0) !== 0x80) {
        self.lastNeed = 0;
        return '\ufffd';
    }
    if (self.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 0xC0) !== 0x80) {
            self.lastNeed = 1;
            return '\ufffd';
        }
        if (self.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 0xC0) !== 0x80) {
                self.lastNeed = 2;
                return '\ufffd';
            }
        }
    }
}
// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf, p);
    if (r !== undefined) return r;
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
}
// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed) return buf.toString('utf8', i);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString('utf8', i, end);
}
// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + '\ufffd';
    return r;
}
// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
    if ((buf.length - i) % 2 === 0) {
        var r = buf.toString('utf16le', i);
        if (r) {
            var c = r.charCodeAt(r.length - 1);
            if (c >= 0xD800 && c <= 0xDBFF) {
                this.lastNeed = 2;
                this.lastTotal = 4;
                this.lastChar[0] = buf[buf.length - 2];
                this.lastChar[1] = buf[buf.length - 1];
                return r.slice(0, -1);
            }
        }
        return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString('utf16le', i, buf.length - 1);
}
// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString('utf16le', 0, end);
    }
    return r;
}
function base64Text(buf, i) {
    var n = (buf.length - i) % 3;
    if (n === 0) return buf.toString('base64', i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
    } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString('base64', i, buf.length - n);
}
function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : '';
    if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
    return r;
}
// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
    return buf.toString(this.encoding);
}
function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : '';
}
}),
"[project]/node_modules/immediate/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var Mutation = /*TURBOPACK member replacement*/ __turbopack_context__.g.MutationObserver || /*TURBOPACK member replacement*/ __turbopack_context__.g.WebKitMutationObserver;
var scheduleDrain;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
{
    var called;
    var observer;
    var element;
    var channel;
} else {
    scheduleDrain = function() {
        process.nextTick(nextTick);
    };
}
var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
    draining = true;
    var i, oldQueue;
    var len = queue.length;
    while(len){
        oldQueue = queue;
        queue = [];
        i = -1;
        while(++i < len){
            oldQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
module.exports = immediate;
function immediate(task) {
    if (queue.push(task) === 1 && !draining) {
        scheduleDrain();
    }
}
}),
"[project]/node_modules/lie/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var immediate = __turbopack_context__.r("[project]/node_modules/immediate/lib/index.js [app-route] (ecmascript)");
/* istanbul ignore next */ function INTERNAL() {}
var handlers = {};
var REJECTED = [
    'REJECTED'
];
var FULFILLED = [
    'FULFILLED'
];
var PENDING = [
    'PENDING'
];
/* istanbul ignore else */ if (!("TURBOPACK compile-time value", false)) {
    // in which we actually take advantage of JS scoping
    var UNHANDLED = [
        'UNHANDLED'
    ];
}
module.exports = Promise;
function Promise(resolver) {
    if (typeof resolver !== 'function') {
        throw new TypeError('resolver must be a function');
    }
    this.state = PENDING;
    this.queue = [];
    this.outcome = void 0;
    /* istanbul ignore else */ if ("TURBOPACK compile-time truthy", 1) {
        this.handled = UNHANDLED;
    }
    if (resolver !== INTERNAL) {
        safelyResolveThenable(this, resolver);
    }
}
Promise.prototype.finally = function(callback) {
    if (typeof callback !== 'function') {
        return this;
    }
    var p = this.constructor;
    return this.then(resolve, reject);
    //TURBOPACK unreachable
    ;
    function resolve(value) {
        function yes() {
            return value;
        }
        return p.resolve(callback()).then(yes);
    }
    function reject(reason) {
        function no() {
            throw reason;
        }
        return p.resolve(callback()).then(no);
    }
};
Promise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
};
Promise.prototype.then = function(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function' && this.state === FULFILLED || typeof onRejected !== 'function' && this.state === REJECTED) {
        return this;
    }
    var promise = new this.constructor(INTERNAL);
    /* istanbul ignore else */ if ("TURBOPACK compile-time truthy", 1) {
        if (this.handled === UNHANDLED) {
            this.handled = null;
        }
    }
    if (this.state !== PENDING) {
        var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
        unwrap(promise, resolver, this.outcome);
    } else {
        this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
    }
    return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
    this.promise = promise;
    if (typeof onFulfilled === 'function') {
        this.onFulfilled = onFulfilled;
        this.callFulfilled = this.otherCallFulfilled;
    }
    if (typeof onRejected === 'function') {
        this.onRejected = onRejected;
        this.callRejected = this.otherCallRejected;
    }
}
QueueItem.prototype.callFulfilled = function(value) {
    handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function(value) {
    unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function(value) {
    handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function(value) {
    unwrap(this.promise, this.onRejected, value);
};
function unwrap(promise, func, value) {
    immediate(function() {
        var returnValue;
        try {
            returnValue = func(value);
        } catch (e) {
            return handlers.reject(promise, e);
        }
        if (returnValue === promise) {
            handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
        } else {
            handlers.resolve(promise, returnValue);
        }
    });
}
handlers.resolve = function(self, value) {
    var result = tryCatch(getThen, value);
    if (result.status === 'error') {
        return handlers.reject(self, result.value);
    }
    var thenable = result.value;
    if (thenable) {
        safelyResolveThenable(self, thenable);
    } else {
        self.state = FULFILLED;
        self.outcome = value;
        var i = -1;
        var len = self.queue.length;
        while(++i < len){
            self.queue[i].callFulfilled(value);
        }
    }
    return self;
};
handlers.reject = function(self, error) {
    self.state = REJECTED;
    self.outcome = error;
    /* istanbul ignore else */ if ("TURBOPACK compile-time truthy", 1) {
        if (self.handled === UNHANDLED) {
            immediate(function() {
                if (self.handled === UNHANDLED) {
                    process.emit('unhandledRejection', error, self);
                }
            });
        }
    }
    var i = -1;
    var len = self.queue.length;
    while(++i < len){
        self.queue[i].callRejected(error);
    }
    return self;
};
function getThen(obj) {
    // Make sure we only access the accessor once as required by the spec
    var then = obj && obj.then;
    if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
        return function appyThen() {
            then.apply(obj, arguments);
        };
    }
}
function safelyResolveThenable(self, thenable) {
    // Either fulfill, reject or reject with error
    var called = false;
    function onError(value) {
        if (called) {
            return;
        }
        called = true;
        handlers.reject(self, value);
    }
    function onSuccess(value) {
        if (called) {
            return;
        }
        called = true;
        handlers.resolve(self, value);
    }
    function tryToUnwrap() {
        thenable(onSuccess, onError);
    }
    var result = tryCatch(tryToUnwrap);
    if (result.status === 'error') {
        onError(result.value);
    }
}
function tryCatch(func, value) {
    var out = {};
    try {
        out.value = func(value);
        out.status = 'success';
    } catch (e) {
        out.status = 'error';
        out.value = e;
    }
    return out;
}
Promise.resolve = resolve;
function resolve(value) {
    if (value instanceof this) {
        return value;
    }
    return handlers.resolve(new this(INTERNAL), value);
}
Promise.reject = reject;
function reject(reason) {
    var promise = new this(INTERNAL);
    return handlers.reject(promise, reason);
}
Promise.all = all;
function all(iterable) {
    var self = this;
    if (Object.prototype.toString.call(iterable) !== '[object Array]') {
        return this.reject(new TypeError('must be an array'));
    }
    var len = iterable.length;
    var called = false;
    if (!len) {
        return this.resolve([]);
    }
    var values = new Array(len);
    var resolved = 0;
    var i = -1;
    var promise = new this(INTERNAL);
    while(++i < len){
        allResolver(iterable[i], i);
    }
    return promise;
    //TURBOPACK unreachable
    ;
    function allResolver(value, i) {
        self.resolve(value).then(resolveFromAll, function(error) {
            if (!called) {
                called = true;
                handlers.reject(promise, error);
            }
        });
        function resolveFromAll(outValue) {
            values[i] = outValue;
            if (++resolved === len && !called) {
                called = true;
                handlers.resolve(promise, values);
            }
        }
    }
}
Promise.race = race;
function race(iterable) {
    var self = this;
    if (Object.prototype.toString.call(iterable) !== '[object Array]') {
        return this.reject(new TypeError('must be an array'));
    }
    var len = iterable.length;
    var called = false;
    if (!len) {
        return this.resolve([]);
    }
    var i = -1;
    var promise = new this(INTERNAL);
    while(++i < len){
        resolver(iterable[i]);
    }
    return promise;
    //TURBOPACK unreachable
    ;
    function resolver(value) {
        self.resolve(value).then(function(response) {
            if (!called) {
                called = true;
                handlers.resolve(promise, response);
            }
        }, function(error) {
            if (!called) {
                called = true;
                handlers.reject(promise, error);
            }
        });
    }
}
}),
"[project]/node_modules/xmlbuilder/lib/Utility.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject, slice = [].slice, hasProp = {}.hasOwnProperty;
    assign = function() {
        var i, key, len, source, sources, target;
        target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (isFunction(Object.assign)) {
            Object.assign.apply(null, arguments);
        } else {
            for(i = 0, len = sources.length; i < len; i++){
                source = sources[i];
                if (source != null) {
                    for(key in source){
                        if (!hasProp.call(source, key)) continue;
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
    isFunction = function(val) {
        return !!val && Object.prototype.toString.call(val) === '[object Function]';
    };
    isObject = function(val) {
        var ref;
        return !!val && ((ref = typeof val) === 'function' || ref === 'object');
    };
    isArray = function(val) {
        if (isFunction(Array.isArray)) {
            return Array.isArray(val);
        } else {
            return Object.prototype.toString.call(val) === '[object Array]';
        }
    };
    isEmpty = function(val) {
        var key;
        if (isArray(val)) {
            return !val.length;
        } else {
            for(key in val){
                if (!hasProp.call(val, key)) continue;
                return false;
            }
            return true;
        }
    };
    isPlainObject = function(val) {
        var ctor, proto;
        return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === 'function' && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
    };
    getValue = function(obj) {
        if (isFunction(obj.valueOf)) {
            return obj.valueOf();
        } else {
            return obj;
        }
    };
    module.exports.assign = assign;
    module.exports.isFunction = isFunction;
    module.exports.isObject = isObject;
    module.exports.isArray = isArray;
    module.exports.isEmpty = isEmpty;
    module.exports.isPlainObject = isPlainObject;
    module.exports.getValue = getValue;
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLAttribute.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLAttribute;
    module.exports = XMLAttribute = function() {
        function XMLAttribute(parent, name, value) {
            this.options = parent.options;
            this.stringify = parent.stringify;
            this.parent = parent;
            if (name == null) {
                throw new Error("Missing attribute name. " + this.debugInfo(name));
            }
            if (value == null) {
                throw new Error("Missing attribute value. " + this.debugInfo(name));
            }
            this.name = this.stringify.attName(name);
            this.value = this.stringify.attValue(value);
        }
        XMLAttribute.prototype.clone = function() {
            return Object.create(this);
        };
        XMLAttribute.prototype.toString = function(options) {
            return this.options.writer.set(options).attribute(this);
        };
        XMLAttribute.prototype.debugInfo = function(name) {
            name = name || this.name;
            if (name == null) {
                return "parent: <" + this.parent.name + ">";
            } else {
                return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
            }
        };
        return XMLAttribute;
    }();
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLElement.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLAttribute, XMLElement, XMLNode, getValue, isFunction, isObject, ref, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    ref = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/Utility.js [app-route] (ecmascript)"), isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    XMLAttribute = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLAttribute.js [app-route] (ecmascript)");
    module.exports = XMLElement = function(superClass) {
        extend(XMLElement, superClass);
        function XMLElement(parent, name, attributes) {
            XMLElement.__super__.constructor.call(this, parent);
            if (name == null) {
                throw new Error("Missing element name. " + this.debugInfo());
            }
            this.name = this.stringify.eleName(name);
            this.attributes = {};
            if (attributes != null) {
                this.attribute(attributes);
            }
            if (parent.isDocument) {
                this.isRoot = true;
                this.documentObject = parent;
                parent.rootObject = this;
            }
        }
        XMLElement.prototype.clone = function() {
            var att, attName, clonedSelf, ref1;
            clonedSelf = Object.create(this);
            if (clonedSelf.isRoot) {
                clonedSelf.documentObject = null;
            }
            clonedSelf.attributes = {};
            ref1 = this.attributes;
            for(attName in ref1){
                if (!hasProp.call(ref1, attName)) continue;
                att = ref1[attName];
                clonedSelf.attributes[attName] = att.clone();
            }
            clonedSelf.children = [];
            this.children.forEach(function(child) {
                var clonedChild;
                clonedChild = child.clone();
                clonedChild.parent = clonedSelf;
                return clonedSelf.children.push(clonedChild);
            });
            return clonedSelf;
        };
        XMLElement.prototype.attribute = function(name, value) {
            var attName, attValue;
            if (name != null) {
                name = getValue(name);
            }
            if (isObject(name)) {
                for(attName in name){
                    if (!hasProp.call(name, attName)) continue;
                    attValue = name[attName];
                    this.attribute(attName, attValue);
                }
            } else {
                if (isFunction(value)) {
                    value = value.apply();
                }
                if (!this.options.skipNullAttributes || value != null) {
                    this.attributes[name] = new XMLAttribute(this, name, value);
                }
            }
            return this;
        };
        XMLElement.prototype.removeAttribute = function(name) {
            var attName, i, len;
            if (name == null) {
                throw new Error("Missing attribute name. " + this.debugInfo());
            }
            name = getValue(name);
            if (Array.isArray(name)) {
                for(i = 0, len = name.length; i < len; i++){
                    attName = name[i];
                    delete this.attributes[attName];
                }
            } else {
                delete this.attributes[name];
            }
            return this;
        };
        XMLElement.prototype.toString = function(options) {
            return this.options.writer.set(options).element(this);
        };
        XMLElement.prototype.att = function(name, value) {
            return this.attribute(name, value);
        };
        XMLElement.prototype.a = function(name, value) {
            return this.attribute(name, value);
        };
        return XMLElement;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLCData.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLCData, XMLNode, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLCData = function(superClass) {
        extend(XMLCData, superClass);
        function XMLCData(parent, text) {
            XMLCData.__super__.constructor.call(this, parent);
            if (text == null) {
                throw new Error("Missing CDATA text. " + this.debugInfo());
            }
            this.text = this.stringify.cdata(text);
        }
        XMLCData.prototype.clone = function() {
            return Object.create(this);
        };
        XMLCData.prototype.toString = function(options) {
            return this.options.writer.set(options).cdata(this);
        };
        return XMLCData;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLComment.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLComment, XMLNode, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLComment = function(superClass) {
        extend(XMLComment, superClass);
        function XMLComment(parent, text) {
            XMLComment.__super__.constructor.call(this, parent);
            if (text == null) {
                throw new Error("Missing comment text. " + this.debugInfo());
            }
            this.text = this.stringify.comment(text);
        }
        XMLComment.prototype.clone = function() {
            return Object.create(this);
        };
        XMLComment.prototype.toString = function(options) {
            return this.options.writer.set(options).comment(this);
        };
        return XMLComment;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLDeclaration.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLDeclaration, XMLNode, isObject, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    isObject = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/Utility.js [app-route] (ecmascript)").isObject;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLDeclaration = function(superClass) {
        extend(XMLDeclaration, superClass);
        function XMLDeclaration(parent, version, encoding, standalone) {
            var ref;
            XMLDeclaration.__super__.constructor.call(this, parent);
            if (isObject(version)) {
                ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
            }
            if (!version) {
                version = '1.0';
            }
            this.version = this.stringify.xmlVersion(version);
            if (encoding != null) {
                this.encoding = this.stringify.xmlEncoding(encoding);
            }
            if (standalone != null) {
                this.standalone = this.stringify.xmlStandalone(standalone);
            }
        }
        XMLDeclaration.prototype.toString = function(options) {
            return this.options.writer.set(options).declaration(this);
        };
        return XMLDeclaration;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLDTDAttList.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLDTDAttList, XMLNode, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLDTDAttList = function(superClass) {
        extend(XMLDTDAttList, superClass);
        function XMLDTDAttList(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
            XMLDTDAttList.__super__.constructor.call(this, parent);
            if (elementName == null) {
                throw new Error("Missing DTD element name. " + this.debugInfo());
            }
            if (attributeName == null) {
                throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
            }
            if (!attributeType) {
                throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
            }
            if (!defaultValueType) {
                throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
            }
            if (defaultValueType.indexOf('#') !== 0) {
                defaultValueType = '#' + defaultValueType;
            }
            if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
                throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
            }
            if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
                throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
            }
            this.elementName = this.stringify.eleName(elementName);
            this.attributeName = this.stringify.attName(attributeName);
            this.attributeType = this.stringify.dtdAttType(attributeType);
            this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
            this.defaultValueType = defaultValueType;
        }
        XMLDTDAttList.prototype.toString = function(options) {
            return this.options.writer.set(options).dtdAttList(this);
        };
        return XMLDTDAttList;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLDTDEntity.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLDTDEntity, XMLNode, isObject, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    isObject = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/Utility.js [app-route] (ecmascript)").isObject;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLDTDEntity = function(superClass) {
        extend(XMLDTDEntity, superClass);
        function XMLDTDEntity(parent, pe, name, value) {
            XMLDTDEntity.__super__.constructor.call(this, parent);
            if (name == null) {
                throw new Error("Missing DTD entity name. " + this.debugInfo(name));
            }
            if (value == null) {
                throw new Error("Missing DTD entity value. " + this.debugInfo(name));
            }
            this.pe = !!pe;
            this.name = this.stringify.eleName(name);
            if (!isObject(value)) {
                this.value = this.stringify.dtdEntityValue(value);
            } else {
                if (!value.pubID && !value.sysID) {
                    throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
                }
                if (value.pubID && !value.sysID) {
                    throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
                }
                if (value.pubID != null) {
                    this.pubID = this.stringify.dtdPubID(value.pubID);
                }
                if (value.sysID != null) {
                    this.sysID = this.stringify.dtdSysID(value.sysID);
                }
                if (value.nData != null) {
                    this.nData = this.stringify.dtdNData(value.nData);
                }
                if (this.pe && this.nData) {
                    throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
                }
            }
        }
        XMLDTDEntity.prototype.toString = function(options) {
            return this.options.writer.set(options).dtdEntity(this);
        };
        return XMLDTDEntity;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLDTDElement.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLDTDElement, XMLNode, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLDTDElement = function(superClass) {
        extend(XMLDTDElement, superClass);
        function XMLDTDElement(parent, name, value) {
            XMLDTDElement.__super__.constructor.call(this, parent);
            if (name == null) {
                throw new Error("Missing DTD element name. " + this.debugInfo());
            }
            if (!value) {
                value = '(#PCDATA)';
            }
            if (Array.isArray(value)) {
                value = '(' + value.join(',') + ')';
            }
            this.name = this.stringify.eleName(name);
            this.value = this.stringify.dtdElementValue(value);
        }
        XMLDTDElement.prototype.toString = function(options) {
            return this.options.writer.set(options).dtdElement(this);
        };
        return XMLDTDElement;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLDTDNotation.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLDTDNotation, XMLNode, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLDTDNotation = function(superClass) {
        extend(XMLDTDNotation, superClass);
        function XMLDTDNotation(parent, name, value) {
            XMLDTDNotation.__super__.constructor.call(this, parent);
            if (name == null) {
                throw new Error("Missing DTD notation name. " + this.debugInfo(name));
            }
            if (!value.pubID && !value.sysID) {
                throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
            }
            this.name = this.stringify.eleName(name);
            if (value.pubID != null) {
                this.pubID = this.stringify.dtdPubID(value.pubID);
            }
            if (value.sysID != null) {
                this.sysID = this.stringify.dtdSysID(value.sysID);
            }
        }
        XMLDTDNotation.prototype.toString = function(options) {
            return this.options.writer.set(options).dtdNotation(this);
        };
        return XMLDTDNotation;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLDocType.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNode, isObject, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    isObject = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/Utility.js [app-route] (ecmascript)").isObject;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    XMLDTDAttList = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDAttList.js [app-route] (ecmascript)");
    XMLDTDEntity = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDEntity.js [app-route] (ecmascript)");
    XMLDTDElement = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDElement.js [app-route] (ecmascript)");
    XMLDTDNotation = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDNotation.js [app-route] (ecmascript)");
    module.exports = XMLDocType = function(superClass) {
        extend(XMLDocType, superClass);
        function XMLDocType(parent, pubID, sysID) {
            var ref, ref1;
            XMLDocType.__super__.constructor.call(this, parent);
            this.name = "!DOCTYPE";
            this.documentObject = parent;
            if (isObject(pubID)) {
                ref = pubID, pubID = ref.pubID, sysID = ref.sysID;
            }
            if (sysID == null) {
                ref1 = [
                    pubID,
                    sysID
                ], sysID = ref1[0], pubID = ref1[1];
            }
            if (pubID != null) {
                this.pubID = this.stringify.dtdPubID(pubID);
            }
            if (sysID != null) {
                this.sysID = this.stringify.dtdSysID(sysID);
            }
        }
        XMLDocType.prototype.element = function(name, value) {
            var child;
            child = new XMLDTDElement(this, name, value);
            this.children.push(child);
            return this;
        };
        XMLDocType.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
            var child;
            child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
            this.children.push(child);
            return this;
        };
        XMLDocType.prototype.entity = function(name, value) {
            var child;
            child = new XMLDTDEntity(this, false, name, value);
            this.children.push(child);
            return this;
        };
        XMLDocType.prototype.pEntity = function(name, value) {
            var child;
            child = new XMLDTDEntity(this, true, name, value);
            this.children.push(child);
            return this;
        };
        XMLDocType.prototype.notation = function(name, value) {
            var child;
            child = new XMLDTDNotation(this, name, value);
            this.children.push(child);
            return this;
        };
        XMLDocType.prototype.toString = function(options) {
            return this.options.writer.set(options).docType(this);
        };
        XMLDocType.prototype.ele = function(name, value) {
            return this.element(name, value);
        };
        XMLDocType.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
            return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
        };
        XMLDocType.prototype.ent = function(name, value) {
            return this.entity(name, value);
        };
        XMLDocType.prototype.pent = function(name, value) {
            return this.pEntity(name, value);
        };
        XMLDocType.prototype.not = function(name, value) {
            return this.notation(name, value);
        };
        XMLDocType.prototype.up = function() {
            return this.root() || this.documentObject;
        };
        return XMLDocType;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLRaw.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLNode, XMLRaw, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLRaw = function(superClass) {
        extend(XMLRaw, superClass);
        function XMLRaw(parent, text) {
            XMLRaw.__super__.constructor.call(this, parent);
            if (text == null) {
                throw new Error("Missing raw text. " + this.debugInfo());
            }
            this.value = this.stringify.raw(text);
        }
        XMLRaw.prototype.clone = function() {
            return Object.create(this);
        };
        XMLRaw.prototype.toString = function(options) {
            return this.options.writer.set(options).raw(this);
        };
        return XMLRaw;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLText.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLNode, XMLText, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLText = function(superClass) {
        extend(XMLText, superClass);
        function XMLText(parent, text) {
            XMLText.__super__.constructor.call(this, parent);
            if (text == null) {
                throw new Error("Missing element text. " + this.debugInfo());
            }
            this.value = this.stringify.eleText(text);
        }
        XMLText.prototype.clone = function() {
            return Object.create(this);
        };
        XMLText.prototype.toString = function(options) {
            return this.options.writer.set(options).text(this);
        };
        return XMLText;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLProcessingInstruction.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLNode, XMLProcessingInstruction, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLProcessingInstruction = function(superClass) {
        extend(XMLProcessingInstruction, superClass);
        function XMLProcessingInstruction(parent, target, value) {
            XMLProcessingInstruction.__super__.constructor.call(this, parent);
            if (target == null) {
                throw new Error("Missing instruction target. " + this.debugInfo());
            }
            this.target = this.stringify.insTarget(target);
            if (value) {
                this.value = this.stringify.insValue(value);
            }
        }
        XMLProcessingInstruction.prototype.clone = function() {
            return Object.create(this);
        };
        XMLProcessingInstruction.prototype.toString = function(options) {
            return this.options.writer.set(options).processingInstruction(this);
        };
        return XMLProcessingInstruction;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLDummy.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLDummy, XMLNode, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    module.exports = XMLDummy = function(superClass) {
        extend(XMLDummy, superClass);
        function XMLDummy(parent) {
            XMLDummy.__super__.constructor.call(this, parent);
            this.isDummy = true;
        }
        XMLDummy.prototype.clone = function() {
            return Object.create(this);
        };
        XMLDummy.prototype.toString = function(options) {
            return '';
        };
        return XMLDummy;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLNode, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, ref, hasProp = {}.hasOwnProperty;
    ref = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/Utility.js [app-route] (ecmascript)"), isObject = ref.isObject, isFunction = ref.isFunction, isEmpty = ref.isEmpty, getValue = ref.getValue;
    XMLElement = null;
    XMLCData = null;
    XMLComment = null;
    XMLDeclaration = null;
    XMLDocType = null;
    XMLRaw = null;
    XMLText = null;
    XMLProcessingInstruction = null;
    XMLDummy = null;
    module.exports = XMLNode = function() {
        function XMLNode(parent) {
            this.parent = parent;
            if (this.parent) {
                this.options = this.parent.options;
                this.stringify = this.parent.stringify;
            }
            this.children = [];
            if (!XMLElement) {
                XMLElement = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLElement.js [app-route] (ecmascript)");
                XMLCData = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLCData.js [app-route] (ecmascript)");
                XMLComment = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLComment.js [app-route] (ecmascript)");
                XMLDeclaration = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDeclaration.js [app-route] (ecmascript)");
                XMLDocType = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDocType.js [app-route] (ecmascript)");
                XMLRaw = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLRaw.js [app-route] (ecmascript)");
                XMLText = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLText.js [app-route] (ecmascript)");
                XMLProcessingInstruction = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLProcessingInstruction.js [app-route] (ecmascript)");
                XMLDummy = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDummy.js [app-route] (ecmascript)");
            }
        }
        XMLNode.prototype.element = function(name, attributes, text) {
            var childNode, item, j, k, key, lastChild, len, len1, ref1, ref2, val;
            lastChild = null;
            if (attributes === null && text == null) {
                ref1 = [
                    {},
                    null
                ], attributes = ref1[0], text = ref1[1];
            }
            if (attributes == null) {
                attributes = {};
            }
            attributes = getValue(attributes);
            if (!isObject(attributes)) {
                ref2 = [
                    attributes,
                    text
                ], text = ref2[0], attributes = ref2[1];
            }
            if (name != null) {
                name = getValue(name);
            }
            if (Array.isArray(name)) {
                for(j = 0, len = name.length; j < len; j++){
                    item = name[j];
                    lastChild = this.element(item);
                }
            } else if (isFunction(name)) {
                lastChild = this.element(name.apply());
            } else if (isObject(name)) {
                for(key in name){
                    if (!hasProp.call(name, key)) continue;
                    val = name[key];
                    if (isFunction(val)) {
                        val = val.apply();
                    }
                    if (isObject(val) && isEmpty(val)) {
                        val = null;
                    }
                    if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
                        lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
                    } else if (!this.options.separateArrayItems && Array.isArray(val)) {
                        for(k = 0, len1 = val.length; k < len1; k++){
                            item = val[k];
                            childNode = {};
                            childNode[key] = item;
                            lastChild = this.element(childNode);
                        }
                    } else if (isObject(val)) {
                        lastChild = this.element(key);
                        lastChild.element(val);
                    } else {
                        lastChild = this.element(key, val);
                    }
                }
            } else if (this.options.skipNullNodes && text === null) {
                lastChild = this.dummy();
            } else {
                if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
                    lastChild = this.text(text);
                } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
                    lastChild = this.cdata(text);
                } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
                    lastChild = this.comment(text);
                } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
                    lastChild = this.raw(text);
                } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
                    lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
                } else {
                    lastChild = this.node(name, attributes, text);
                }
            }
            if (lastChild == null) {
                throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
            }
            return lastChild;
        };
        XMLNode.prototype.insertBefore = function(name, attributes, text) {
            var child, i, removed;
            if (this.isRoot) {
                throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
            }
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.element(name, attributes, text);
            Array.prototype.push.apply(this.parent.children, removed);
            return child;
        };
        XMLNode.prototype.insertAfter = function(name, attributes, text) {
            var child, i, removed;
            if (this.isRoot) {
                throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
            }
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i + 1);
            child = this.parent.element(name, attributes, text);
            Array.prototype.push.apply(this.parent.children, removed);
            return child;
        };
        XMLNode.prototype.remove = function() {
            var i, ref1;
            if (this.isRoot) {
                throw new Error("Cannot remove the root element. " + this.debugInfo());
            }
            i = this.parent.children.indexOf(this);
            [].splice.apply(this.parent.children, [
                i,
                i - i + 1
            ].concat(ref1 = [])), ref1;
            return this.parent;
        };
        XMLNode.prototype.node = function(name, attributes, text) {
            var child, ref1;
            if (name != null) {
                name = getValue(name);
            }
            attributes || (attributes = {});
            attributes = getValue(attributes);
            if (!isObject(attributes)) {
                ref1 = [
                    attributes,
                    text
                ], text = ref1[0], attributes = ref1[1];
            }
            child = new XMLElement(this, name, attributes);
            if (text != null) {
                child.text(text);
            }
            this.children.push(child);
            return child;
        };
        XMLNode.prototype.text = function(value) {
            var child;
            child = new XMLText(this, value);
            this.children.push(child);
            return this;
        };
        XMLNode.prototype.cdata = function(value) {
            var child;
            child = new XMLCData(this, value);
            this.children.push(child);
            return this;
        };
        XMLNode.prototype.comment = function(value) {
            var child;
            child = new XMLComment(this, value);
            this.children.push(child);
            return this;
        };
        XMLNode.prototype.commentBefore = function(value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.comment(value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
        };
        XMLNode.prototype.commentAfter = function(value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i + 1);
            child = this.parent.comment(value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
        };
        XMLNode.prototype.raw = function(value) {
            var child;
            child = new XMLRaw(this, value);
            this.children.push(child);
            return this;
        };
        XMLNode.prototype.dummy = function() {
            var child;
            child = new XMLDummy(this);
            this.children.push(child);
            return child;
        };
        XMLNode.prototype.instruction = function(target, value) {
            var insTarget, insValue, instruction, j, len;
            if (target != null) {
                target = getValue(target);
            }
            if (value != null) {
                value = getValue(value);
            }
            if (Array.isArray(target)) {
                for(j = 0, len = target.length; j < len; j++){
                    insTarget = target[j];
                    this.instruction(insTarget);
                }
            } else if (isObject(target)) {
                for(insTarget in target){
                    if (!hasProp.call(target, insTarget)) continue;
                    insValue = target[insTarget];
                    this.instruction(insTarget, insValue);
                }
            } else {
                if (isFunction(value)) {
                    value = value.apply();
                }
                instruction = new XMLProcessingInstruction(this, target, value);
                this.children.push(instruction);
            }
            return this;
        };
        XMLNode.prototype.instructionBefore = function(target, value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.instruction(target, value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
        };
        XMLNode.prototype.instructionAfter = function(target, value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i + 1);
            child = this.parent.instruction(target, value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
        };
        XMLNode.prototype.declaration = function(version, encoding, standalone) {
            var doc, xmldec;
            doc = this.document();
            xmldec = new XMLDeclaration(doc, version, encoding, standalone);
            if (doc.children[0] instanceof XMLDeclaration) {
                doc.children[0] = xmldec;
            } else {
                doc.children.unshift(xmldec);
            }
            return doc.root() || doc;
        };
        XMLNode.prototype.doctype = function(pubID, sysID) {
            var child, doc, doctype, i, j, k, len, len1, ref1, ref2;
            doc = this.document();
            doctype = new XMLDocType(doc, pubID, sysID);
            ref1 = doc.children;
            for(i = j = 0, len = ref1.length; j < len; i = ++j){
                child = ref1[i];
                if (child instanceof XMLDocType) {
                    doc.children[i] = doctype;
                    return doctype;
                }
            }
            ref2 = doc.children;
            for(i = k = 0, len1 = ref2.length; k < len1; i = ++k){
                child = ref2[i];
                if (child.isRoot) {
                    doc.children.splice(i, 0, doctype);
                    return doctype;
                }
            }
            doc.children.push(doctype);
            return doctype;
        };
        XMLNode.prototype.up = function() {
            if (this.isRoot) {
                throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
            }
            return this.parent;
        };
        XMLNode.prototype.root = function() {
            var node;
            node = this;
            while(node){
                if (node.isDocument) {
                    return node.rootObject;
                } else if (node.isRoot) {
                    return node;
                } else {
                    node = node.parent;
                }
            }
        };
        XMLNode.prototype.document = function() {
            var node;
            node = this;
            while(node){
                if (node.isDocument) {
                    return node;
                } else {
                    node = node.parent;
                }
            }
        };
        XMLNode.prototype.end = function(options) {
            return this.document().end(options);
        };
        XMLNode.prototype.prev = function() {
            var i;
            i = this.parent.children.indexOf(this);
            while(i > 0 && this.parent.children[i - 1].isDummy){
                i = i - 1;
            }
            if (i < 1) {
                throw new Error("Already at the first node. " + this.debugInfo());
            }
            return this.parent.children[i - 1];
        };
        XMLNode.prototype.next = function() {
            var i;
            i = this.parent.children.indexOf(this);
            while(i < this.parent.children.length - 1 && this.parent.children[i + 1].isDummy){
                i = i + 1;
            }
            if (i === -1 || i === this.parent.children.length - 1) {
                throw new Error("Already at the last node. " + this.debugInfo());
            }
            return this.parent.children[i + 1];
        };
        XMLNode.prototype.importDocument = function(doc) {
            var clonedRoot;
            clonedRoot = doc.root().clone();
            clonedRoot.parent = this;
            clonedRoot.isRoot = false;
            this.children.push(clonedRoot);
            return this;
        };
        XMLNode.prototype.debugInfo = function(name) {
            var ref1, ref2;
            name = name || this.name;
            if (name == null && !((ref1 = this.parent) != null ? ref1.name : void 0)) {
                return "";
            } else if (name == null) {
                return "parent: <" + this.parent.name + ">";
            } else if (!((ref2 = this.parent) != null ? ref2.name : void 0)) {
                return "node: <" + name + ">";
            } else {
                return "node: <" + name + ">, parent: <" + this.parent.name + ">";
            }
        };
        XMLNode.prototype.ele = function(name, attributes, text) {
            return this.element(name, attributes, text);
        };
        XMLNode.prototype.nod = function(name, attributes, text) {
            return this.node(name, attributes, text);
        };
        XMLNode.prototype.txt = function(value) {
            return this.text(value);
        };
        XMLNode.prototype.dat = function(value) {
            return this.cdata(value);
        };
        XMLNode.prototype.com = function(value) {
            return this.comment(value);
        };
        XMLNode.prototype.ins = function(target, value) {
            return this.instruction(target, value);
        };
        XMLNode.prototype.doc = function() {
            return this.document();
        };
        XMLNode.prototype.dec = function(version, encoding, standalone) {
            return this.declaration(version, encoding, standalone);
        };
        XMLNode.prototype.dtd = function(pubID, sysID) {
            return this.doctype(pubID, sysID);
        };
        XMLNode.prototype.e = function(name, attributes, text) {
            return this.element(name, attributes, text);
        };
        XMLNode.prototype.n = function(name, attributes, text) {
            return this.node(name, attributes, text);
        };
        XMLNode.prototype.t = function(value) {
            return this.text(value);
        };
        XMLNode.prototype.d = function(value) {
            return this.cdata(value);
        };
        XMLNode.prototype.c = function(value) {
            return this.comment(value);
        };
        XMLNode.prototype.r = function(value) {
            return this.raw(value);
        };
        XMLNode.prototype.i = function(target, value) {
            return this.instruction(target, value);
        };
        XMLNode.prototype.u = function() {
            return this.up();
        };
        XMLNode.prototype.importXMLBuilder = function(doc) {
            return this.importDocument(doc);
        };
        return XMLNode;
    }();
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLStringifier.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLStringifier, bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    }, hasProp = {}.hasOwnProperty;
    module.exports = XMLStringifier = function() {
        function XMLStringifier(options) {
            this.assertLegalChar = bind(this.assertLegalChar, this);
            var key, ref, value;
            options || (options = {});
            this.noDoubleEncoding = options.noDoubleEncoding;
            ref = options.stringify || {};
            for(key in ref){
                if (!hasProp.call(ref, key)) continue;
                value = ref[key];
                this[key] = value;
            }
        }
        XMLStringifier.prototype.eleName = function(val) {
            val = '' + val || '';
            return this.assertLegalChar(val);
        };
        XMLStringifier.prototype.eleText = function(val) {
            val = '' + val || '';
            return this.assertLegalChar(this.elEscape(val));
        };
        XMLStringifier.prototype.cdata = function(val) {
            val = '' + val || '';
            val = val.replace(']]>', ']]]]><![CDATA[>');
            return this.assertLegalChar(val);
        };
        XMLStringifier.prototype.comment = function(val) {
            val = '' + val || '';
            if (val.match(/--/)) {
                throw new Error("Comment text cannot contain double-hypen: " + val);
            }
            return this.assertLegalChar(val);
        };
        XMLStringifier.prototype.raw = function(val) {
            return '' + val || '';
        };
        XMLStringifier.prototype.attName = function(val) {
            return val = '' + val || '';
        };
        XMLStringifier.prototype.attValue = function(val) {
            val = '' + val || '';
            return this.attEscape(val);
        };
        XMLStringifier.prototype.insTarget = function(val) {
            return '' + val || '';
        };
        XMLStringifier.prototype.insValue = function(val) {
            val = '' + val || '';
            if (val.match(/\?>/)) {
                throw new Error("Invalid processing instruction value: " + val);
            }
            return val;
        };
        XMLStringifier.prototype.xmlVersion = function(val) {
            val = '' + val || '';
            if (!val.match(/1\.[0-9]+/)) {
                throw new Error("Invalid version number: " + val);
            }
            return val;
        };
        XMLStringifier.prototype.xmlEncoding = function(val) {
            val = '' + val || '';
            if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
                throw new Error("Invalid encoding: " + val);
            }
            return val;
        };
        XMLStringifier.prototype.xmlStandalone = function(val) {
            if (val) {
                return "yes";
            } else {
                return "no";
            }
        };
        XMLStringifier.prototype.dtdPubID = function(val) {
            return '' + val || '';
        };
        XMLStringifier.prototype.dtdSysID = function(val) {
            return '' + val || '';
        };
        XMLStringifier.prototype.dtdElementValue = function(val) {
            return '' + val || '';
        };
        XMLStringifier.prototype.dtdAttType = function(val) {
            return '' + val || '';
        };
        XMLStringifier.prototype.dtdAttDefault = function(val) {
            if (val != null) {
                return '' + val || '';
            } else {
                return val;
            }
        };
        XMLStringifier.prototype.dtdEntityValue = function(val) {
            return '' + val || '';
        };
        XMLStringifier.prototype.dtdNData = function(val) {
            return '' + val || '';
        };
        XMLStringifier.prototype.convertAttKey = '@';
        XMLStringifier.prototype.convertPIKey = '?';
        XMLStringifier.prototype.convertTextKey = '#text';
        XMLStringifier.prototype.convertCDataKey = '#cdata';
        XMLStringifier.prototype.convertCommentKey = '#comment';
        XMLStringifier.prototype.convertRawKey = '#raw';
        XMLStringifier.prototype.assertLegalChar = function(str) {
            var res;
            res = str.match(/[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/);
            if (res) {
                throw new Error("Invalid character in string: " + str + " at index " + res.index);
            }
            return str;
        };
        XMLStringifier.prototype.elEscape = function(str) {
            var ampregex;
            ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
            return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
        };
        XMLStringifier.prototype.attEscape = function(str) {
            var ampregex;
            ampregex = this.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
            return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
        };
        return XMLStringifier;
    }();
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLWriterBase.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLWriterBase, hasProp = {}.hasOwnProperty;
    module.exports = XMLWriterBase = function() {
        function XMLWriterBase(options) {
            var key, ref, ref1, ref2, ref3, ref4, ref5, ref6, value;
            options || (options = {});
            this.pretty = options.pretty || false;
            this.allowEmpty = (ref = options.allowEmpty) != null ? ref : false;
            if (this.pretty) {
                this.indent = (ref1 = options.indent) != null ? ref1 : '  ';
                this.newline = (ref2 = options.newline) != null ? ref2 : '\n';
                this.offset = (ref3 = options.offset) != null ? ref3 : 0;
                this.dontprettytextnodes = (ref4 = options.dontprettytextnodes) != null ? ref4 : 0;
            } else {
                this.indent = '';
                this.newline = '';
                this.offset = 0;
                this.dontprettytextnodes = 0;
            }
            this.spacebeforeslash = (ref5 = options.spacebeforeslash) != null ? ref5 : '';
            if (this.spacebeforeslash === true) {
                this.spacebeforeslash = ' ';
            }
            this.newlinedefault = this.newline;
            this.prettydefault = this.pretty;
            ref6 = options.writer || {};
            for(key in ref6){
                if (!hasProp.call(ref6, key)) continue;
                value = ref6[key];
                this[key] = value;
            }
        }
        XMLWriterBase.prototype.set = function(options) {
            var key, ref, value;
            options || (options = {});
            if ("pretty" in options) {
                this.pretty = options.pretty;
            }
            if ("allowEmpty" in options) {
                this.allowEmpty = options.allowEmpty;
            }
            if (this.pretty) {
                this.indent = "indent" in options ? options.indent : '  ';
                this.newline = "newline" in options ? options.newline : '\n';
                this.offset = "offset" in options ? options.offset : 0;
                this.dontprettytextnodes = "dontprettytextnodes" in options ? options.dontprettytextnodes : 0;
            } else {
                this.indent = '';
                this.newline = '';
                this.offset = 0;
                this.dontprettytextnodes = 0;
            }
            this.spacebeforeslash = "spacebeforeslash" in options ? options.spacebeforeslash : '';
            if (this.spacebeforeslash === true) {
                this.spacebeforeslash = ' ';
            }
            this.newlinedefault = this.newline;
            this.prettydefault = this.pretty;
            ref = options.writer || {};
            for(key in ref){
                if (!hasProp.call(ref, key)) continue;
                value = ref[key];
                this[key] = value;
            }
            return this;
        };
        XMLWriterBase.prototype.space = function(level) {
            var indent;
            if (this.pretty) {
                indent = (level || 0) + this.offset + 1;
                if (indent > 0) {
                    return new Array(indent).join(this.indent);
                } else {
                    return '';
                }
            } else {
                return '';
            }
        };
        return XMLWriterBase;
    }();
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLStringWriter.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLText, XMLWriterBase, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLDeclaration = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDeclaration.js [app-route] (ecmascript)");
    XMLDocType = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDocType.js [app-route] (ecmascript)");
    XMLCData = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLCData.js [app-route] (ecmascript)");
    XMLComment = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLComment.js [app-route] (ecmascript)");
    XMLElement = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLElement.js [app-route] (ecmascript)");
    XMLRaw = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLRaw.js [app-route] (ecmascript)");
    XMLText = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLText.js [app-route] (ecmascript)");
    XMLProcessingInstruction = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLProcessingInstruction.js [app-route] (ecmascript)");
    XMLDummy = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDummy.js [app-route] (ecmascript)");
    XMLDTDAttList = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDAttList.js [app-route] (ecmascript)");
    XMLDTDElement = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDElement.js [app-route] (ecmascript)");
    XMLDTDEntity = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDEntity.js [app-route] (ecmascript)");
    XMLDTDNotation = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDNotation.js [app-route] (ecmascript)");
    XMLWriterBase = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLWriterBase.js [app-route] (ecmascript)");
    module.exports = XMLStringWriter = function(superClass) {
        extend(XMLStringWriter, superClass);
        function XMLStringWriter(options) {
            XMLStringWriter.__super__.constructor.call(this, options);
        }
        XMLStringWriter.prototype.document = function(doc) {
            var child, i, len, r, ref;
            this.textispresent = false;
            r = '';
            ref = doc.children;
            for(i = 0, len = ref.length; i < len; i++){
                child = ref[i];
                if (child instanceof XMLDummy) {
                    continue;
                }
                r += (function() {
                    switch(false){
                        case !(child instanceof XMLDeclaration):
                            return this.declaration(child);
                        case !(child instanceof XMLDocType):
                            return this.docType(child);
                        case !(child instanceof XMLComment):
                            return this.comment(child);
                        case !(child instanceof XMLProcessingInstruction):
                            return this.processingInstruction(child);
                        default:
                            return this.element(child, 0);
                    }
                }).call(this);
            }
            if (this.pretty && r.slice(-this.newline.length) === this.newline) {
                r = r.slice(0, -this.newline.length);
            }
            return r;
        };
        XMLStringWriter.prototype.attribute = function(att) {
            return ' ' + att.name + '="' + att.value + '"';
        };
        XMLStringWriter.prototype.cdata = function(node, level) {
            return this.space(level) + '<![CDATA[' + node.text + ']]>' + this.newline;
        };
        XMLStringWriter.prototype.comment = function(node, level) {
            return this.space(level) + '<!-- ' + node.text + ' -->' + this.newline;
        };
        XMLStringWriter.prototype.declaration = function(node, level) {
            var r;
            r = this.space(level);
            r += '<?xml version="' + node.version + '"';
            if (node.encoding != null) {
                r += ' encoding="' + node.encoding + '"';
            }
            if (node.standalone != null) {
                r += ' standalone="' + node.standalone + '"';
            }
            r += this.spacebeforeslash + '?>';
            r += this.newline;
            return r;
        };
        XMLStringWriter.prototype.docType = function(node, level) {
            var child, i, len, r, ref;
            level || (level = 0);
            r = this.space(level);
            r += '<!DOCTYPE ' + node.root().name;
            if (node.pubID && node.sysID) {
                r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.sysID) {
                r += ' SYSTEM "' + node.sysID + '"';
            }
            if (node.children.length > 0) {
                r += ' [';
                r += this.newline;
                ref = node.children;
                for(i = 0, len = ref.length; i < len; i++){
                    child = ref[i];
                    r += (function() {
                        switch(false){
                            case !(child instanceof XMLDTDAttList):
                                return this.dtdAttList(child, level + 1);
                            case !(child instanceof XMLDTDElement):
                                return this.dtdElement(child, level + 1);
                            case !(child instanceof XMLDTDEntity):
                                return this.dtdEntity(child, level + 1);
                            case !(child instanceof XMLDTDNotation):
                                return this.dtdNotation(child, level + 1);
                            case !(child instanceof XMLCData):
                                return this.cdata(child, level + 1);
                            case !(child instanceof XMLComment):
                                return this.comment(child, level + 1);
                            case !(child instanceof XMLProcessingInstruction):
                                return this.processingInstruction(child, level + 1);
                            default:
                                throw new Error("Unknown DTD node type: " + child.constructor.name);
                        }
                    }).call(this);
                }
                r += ']';
            }
            r += this.spacebeforeslash + '>';
            r += this.newline;
            return r;
        };
        XMLStringWriter.prototype.element = function(node, level) {
            var att, child, i, j, len, len1, name, r, ref, ref1, ref2, space, textispresentwasset;
            level || (level = 0);
            textispresentwasset = false;
            if (this.textispresent) {
                this.newline = '';
                this.pretty = false;
            } else {
                this.newline = this.newlinedefault;
                this.pretty = this.prettydefault;
            }
            space = this.space(level);
            r = '';
            r += space + '<' + node.name;
            ref = node.attributes;
            for(name in ref){
                if (!hasProp.call(ref, name)) continue;
                att = ref[name];
                r += this.attribute(att);
            }
            if (node.children.length === 0 || node.children.every(function(e) {
                return e.value === '';
            })) {
                if (this.allowEmpty) {
                    r += '></' + node.name + '>' + this.newline;
                } else {
                    r += this.spacebeforeslash + '/>' + this.newline;
                }
            } else if (this.pretty && node.children.length === 1 && node.children[0].value != null) {
                r += '>';
                r += node.children[0].value;
                r += '</' + node.name + '>' + this.newline;
            } else {
                if (this.dontprettytextnodes) {
                    ref1 = node.children;
                    for(i = 0, len = ref1.length; i < len; i++){
                        child = ref1[i];
                        if (child.value != null) {
                            this.textispresent++;
                            textispresentwasset = true;
                            break;
                        }
                    }
                }
                if (this.textispresent) {
                    this.newline = '';
                    this.pretty = false;
                    space = this.space(level);
                }
                r += '>' + this.newline;
                ref2 = node.children;
                for(j = 0, len1 = ref2.length; j < len1; j++){
                    child = ref2[j];
                    r += (function() {
                        switch(false){
                            case !(child instanceof XMLCData):
                                return this.cdata(child, level + 1);
                            case !(child instanceof XMLComment):
                                return this.comment(child, level + 1);
                            case !(child instanceof XMLElement):
                                return this.element(child, level + 1);
                            case !(child instanceof XMLRaw):
                                return this.raw(child, level + 1);
                            case !(child instanceof XMLText):
                                return this.text(child, level + 1);
                            case !(child instanceof XMLProcessingInstruction):
                                return this.processingInstruction(child, level + 1);
                            case !(child instanceof XMLDummy):
                                return '';
                            default:
                                throw new Error("Unknown XML node type: " + child.constructor.name);
                        }
                    }).call(this);
                }
                if (textispresentwasset) {
                    this.textispresent--;
                }
                if (!this.textispresent) {
                    this.newline = this.newlinedefault;
                    this.pretty = this.prettydefault;
                }
                r += space + '</' + node.name + '>' + this.newline;
            }
            return r;
        };
        XMLStringWriter.prototype.processingInstruction = function(node, level) {
            var r;
            r = this.space(level) + '<?' + node.target;
            if (node.value) {
                r += ' ' + node.value;
            }
            r += this.spacebeforeslash + '?>' + this.newline;
            return r;
        };
        XMLStringWriter.prototype.raw = function(node, level) {
            return this.space(level) + node.value + this.newline;
        };
        XMLStringWriter.prototype.text = function(node, level) {
            return this.space(level) + node.value + this.newline;
        };
        XMLStringWriter.prototype.dtdAttList = function(node, level) {
            var r;
            r = this.space(level) + '<!ATTLIST ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType;
            if (node.defaultValueType !== '#DEFAULT') {
                r += ' ' + node.defaultValueType;
            }
            if (node.defaultValue) {
                r += ' "' + node.defaultValue + '"';
            }
            r += this.spacebeforeslash + '>' + this.newline;
            return r;
        };
        XMLStringWriter.prototype.dtdElement = function(node, level) {
            return this.space(level) + '<!ELEMENT ' + node.name + ' ' + node.value + this.spacebeforeslash + '>' + this.newline;
        };
        XMLStringWriter.prototype.dtdEntity = function(node, level) {
            var r;
            r = this.space(level) + '<!ENTITY';
            if (node.pe) {
                r += ' %';
            }
            r += ' ' + node.name;
            if (node.value) {
                r += ' "' + node.value + '"';
            } else {
                if (node.pubID && node.sysID) {
                    r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
                } else if (node.sysID) {
                    r += ' SYSTEM "' + node.sysID + '"';
                }
                if (node.nData) {
                    r += ' NDATA ' + node.nData;
                }
            }
            r += this.spacebeforeslash + '>' + this.newline;
            return r;
        };
        XMLStringWriter.prototype.dtdNotation = function(node, level) {
            var r;
            r = this.space(level) + '<!NOTATION ' + node.name;
            if (node.pubID && node.sysID) {
                r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.pubID) {
                r += ' PUBLIC "' + node.pubID + '"';
            } else if (node.sysID) {
                r += ' SYSTEM "' + node.sysID + '"';
            }
            r += this.spacebeforeslash + '>' + this.newline;
            return r;
        };
        XMLStringWriter.prototype.openNode = function(node, level) {
            var att, name, r, ref;
            level || (level = 0);
            if (node instanceof XMLElement) {
                r = this.space(level) + '<' + node.name;
                ref = node.attributes;
                for(name in ref){
                    if (!hasProp.call(ref, name)) continue;
                    att = ref[name];
                    r += this.attribute(att);
                }
                r += (node.children ? '>' : '/>') + this.newline;
                return r;
            } else {
                r = this.space(level) + '<!DOCTYPE ' + node.rootNodeName;
                if (node.pubID && node.sysID) {
                    r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
                } else if (node.sysID) {
                    r += ' SYSTEM "' + node.sysID + '"';
                }
                r += (node.children ? ' [' : '>') + this.newline;
                return r;
            }
        };
        XMLStringWriter.prototype.closeNode = function(node, level) {
            level || (level = 0);
            switch(false){
                case !(node instanceof XMLElement):
                    return this.space(level) + '</' + node.name + '>' + this.newline;
                case !(node instanceof XMLDocType):
                    return this.space(level) + ']>' + this.newline;
            }
        };
        return XMLStringWriter;
    }(XMLWriterBase);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLDocument.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    isPlainObject = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/Utility.js [app-route] (ecmascript)").isPlainObject;
    XMLNode = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLNode.js [app-route] (ecmascript)");
    XMLStringifier = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLStringifier.js [app-route] (ecmascript)");
    XMLStringWriter = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLStringWriter.js [app-route] (ecmascript)");
    module.exports = XMLDocument = function(superClass) {
        extend(XMLDocument, superClass);
        function XMLDocument(options) {
            XMLDocument.__super__.constructor.call(this, null);
            this.name = "?xml";
            options || (options = {});
            if (!options.writer) {
                options.writer = new XMLStringWriter();
            }
            this.options = options;
            this.stringify = new XMLStringifier(options);
            this.isDocument = true;
        }
        XMLDocument.prototype.end = function(writer) {
            var writerOptions;
            if (!writer) {
                writer = this.options.writer;
            } else if (isPlainObject(writer)) {
                writerOptions = writer;
                writer = this.options.writer.set(writerOptions);
            }
            return writer.document(this);
        };
        XMLDocument.prototype.toString = function(options) {
            return this.options.writer.set(options).document(this);
        };
        return XMLDocument;
    }(XMLNode);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLDocumentCB.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, ref, hasProp = {}.hasOwnProperty;
    ref = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/Utility.js [app-route] (ecmascript)"), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;
    XMLElement = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLElement.js [app-route] (ecmascript)");
    XMLCData = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLCData.js [app-route] (ecmascript)");
    XMLComment = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLComment.js [app-route] (ecmascript)");
    XMLRaw = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLRaw.js [app-route] (ecmascript)");
    XMLText = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLText.js [app-route] (ecmascript)");
    XMLProcessingInstruction = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLProcessingInstruction.js [app-route] (ecmascript)");
    XMLDeclaration = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDeclaration.js [app-route] (ecmascript)");
    XMLDocType = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDocType.js [app-route] (ecmascript)");
    XMLDTDAttList = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDAttList.js [app-route] (ecmascript)");
    XMLDTDEntity = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDEntity.js [app-route] (ecmascript)");
    XMLDTDElement = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDElement.js [app-route] (ecmascript)");
    XMLDTDNotation = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDNotation.js [app-route] (ecmascript)");
    XMLAttribute = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLAttribute.js [app-route] (ecmascript)");
    XMLStringifier = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLStringifier.js [app-route] (ecmascript)");
    XMLStringWriter = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLStringWriter.js [app-route] (ecmascript)");
    module.exports = XMLDocumentCB = function() {
        function XMLDocumentCB(options, onData, onEnd) {
            var writerOptions;
            this.name = "?xml";
            options || (options = {});
            if (!options.writer) {
                options.writer = new XMLStringWriter(options);
            } else if (isPlainObject(options.writer)) {
                writerOptions = options.writer;
                options.writer = new XMLStringWriter(writerOptions);
            }
            this.options = options;
            this.writer = options.writer;
            this.stringify = new XMLStringifier(options);
            this.onDataCallback = onData || function() {};
            this.onEndCallback = onEnd || function() {};
            this.currentNode = null;
            this.currentLevel = -1;
            this.openTags = {};
            this.documentStarted = false;
            this.documentCompleted = false;
            this.root = null;
        }
        XMLDocumentCB.prototype.node = function(name, attributes, text) {
            var ref1, ref2;
            if (name == null) {
                throw new Error("Missing node name.");
            }
            if (this.root && this.currentLevel === -1) {
                throw new Error("Document can only have one root node. " + this.debugInfo(name));
            }
            this.openCurrent();
            name = getValue(name);
            if (attributes === null && text == null) {
                ref1 = [
                    {},
                    null
                ], attributes = ref1[0], text = ref1[1];
            }
            if (attributes == null) {
                attributes = {};
            }
            attributes = getValue(attributes);
            if (!isObject(attributes)) {
                ref2 = [
                    attributes,
                    text
                ], text = ref2[0], attributes = ref2[1];
            }
            this.currentNode = new XMLElement(this, name, attributes);
            this.currentNode.children = false;
            this.currentLevel++;
            this.openTags[this.currentLevel] = this.currentNode;
            if (text != null) {
                this.text(text);
            }
            return this;
        };
        XMLDocumentCB.prototype.element = function(name, attributes, text) {
            if (this.currentNode && this.currentNode instanceof XMLDocType) {
                return this.dtdElement.apply(this, arguments);
            } else {
                return this.node(name, attributes, text);
            }
        };
        XMLDocumentCB.prototype.attribute = function(name, value) {
            var attName, attValue;
            if (!this.currentNode || this.currentNode.children) {
                throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
            }
            if (name != null) {
                name = getValue(name);
            }
            if (isObject(name)) {
                for(attName in name){
                    if (!hasProp.call(name, attName)) continue;
                    attValue = name[attName];
                    this.attribute(attName, attValue);
                }
            } else {
                if (isFunction(value)) {
                    value = value.apply();
                }
                if (!this.options.skipNullAttributes || value != null) {
                    this.currentNode.attributes[name] = new XMLAttribute(this, name, value);
                }
            }
            return this;
        };
        XMLDocumentCB.prototype.text = function(value) {
            var node;
            this.openCurrent();
            node = new XMLText(this, value);
            this.onData(this.writer.text(node, this.currentLevel + 1), this.currentLevel + 1);
            return this;
        };
        XMLDocumentCB.prototype.cdata = function(value) {
            var node;
            this.openCurrent();
            node = new XMLCData(this, value);
            this.onData(this.writer.cdata(node, this.currentLevel + 1), this.currentLevel + 1);
            return this;
        };
        XMLDocumentCB.prototype.comment = function(value) {
            var node;
            this.openCurrent();
            node = new XMLComment(this, value);
            this.onData(this.writer.comment(node, this.currentLevel + 1), this.currentLevel + 1);
            return this;
        };
        XMLDocumentCB.prototype.raw = function(value) {
            var node;
            this.openCurrent();
            node = new XMLRaw(this, value);
            this.onData(this.writer.raw(node, this.currentLevel + 1), this.currentLevel + 1);
            return this;
        };
        XMLDocumentCB.prototype.instruction = function(target, value) {
            var i, insTarget, insValue, len, node;
            this.openCurrent();
            if (target != null) {
                target = getValue(target);
            }
            if (value != null) {
                value = getValue(value);
            }
            if (Array.isArray(target)) {
                for(i = 0, len = target.length; i < len; i++){
                    insTarget = target[i];
                    this.instruction(insTarget);
                }
            } else if (isObject(target)) {
                for(insTarget in target){
                    if (!hasProp.call(target, insTarget)) continue;
                    insValue = target[insTarget];
                    this.instruction(insTarget, insValue);
                }
            } else {
                if (isFunction(value)) {
                    value = value.apply();
                }
                node = new XMLProcessingInstruction(this, target, value);
                this.onData(this.writer.processingInstruction(node, this.currentLevel + 1), this.currentLevel + 1);
            }
            return this;
        };
        XMLDocumentCB.prototype.declaration = function(version, encoding, standalone) {
            var node;
            this.openCurrent();
            if (this.documentStarted) {
                throw new Error("declaration() must be the first node.");
            }
            node = new XMLDeclaration(this, version, encoding, standalone);
            this.onData(this.writer.declaration(node, this.currentLevel + 1), this.currentLevel + 1);
            return this;
        };
        XMLDocumentCB.prototype.doctype = function(root, pubID, sysID) {
            this.openCurrent();
            if (root == null) {
                throw new Error("Missing root node name.");
            }
            if (this.root) {
                throw new Error("dtd() must come before the root node.");
            }
            this.currentNode = new XMLDocType(this, pubID, sysID);
            this.currentNode.rootNodeName = root;
            this.currentNode.children = false;
            this.currentLevel++;
            this.openTags[this.currentLevel] = this.currentNode;
            return this;
        };
        XMLDocumentCB.prototype.dtdElement = function(name, value) {
            var node;
            this.openCurrent();
            node = new XMLDTDElement(this, name, value);
            this.onData(this.writer.dtdElement(node, this.currentLevel + 1), this.currentLevel + 1);
            return this;
        };
        XMLDocumentCB.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
            var node;
            this.openCurrent();
            node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
            this.onData(this.writer.dtdAttList(node, this.currentLevel + 1), this.currentLevel + 1);
            return this;
        };
        XMLDocumentCB.prototype.entity = function(name, value) {
            var node;
            this.openCurrent();
            node = new XMLDTDEntity(this, false, name, value);
            this.onData(this.writer.dtdEntity(node, this.currentLevel + 1), this.currentLevel + 1);
            return this;
        };
        XMLDocumentCB.prototype.pEntity = function(name, value) {
            var node;
            this.openCurrent();
            node = new XMLDTDEntity(this, true, name, value);
            this.onData(this.writer.dtdEntity(node, this.currentLevel + 1), this.currentLevel + 1);
            return this;
        };
        XMLDocumentCB.prototype.notation = function(name, value) {
            var node;
            this.openCurrent();
            node = new XMLDTDNotation(this, name, value);
            this.onData(this.writer.dtdNotation(node, this.currentLevel + 1), this.currentLevel + 1);
            return this;
        };
        XMLDocumentCB.prototype.up = function() {
            if (this.currentLevel < 0) {
                throw new Error("The document node has no parent.");
            }
            if (this.currentNode) {
                if (this.currentNode.children) {
                    this.closeNode(this.currentNode);
                } else {
                    this.openNode(this.currentNode);
                }
                this.currentNode = null;
            } else {
                this.closeNode(this.openTags[this.currentLevel]);
            }
            delete this.openTags[this.currentLevel];
            this.currentLevel--;
            return this;
        };
        XMLDocumentCB.prototype.end = function() {
            while(this.currentLevel >= 0){
                this.up();
            }
            return this.onEnd();
        };
        XMLDocumentCB.prototype.openCurrent = function() {
            if (this.currentNode) {
                this.currentNode.children = true;
                return this.openNode(this.currentNode);
            }
        };
        XMLDocumentCB.prototype.openNode = function(node) {
            if (!node.isOpen) {
                if (!this.root && this.currentLevel === 0 && node instanceof XMLElement) {
                    this.root = node;
                }
                this.onData(this.writer.openNode(node, this.currentLevel), this.currentLevel);
                return node.isOpen = true;
            }
        };
        XMLDocumentCB.prototype.closeNode = function(node) {
            if (!node.isClosed) {
                this.onData(this.writer.closeNode(node, this.currentLevel), this.currentLevel);
                return node.isClosed = true;
            }
        };
        XMLDocumentCB.prototype.onData = function(chunk, level) {
            this.documentStarted = true;
            return this.onDataCallback(chunk, level + 1);
        };
        XMLDocumentCB.prototype.onEnd = function() {
            this.documentCompleted = true;
            return this.onEndCallback();
        };
        XMLDocumentCB.prototype.debugInfo = function(name) {
            if (name == null) {
                return "";
            } else {
                return "node: <" + name + ">";
            }
        };
        XMLDocumentCB.prototype.ele = function() {
            return this.element.apply(this, arguments);
        };
        XMLDocumentCB.prototype.nod = function(name, attributes, text) {
            return this.node(name, attributes, text);
        };
        XMLDocumentCB.prototype.txt = function(value) {
            return this.text(value);
        };
        XMLDocumentCB.prototype.dat = function(value) {
            return this.cdata(value);
        };
        XMLDocumentCB.prototype.com = function(value) {
            return this.comment(value);
        };
        XMLDocumentCB.prototype.ins = function(target, value) {
            return this.instruction(target, value);
        };
        XMLDocumentCB.prototype.dec = function(version, encoding, standalone) {
            return this.declaration(version, encoding, standalone);
        };
        XMLDocumentCB.prototype.dtd = function(root, pubID, sysID) {
            return this.doctype(root, pubID, sysID);
        };
        XMLDocumentCB.prototype.e = function(name, attributes, text) {
            return this.element(name, attributes, text);
        };
        XMLDocumentCB.prototype.n = function(name, attributes, text) {
            return this.node(name, attributes, text);
        };
        XMLDocumentCB.prototype.t = function(value) {
            return this.text(value);
        };
        XMLDocumentCB.prototype.d = function(value) {
            return this.cdata(value);
        };
        XMLDocumentCB.prototype.c = function(value) {
            return this.comment(value);
        };
        XMLDocumentCB.prototype.r = function(value) {
            return this.raw(value);
        };
        XMLDocumentCB.prototype.i = function(target, value) {
            return this.instruction(target, value);
        };
        XMLDocumentCB.prototype.att = function() {
            if (this.currentNode && this.currentNode instanceof XMLDocType) {
                return this.attList.apply(this, arguments);
            } else {
                return this.attribute.apply(this, arguments);
            }
        };
        XMLDocumentCB.prototype.a = function() {
            if (this.currentNode && this.currentNode instanceof XMLDocType) {
                return this.attList.apply(this, arguments);
            } else {
                return this.attribute.apply(this, arguments);
            }
        };
        XMLDocumentCB.prototype.ent = function(name, value) {
            return this.entity(name, value);
        };
        XMLDocumentCB.prototype.pent = function(name, value) {
            return this.pEntity(name, value);
        };
        XMLDocumentCB.prototype.not = function(name, value) {
            return this.notation(name, value);
        };
        return XMLDocumentCB;
    }();
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/XMLStreamWriter.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStreamWriter, XMLText, XMLWriterBase, extend = function(child, parent) {
        for(var key in parent){
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp = {}.hasOwnProperty;
    XMLDeclaration = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDeclaration.js [app-route] (ecmascript)");
    XMLDocType = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDocType.js [app-route] (ecmascript)");
    XMLCData = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLCData.js [app-route] (ecmascript)");
    XMLComment = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLComment.js [app-route] (ecmascript)");
    XMLElement = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLElement.js [app-route] (ecmascript)");
    XMLRaw = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLRaw.js [app-route] (ecmascript)");
    XMLText = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLText.js [app-route] (ecmascript)");
    XMLProcessingInstruction = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLProcessingInstruction.js [app-route] (ecmascript)");
    XMLDummy = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDummy.js [app-route] (ecmascript)");
    XMLDTDAttList = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDAttList.js [app-route] (ecmascript)");
    XMLDTDElement = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDElement.js [app-route] (ecmascript)");
    XMLDTDEntity = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDEntity.js [app-route] (ecmascript)");
    XMLDTDNotation = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDTDNotation.js [app-route] (ecmascript)");
    XMLWriterBase = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLWriterBase.js [app-route] (ecmascript)");
    module.exports = XMLStreamWriter = function(superClass) {
        extend(XMLStreamWriter, superClass);
        function XMLStreamWriter(stream, options) {
            XMLStreamWriter.__super__.constructor.call(this, options);
            this.stream = stream;
        }
        XMLStreamWriter.prototype.document = function(doc) {
            var child, i, j, len, len1, ref, ref1, results;
            ref = doc.children;
            for(i = 0, len = ref.length; i < len; i++){
                child = ref[i];
                child.isLastRootNode = false;
            }
            doc.children[doc.children.length - 1].isLastRootNode = true;
            ref1 = doc.children;
            results = [];
            for(j = 0, len1 = ref1.length; j < len1; j++){
                child = ref1[j];
                if (child instanceof XMLDummy) {
                    continue;
                }
                switch(false){
                    case !(child instanceof XMLDeclaration):
                        results.push(this.declaration(child));
                        break;
                    case !(child instanceof XMLDocType):
                        results.push(this.docType(child));
                        break;
                    case !(child instanceof XMLComment):
                        results.push(this.comment(child));
                        break;
                    case !(child instanceof XMLProcessingInstruction):
                        results.push(this.processingInstruction(child));
                        break;
                    default:
                        results.push(this.element(child));
                }
            }
            return results;
        };
        XMLStreamWriter.prototype.attribute = function(att) {
            return this.stream.write(' ' + att.name + '="' + att.value + '"');
        };
        XMLStreamWriter.prototype.cdata = function(node, level) {
            return this.stream.write(this.space(level) + '<![CDATA[' + node.text + ']]>' + this.endline(node));
        };
        XMLStreamWriter.prototype.comment = function(node, level) {
            return this.stream.write(this.space(level) + '<!-- ' + node.text + ' -->' + this.endline(node));
        };
        XMLStreamWriter.prototype.declaration = function(node, level) {
            this.stream.write(this.space(level));
            this.stream.write('<?xml version="' + node.version + '"');
            if (node.encoding != null) {
                this.stream.write(' encoding="' + node.encoding + '"');
            }
            if (node.standalone != null) {
                this.stream.write(' standalone="' + node.standalone + '"');
            }
            this.stream.write(this.spacebeforeslash + '?>');
            return this.stream.write(this.endline(node));
        };
        XMLStreamWriter.prototype.docType = function(node, level) {
            var child, i, len, ref;
            level || (level = 0);
            this.stream.write(this.space(level));
            this.stream.write('<!DOCTYPE ' + node.root().name);
            if (node.pubID && node.sysID) {
                this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
            } else if (node.sysID) {
                this.stream.write(' SYSTEM "' + node.sysID + '"');
            }
            if (node.children.length > 0) {
                this.stream.write(' [');
                this.stream.write(this.endline(node));
                ref = node.children;
                for(i = 0, len = ref.length; i < len; i++){
                    child = ref[i];
                    switch(false){
                        case !(child instanceof XMLDTDAttList):
                            this.dtdAttList(child, level + 1);
                            break;
                        case !(child instanceof XMLDTDElement):
                            this.dtdElement(child, level + 1);
                            break;
                        case !(child instanceof XMLDTDEntity):
                            this.dtdEntity(child, level + 1);
                            break;
                        case !(child instanceof XMLDTDNotation):
                            this.dtdNotation(child, level + 1);
                            break;
                        case !(child instanceof XMLCData):
                            this.cdata(child, level + 1);
                            break;
                        case !(child instanceof XMLComment):
                            this.comment(child, level + 1);
                            break;
                        case !(child instanceof XMLProcessingInstruction):
                            this.processingInstruction(child, level + 1);
                            break;
                        default:
                            throw new Error("Unknown DTD node type: " + child.constructor.name);
                    }
                }
                this.stream.write(']');
            }
            this.stream.write(this.spacebeforeslash + '>');
            return this.stream.write(this.endline(node));
        };
        XMLStreamWriter.prototype.element = function(node, level) {
            var att, child, i, len, name, ref, ref1, space;
            level || (level = 0);
            space = this.space(level);
            this.stream.write(space + '<' + node.name);
            ref = node.attributes;
            for(name in ref){
                if (!hasProp.call(ref, name)) continue;
                att = ref[name];
                this.attribute(att);
            }
            if (node.children.length === 0 || node.children.every(function(e) {
                return e.value === '';
            })) {
                if (this.allowEmpty) {
                    this.stream.write('></' + node.name + '>');
                } else {
                    this.stream.write(this.spacebeforeslash + '/>');
                }
            } else if (this.pretty && node.children.length === 1 && node.children[0].value != null) {
                this.stream.write('>');
                this.stream.write(node.children[0].value);
                this.stream.write('</' + node.name + '>');
            } else {
                this.stream.write('>' + this.newline);
                ref1 = node.children;
                for(i = 0, len = ref1.length; i < len; i++){
                    child = ref1[i];
                    switch(false){
                        case !(child instanceof XMLCData):
                            this.cdata(child, level + 1);
                            break;
                        case !(child instanceof XMLComment):
                            this.comment(child, level + 1);
                            break;
                        case !(child instanceof XMLElement):
                            this.element(child, level + 1);
                            break;
                        case !(child instanceof XMLRaw):
                            this.raw(child, level + 1);
                            break;
                        case !(child instanceof XMLText):
                            this.text(child, level + 1);
                            break;
                        case !(child instanceof XMLProcessingInstruction):
                            this.processingInstruction(child, level + 1);
                            break;
                        case !(child instanceof XMLDummy):
                            '';
                            break;
                        default:
                            throw new Error("Unknown XML node type: " + child.constructor.name);
                    }
                }
                this.stream.write(space + '</' + node.name + '>');
            }
            return this.stream.write(this.endline(node));
        };
        XMLStreamWriter.prototype.processingInstruction = function(node, level) {
            this.stream.write(this.space(level) + '<?' + node.target);
            if (node.value) {
                this.stream.write(' ' + node.value);
            }
            return this.stream.write(this.spacebeforeslash + '?>' + this.endline(node));
        };
        XMLStreamWriter.prototype.raw = function(node, level) {
            return this.stream.write(this.space(level) + node.value + this.endline(node));
        };
        XMLStreamWriter.prototype.text = function(node, level) {
            return this.stream.write(this.space(level) + node.value + this.endline(node));
        };
        XMLStreamWriter.prototype.dtdAttList = function(node, level) {
            this.stream.write(this.space(level) + '<!ATTLIST ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType);
            if (node.defaultValueType !== '#DEFAULT') {
                this.stream.write(' ' + node.defaultValueType);
            }
            if (node.defaultValue) {
                this.stream.write(' "' + node.defaultValue + '"');
            }
            return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
        };
        XMLStreamWriter.prototype.dtdElement = function(node, level) {
            this.stream.write(this.space(level) + '<!ELEMENT ' + node.name + ' ' + node.value);
            return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
        };
        XMLStreamWriter.prototype.dtdEntity = function(node, level) {
            this.stream.write(this.space(level) + '<!ENTITY');
            if (node.pe) {
                this.stream.write(' %');
            }
            this.stream.write(' ' + node.name);
            if (node.value) {
                this.stream.write(' "' + node.value + '"');
            } else {
                if (node.pubID && node.sysID) {
                    this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
                } else if (node.sysID) {
                    this.stream.write(' SYSTEM "' + node.sysID + '"');
                }
                if (node.nData) {
                    this.stream.write(' NDATA ' + node.nData);
                }
            }
            return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
        };
        XMLStreamWriter.prototype.dtdNotation = function(node, level) {
            this.stream.write(this.space(level) + '<!NOTATION ' + node.name);
            if (node.pubID && node.sysID) {
                this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
            } else if (node.pubID) {
                this.stream.write(' PUBLIC "' + node.pubID + '"');
            } else if (node.sysID) {
                this.stream.write(' SYSTEM "' + node.sysID + '"');
            }
            return this.stream.write(this.spacebeforeslash + '>' + this.endline(node));
        };
        XMLStreamWriter.prototype.endline = function(node) {
            if (!node.isLastRootNode) {
                return this.newline;
            } else {
                return '';
            }
        };
        return XMLStreamWriter;
    }(XMLWriterBase);
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/xmlbuilder/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// Generated by CoffeeScript 1.12.7
(function() {
    var XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;
    ref = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/Utility.js [app-route] (ecmascript)"), assign = ref.assign, isFunction = ref.isFunction;
    XMLDocument = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDocument.js [app-route] (ecmascript)");
    XMLDocumentCB = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLDocumentCB.js [app-route] (ecmascript)");
    XMLStringWriter = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLStringWriter.js [app-route] (ecmascript)");
    XMLStreamWriter = __turbopack_context__.r("[project]/node_modules/xmlbuilder/lib/XMLStreamWriter.js [app-route] (ecmascript)");
    module.exports.create = function(name, xmldec, doctype, options) {
        var doc, root;
        if (name == null) {
            throw new Error("Root element needs a name.");
        }
        options = assign({}, xmldec, doctype, options);
        doc = new XMLDocument(options);
        root = doc.element(name);
        if (!options.headless) {
            doc.declaration(options);
            if (options.pubID != null || options.sysID != null) {
                doc.doctype(options);
            }
        }
        return root;
    };
    module.exports.begin = function(options, onData, onEnd) {
        var ref1;
        if (isFunction(options)) {
            ref1 = [
                options,
                onData
            ], onData = ref1[0], onEnd = ref1[1];
            options = {};
        }
        if (onData) {
            return new XMLDocumentCB(options, onData, onEnd);
        } else {
            return new XMLDocument(options);
        }
    };
    module.exports.stringWriter = function(options) {
        return new XMLStringWriter(options);
    };
    module.exports.streamWriter = function(stream, options) {
        return new XMLStreamWriter(stream, options);
    };
}).call(/*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/node_modules/path-is-absolute/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function posix(path) {
    return path.charAt(0) === '/';
}
function win32(path) {
    // https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
    var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
    var result = splitDeviceRe.exec(path);
    var device = result[1] || '';
    var isUnc = Boolean(device && device.charAt(1) !== ':');
    // UNC paths are always absolute
    return Boolean(result[2] || isUnc);
}
module.exports = ("TURBOPACK compile-time truthy", 1) ? win32 : "TURBOPACK unreachable";
module.exports.posix = posix;
module.exports.win32 = win32;
}),
"[project]/node_modules/lop/lib/TokenIterator.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var TokenIterator = module.exports = function(tokens, startIndex) {
    this._tokens = tokens;
    this._startIndex = startIndex || 0;
};
TokenIterator.prototype.head = function() {
    return this._tokens[this._startIndex];
};
TokenIterator.prototype.tail = function(startIndex) {
    return new TokenIterator(this._tokens, this._startIndex + 1);
};
TokenIterator.prototype.toArray = function() {
    return this._tokens.slice(this._startIndex);
};
TokenIterator.prototype.end = function() {
    return this._tokens[this._tokens.length - 1];
};
// TODO: doesn't need to be a method, can be a separate function,
// which simplifies implementation of the TokenIterator interface
TokenIterator.prototype.to = function(end) {
    var start = this.head().source;
    var endToken = end.head() || end.end();
    return start.to(endToken.source);
};
}),
"[project]/node_modules/lop/lib/parser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var TokenIterator = __turbopack_context__.r("[project]/node_modules/lop/lib/TokenIterator.js [app-route] (ecmascript)");
exports.Parser = function(options) {
    var parseTokens = function(parser, tokens) {
        return parser(new TokenIterator(tokens));
    };
    return {
        parseTokens: parseTokens
    };
};
}),
"[project]/node_modules/lop/lib/parsing-results.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    failure: function(errors, remaining) {
        if (errors.length < 1) {
            throw new Error("Failure must have errors");
        }
        return new Result({
            status: "failure",
            remaining: remaining,
            errors: errors
        });
    },
    error: function(errors, remaining) {
        if (errors.length < 1) {
            throw new Error("Failure must have errors");
        }
        return new Result({
            status: "error",
            remaining: remaining,
            errors: errors
        });
    },
    success: function(value, remaining, source) {
        return new Result({
            status: "success",
            value: value,
            source: source,
            remaining: remaining,
            errors: []
        });
    },
    cut: function(remaining) {
        return new Result({
            status: "cut",
            remaining: remaining,
            errors: []
        });
    }
};
var Result = function(options) {
    this._value = options.value;
    this._status = options.status;
    this._hasValue = options.value !== undefined;
    this._remaining = options.remaining;
    this._source = options.source;
    this._errors = options.errors;
};
Result.prototype.map = function(func) {
    if (this._hasValue) {
        return new Result({
            value: func(this._value, this._source),
            status: this._status,
            remaining: this._remaining,
            source: this._source,
            errors: this._errors
        });
    } else {
        return this;
    }
};
Result.prototype.changeRemaining = function(remaining) {
    return new Result({
        value: this._value,
        status: this._status,
        remaining: remaining,
        source: this._source,
        errors: this._errors
    });
};
Result.prototype.isSuccess = function() {
    return this._status === "success" || this._status === "cut";
};
Result.prototype.isFailure = function() {
    return this._status === "failure";
};
Result.prototype.isError = function() {
    return this._status === "error";
};
Result.prototype.isCut = function() {
    return this._status === "cut";
};
Result.prototype.value = function() {
    return this._value;
};
Result.prototype.remaining = function() {
    return this._remaining;
};
Result.prototype.source = function() {
    return this._source;
};
Result.prototype.errors = function() {
    return this._errors;
};
}),
"[project]/node_modules/lop/lib/errors.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

exports.error = function(options) {
    return new Error(options);
};
var Error = function(options) {
    this.expected = options.expected;
    this.actual = options.actual;
    this._location = options.location;
};
Error.prototype.describe = function() {
    var locationDescription = this._location ? this._location.describe() + ":\n" : "";
    return locationDescription + "Expected " + this.expected + "\nbut got " + this.actual;
};
Error.prototype.lineNumber = function() {
    return this._location.lineNumber();
};
Error.prototype.characterNumber = function() {
    return this._location.characterNumber();
};
}),
"[project]/node_modules/lop/lib/lazy-iterators.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var fromArray = exports.fromArray = function(array) {
    var index = 0;
    var hasNext = function() {
        return index < array.length;
    };
    return new LazyIterator({
        hasNext: hasNext,
        next: function() {
            if (!hasNext()) {
                throw new Error("No more elements");
            } else {
                return array[index++];
            }
        }
    });
};
var LazyIterator = function(iterator) {
    this._iterator = iterator;
};
LazyIterator.prototype.map = function(func) {
    var iterator = this._iterator;
    return new LazyIterator({
        hasNext: function() {
            return iterator.hasNext();
        },
        next: function() {
            return func(iterator.next());
        }
    });
};
LazyIterator.prototype.filter = function(condition) {
    var iterator = this._iterator;
    var moved = false;
    var hasNext = false;
    var next;
    var moveIfNecessary = function() {
        if (moved) {
            return;
        }
        moved = true;
        hasNext = false;
        while(iterator.hasNext() && !hasNext){
            next = iterator.next();
            hasNext = condition(next);
        }
    };
    return new LazyIterator({
        hasNext: function() {
            moveIfNecessary();
            return hasNext;
        },
        next: function() {
            moveIfNecessary();
            var toReturn = next;
            moved = false;
            return toReturn;
        }
    });
};
LazyIterator.prototype.first = function() {
    var iterator = this._iterator;
    if (this._iterator.hasNext()) {
        return iterator.next();
    } else {
        return null;
    }
};
LazyIterator.prototype.toArray = function() {
    var result = [];
    while(this._iterator.hasNext()){
        result.push(this._iterator.next());
    }
    return result;
};
}),
"[project]/node_modules/lop/lib/rules.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var _ = __turbopack_context__.r("[project]/node_modules/underscore/modules/index-all.js [app-route] (ecmascript)");
var options = __turbopack_context__.r("[project]/node_modules/option/index.js [app-route] (ecmascript)");
var results = __turbopack_context__.r("[project]/node_modules/lop/lib/parsing-results.js [app-route] (ecmascript)");
var errors = __turbopack_context__.r("[project]/node_modules/lop/lib/errors.js [app-route] (ecmascript)");
var lazyIterators = __turbopack_context__.r("[project]/node_modules/lop/lib/lazy-iterators.js [app-route] (ecmascript)");
exports.token = function(tokenType, value) {
    var matchValue = value !== undefined;
    return function(input) {
        var token = input.head();
        if (token && token.name === tokenType && (!matchValue || token.value === value)) {
            return results.success(token.value, input.tail(), token.source);
        } else {
            var expected = describeToken({
                name: tokenType,
                value: value
            });
            return describeTokenMismatch(input, expected);
        }
    };
};
exports.tokenOfType = function(tokenType) {
    return exports.token(tokenType);
};
exports.firstOf = function(name, parsers) {
    if (!_.isArray(parsers)) {
        parsers = Array.prototype.slice.call(arguments, 1);
    }
    return function(input) {
        return lazyIterators.fromArray(parsers).map(function(parser) {
            return parser(input);
        }).filter(function(result) {
            return result.isSuccess() || result.isError();
        }).first() || describeTokenMismatch(input, name);
    };
};
exports.then = function(parser, func) {
    return function(input) {
        var result = parser(input);
        if (!result.map) {
            console.log(result);
        }
        return result.map(func);
    };
};
exports.sequence = function() {
    var parsers = Array.prototype.slice.call(arguments, 0);
    var rule = function(input) {
        var result = _.foldl(parsers, function(memo, parser) {
            var result = memo.result;
            var hasCut = memo.hasCut;
            if (!result.isSuccess()) {
                return {
                    result: result,
                    hasCut: hasCut
                };
            }
            var subResult = parser(result.remaining());
            if (subResult.isCut()) {
                return {
                    result: result,
                    hasCut: true
                };
            } else if (subResult.isSuccess()) {
                var values;
                if (parser.isCaptured) {
                    values = result.value().withValue(parser, subResult.value());
                } else {
                    values = result.value();
                }
                var remaining = subResult.remaining();
                var source = input.to(remaining);
                return {
                    result: results.success(values, remaining, source),
                    hasCut: hasCut
                };
            } else if (hasCut) {
                return {
                    result: results.error(subResult.errors(), subResult.remaining()),
                    hasCut: hasCut
                };
            } else {
                return {
                    result: subResult,
                    hasCut: hasCut
                };
            }
        }, {
            result: results.success(new SequenceValues(), input),
            hasCut: false
        }).result;
        var source = input.to(result.remaining());
        return result.map(function(values) {
            return values.withValue(exports.sequence.source, source);
        });
    };
    rule.head = function() {
        var firstCapture = _.find(parsers, isCapturedRule);
        return exports.then(rule, exports.sequence.extract(firstCapture));
    };
    rule.map = function(func) {
        return exports.then(rule, function(result) {
            return func.apply(this, result.toArray());
        });
    };
    function isCapturedRule(subRule) {
        return subRule.isCaptured;
    }
    return rule;
};
var SequenceValues = function(values, valuesArray) {
    this._values = values || {};
    this._valuesArray = valuesArray || [];
};
SequenceValues.prototype.withValue = function(rule, value) {
    if (rule.captureName && rule.captureName in this._values) {
        throw new Error("Cannot add second value for capture \"" + rule.captureName + "\"");
    } else {
        var newValues = _.clone(this._values);
        newValues[rule.captureName] = value;
        var newValuesArray = this._valuesArray.concat([
            value
        ]);
        return new SequenceValues(newValues, newValuesArray);
    }
};
SequenceValues.prototype.get = function(rule) {
    if (rule.captureName in this._values) {
        return this._values[rule.captureName];
    } else {
        throw new Error("No value for capture \"" + rule.captureName + "\"");
    }
};
SequenceValues.prototype.toArray = function() {
    return this._valuesArray;
};
exports.sequence.capture = function(rule, name) {
    var captureRule = function() {
        return rule.apply(this, arguments);
    };
    captureRule.captureName = name;
    captureRule.isCaptured = true;
    return captureRule;
};
exports.sequence.extract = function(rule) {
    return function(result) {
        return result.get(rule);
    };
};
exports.sequence.applyValues = function(func) {
    // TODO: check captureName doesn't conflict with source or other captures
    var rules = Array.prototype.slice.call(arguments, 1);
    return function(result) {
        var values = rules.map(function(rule) {
            return result.get(rule);
        });
        return func.apply(this, values);
    };
};
exports.sequence.source = {
    captureName: "☃source☃"
};
exports.sequence.cut = function() {
    return function(input) {
        return results.cut(input);
    };
};
exports.optional = function(rule) {
    return function(input) {
        var result = rule(input);
        if (result.isSuccess()) {
            return result.map(options.some);
        } else if (result.isFailure()) {
            return results.success(options.none, input);
        } else {
            return result;
        }
    };
};
exports.zeroOrMoreWithSeparator = function(rule, separator) {
    return repeatedWithSeparator(rule, separator, false);
};
exports.oneOrMoreWithSeparator = function(rule, separator) {
    return repeatedWithSeparator(rule, separator, true);
};
var zeroOrMore = exports.zeroOrMore = function(rule) {
    return function(input) {
        var values = [];
        var result;
        while((result = rule(input)) && result.isSuccess()){
            input = result.remaining();
            values.push(result.value());
        }
        if (result.isError()) {
            return result;
        } else {
            return results.success(values, input);
        }
    };
};
exports.oneOrMore = function(rule) {
    return exports.oneOrMoreWithSeparator(rule, noOpRule);
};
function noOpRule(input) {
    return results.success(null, input);
}
var repeatedWithSeparator = function(rule, separator, isOneOrMore) {
    return function(input) {
        var result = rule(input);
        if (result.isSuccess()) {
            var mainRule = exports.sequence.capture(rule, "main");
            var remainingRule = zeroOrMore(exports.then(exports.sequence(separator, mainRule), exports.sequence.extract(mainRule)));
            var remainingResult = remainingRule(result.remaining());
            return results.success([
                result.value()
            ].concat(remainingResult.value()), remainingResult.remaining());
        } else if (isOneOrMore || result.isError()) {
            return result;
        } else {
            return results.success([], input);
        }
    };
};
exports.leftAssociative = function(leftRule, rightRule, func) {
    var rights;
    if (func) {
        rights = [
            {
                func: func,
                rule: rightRule
            }
        ];
    } else {
        rights = rightRule;
    }
    rights = rights.map(function(right) {
        return exports.then(right.rule, function(rightValue) {
            return function(leftValue, source) {
                return right.func(leftValue, rightValue, source);
            };
        });
    });
    var repeatedRule = exports.firstOf.apply(null, [
        "rules"
    ].concat(rights));
    return function(input) {
        var start = input;
        var leftResult = leftRule(input);
        if (!leftResult.isSuccess()) {
            return leftResult;
        }
        var repeatedResult = repeatedRule(leftResult.remaining());
        while(repeatedResult.isSuccess()){
            var remaining = repeatedResult.remaining();
            var source = start.to(repeatedResult.remaining());
            var right = repeatedResult.value();
            leftResult = results.success(right(leftResult.value(), source), remaining, source);
            repeatedResult = repeatedRule(leftResult.remaining());
        }
        if (repeatedResult.isError()) {
            return repeatedResult;
        }
        return leftResult;
    };
};
exports.leftAssociative.firstOf = function() {
    return Array.prototype.slice.call(arguments, 0);
};
exports.nonConsuming = function(rule) {
    return function(input) {
        return rule(input).changeRemaining(input);
    };
};
var describeToken = function(token) {
    if (token.value) {
        return token.name + " \"" + token.value + "\"";
    } else {
        return token.name;
    }
};
function describeTokenMismatch(input, expected) {
    var error;
    var token = input.head();
    if (token) {
        error = errors.error({
            expected: expected,
            actual: describeToken(token),
            location: token.source
        });
    } else {
        error = errors.error({
            expected: expected,
            actual: "end of tokens"
        });
    }
    return results.failure([
        error
    ], input);
}
}),
"[project]/node_modules/lop/lib/StringSource.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var StringSource = module.exports = function(string, description) {
    var self = {
        asString: function() {
            return string;
        },
        range: function(startIndex, endIndex) {
            return new StringSourceRange(string, description, startIndex, endIndex);
        }
    };
    return self;
};
var StringSourceRange = function(string, description, startIndex, endIndex) {
    this._string = string;
    this._description = description;
    this._startIndex = startIndex;
    this._endIndex = endIndex;
};
StringSourceRange.prototype.to = function(otherRange) {
    // TODO: Assert that tokens are the same across both iterators
    return new StringSourceRange(this._string, this._description, this._startIndex, otherRange._endIndex);
};
StringSourceRange.prototype.describe = function() {
    var position = this._position();
    var description = this._description ? this._description + "\n" : "";
    return description + "Line number: " + position.lineNumber + "\nCharacter number: " + position.characterNumber;
};
StringSourceRange.prototype.lineNumber = function() {
    return this._position().lineNumber;
};
StringSourceRange.prototype.characterNumber = function() {
    return this._position().characterNumber;
};
StringSourceRange.prototype._position = function() {
    var self = this;
    var index = 0;
    var nextNewLine = function() {
        return self._string.indexOf("\n", index);
    };
    var lineNumber = 1;
    while(nextNewLine() !== -1 && nextNewLine() < this._startIndex){
        index = nextNewLine() + 1;
        lineNumber += 1;
    }
    var characterNumber = this._startIndex - index + 1;
    return {
        lineNumber: lineNumber,
        characterNumber: characterNumber
    };
};
}),
"[project]/node_modules/lop/lib/Token.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = function(name, value, source) {
    this.name = name;
    this.value = value;
    if (source) {
        this.source = source;
    }
};
}),
"[project]/node_modules/lop/lib/bottom-up.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var rules = __turbopack_context__.r("[project]/node_modules/lop/lib/rules.js [app-route] (ecmascript)");
var results = __turbopack_context__.r("[project]/node_modules/lop/lib/parsing-results.js [app-route] (ecmascript)");
exports.parser = function(name, prefixRules, infixRuleBuilders) {
    var self = {
        rule: rule,
        leftAssociative: leftAssociative,
        rightAssociative: rightAssociative
    };
    var infixRules = new InfixRules(infixRuleBuilders.map(createInfixRule));
    var prefixRule = rules.firstOf(name, prefixRules);
    function createInfixRule(infixRuleBuilder) {
        return {
            name: infixRuleBuilder.name,
            rule: lazyRule(infixRuleBuilder.ruleBuilder.bind(null, self))
        };
    }
    function rule() {
        return createRule(infixRules);
    }
    function leftAssociative(name) {
        return createRule(infixRules.untilExclusive(name));
    }
    function rightAssociative(name) {
        return createRule(infixRules.untilInclusive(name));
    }
    function createRule(infixRules) {
        return apply.bind(null, infixRules);
    }
    function apply(infixRules, tokens) {
        var leftResult = prefixRule(tokens);
        if (leftResult.isSuccess()) {
            return infixRules.apply(leftResult);
        } else {
            return leftResult;
        }
    }
    return self;
};
function InfixRules(infixRules) {
    function untilExclusive(name) {
        return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name)));
    }
    function untilInclusive(name) {
        return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name) + 1));
    }
    function ruleNames() {
        return infixRules.map(function(rule) {
            return rule.name;
        });
    }
    function apply(leftResult) {
        var currentResult;
        var source;
        while(true){
            currentResult = applyToTokens(leftResult.remaining());
            if (currentResult.isSuccess()) {
                source = leftResult.source().to(currentResult.source());
                leftResult = results.success(currentResult.value()(leftResult.value(), source), currentResult.remaining(), source);
            } else if (currentResult.isFailure()) {
                return leftResult;
            } else {
                return currentResult;
            }
        }
    }
    function applyToTokens(tokens) {
        return rules.firstOf("infix", infixRules.map(function(infix) {
            return infix.rule;
        }))(tokens);
    }
    return {
        apply: apply,
        untilExclusive: untilExclusive,
        untilInclusive: untilInclusive
    };
}
exports.infix = function(name, ruleBuilder) {
    function map(func) {
        return exports.infix(name, function(parser) {
            var rule = ruleBuilder(parser);
            return function(tokens) {
                var result = rule(tokens);
                return result.map(function(right) {
                    return function(left, source) {
                        return func(left, right, source);
                    };
                });
            };
        });
    }
    return {
        name: name,
        ruleBuilder: ruleBuilder,
        map: map
    };
};
// TODO: move into a sensible place and remove duplication
var lazyRule = function(ruleBuilder) {
    var rule;
    return function(input) {
        if (!rule) {
            rule = ruleBuilder();
        }
        return rule(input);
    };
};
}),
"[project]/node_modules/lop/lib/regex-tokeniser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

var Token = __turbopack_context__.r("[project]/node_modules/lop/lib/Token.js [app-route] (ecmascript)");
var StringSource = __turbopack_context__.r("[project]/node_modules/lop/lib/StringSource.js [app-route] (ecmascript)");
exports.RegexTokeniser = RegexTokeniser;
function RegexTokeniser(rules) {
    rules = rules.map(function(rule) {
        return {
            name: rule.name,
            regex: new RegExp(rule.regex.source, "g")
        };
    });
    function tokenise(input, description) {
        var source = new StringSource(input, description);
        var index = 0;
        var tokens = [];
        while(index < input.length){
            var result = readNextToken(input, index, source);
            index = result.endIndex;
            tokens.push(result.token);
        }
        tokens.push(endToken(input, source));
        return tokens;
    }
    function readNextToken(string, startIndex, source) {
        for(var i = 0; i < rules.length; i++){
            var regex = rules[i].regex;
            regex.lastIndex = startIndex;
            var result = regex.exec(string);
            if (result) {
                var endIndex = startIndex + result[0].length;
                if (result.index === startIndex && endIndex > startIndex) {
                    var value = result[1];
                    var token = new Token(rules[i].name, value, source.range(startIndex, endIndex));
                    return {
                        token: token,
                        endIndex: endIndex
                    };
                }
            }
        }
        var endIndex = startIndex + 1;
        var token = new Token("unrecognisedCharacter", string.substring(startIndex, endIndex), source.range(startIndex, endIndex));
        return {
            token: token,
            endIndex: endIndex
        };
    }
    function endToken(input, source) {
        return new Token("end", null, source.range(input.length, input.length));
    }
    return {
        tokenise: tokenise
    };
}
}),
"[project]/node_modules/lop/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

exports.Parser = __turbopack_context__.r("[project]/node_modules/lop/lib/parser.js [app-route] (ecmascript)").Parser;
exports.rules = __turbopack_context__.r("[project]/node_modules/lop/lib/rules.js [app-route] (ecmascript)");
exports.errors = __turbopack_context__.r("[project]/node_modules/lop/lib/errors.js [app-route] (ecmascript)");
exports.results = __turbopack_context__.r("[project]/node_modules/lop/lib/parsing-results.js [app-route] (ecmascript)");
exports.StringSource = __turbopack_context__.r("[project]/node_modules/lop/lib/StringSource.js [app-route] (ecmascript)");
exports.Token = __turbopack_context__.r("[project]/node_modules/lop/lib/Token.js [app-route] (ecmascript)");
exports.bottomUp = __turbopack_context__.r("[project]/node_modules/lop/lib/bottom-up.js [app-route] (ecmascript)");
exports.RegexTokeniser = __turbopack_context__.r("[project]/node_modules/lop/lib/regex-tokeniser.js [app-route] (ecmascript)").RegexTokeniser;
exports.rule = function(ruleBuilder) {
    var rule;
    return function(input) {
        if (!rule) {
            rule = ruleBuilder();
        }
        return rule(input);
    };
};
}),
"[project]/node_modules/option/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

exports.none = Object.create({
    value: function() {
        throw new Error('Called value on none');
    },
    isNone: function() {
        return true;
    },
    isSome: function() {
        return false;
    },
    map: function() {
        return exports.none;
    },
    flatMap: function() {
        return exports.none;
    },
    filter: function() {
        return exports.none;
    },
    toArray: function() {
        return [];
    },
    orElse: callOrReturn,
    valueOrElse: callOrReturn
});
function callOrReturn(value) {
    if (typeof value == "function") {
        return value();
    } else {
        return value;
    }
}
exports.some = function(value) {
    return new Some(value);
};
var Some = function(value) {
    this._value = value;
};
Some.prototype.value = function() {
    return this._value;
};
Some.prototype.isNone = function() {
    return false;
};
Some.prototype.isSome = function() {
    return true;
};
Some.prototype.map = function(func) {
    return new Some(func(this._value));
};
Some.prototype.flatMap = function(func) {
    return func(this._value);
};
Some.prototype.filter = function(predicate) {
    return predicate(this._value) ? this : exports.none;
};
Some.prototype.toArray = function() {
    return [
        this._value
    ];
};
Some.prototype.orElse = function(value) {
    return this;
};
Some.prototype.valueOrElse = function(value) {
    return this._value;
};
exports.isOption = function(value) {
    return value === exports.none || value instanceof Some;
};
exports.fromNullable = function(value) {
    if (value == null) {
        return exports.none;
    }
    return new Some(value);
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a015d718._.js.map