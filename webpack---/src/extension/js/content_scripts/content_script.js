'use strict';

var _chromeExtMessenger = __webpack_require__(1);

var _chromeExtMessenger2 = _interopRequireDefault(_chromeExtMessenger);

var _messages = __webpack_require__(2);

var _messages2 = _interopRequireDefault(_messages);

var _inspect = __webpack_require__(3);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var messenger = new _chromeExtMessenger2.default(); //import {} from '../common/logWithDate.js';

var isRestylerReady = false;
var isTopPage = void 0;
try {
    isTopPage = window.self === window.top;
} catch (e) {
    isTopPage = false;
}

Restyler.init();

var messageHandler = function messageHandler(message, from, sender, sendResponse) {
    //console.log('content_script messageHandler()', arguments);

    if (message.name === _messages2.default.ACTION) {
        // Check that we are ready to receive action messages...
        if (isRestylerReady) {
            //console.log('[got message from extension]', message);

            if (message.method) {
                applyRestylerMethod(message.method, message.arguments);
            }

            // Let only the top window (not iframes) return the responses.
            if (isTopPage) {
                sendResponse({
                    rules: Restyler.getRules(),
                    isEnabled: Restyler.isEnabled()
                });
            }
        }
    } else if (message.name === _messages2.default.START_INSPECT) {
        (0, _inspect.startInspect)();
    } else if (message.name === _messages2.default.STOP_INSPECT) {
        (0, _inspect.stopInspect)();
    }

    // Messages that only the top page should handle (not iframes).
    if (isTopPage) {
        if (message.name === _messages2.default.IS_RESTYLER_READY) {
            sendResponse(isRestylerReady);
        }
    }
};

var connection = messenger.initConnection('main', messageHandler);

// Passing through the background page because devtool window might be closed
// and we won't know because no response will be sent.
connection.sendMessage('background:main', {
    name: _messages2.default.GET_CURRENT_STATE
}).then(function(response) {
    //console.log('content_script getCurrentState response', arguments);

    Restyler.setRules(response.rules);
    if (response.enabled) {
        Restyler.applyAll();
    } else {
        Restyler.disableAll();
    }

    if (response.textEditingEnabled) {
        Restyler.enableTextEditing();
    }

    // Set 'ready' and if we are the top page, send the 'restylerReady' event.
    isRestylerReady = true;
    if (isTopPage) {
        connection.sendMessage('devtool:main', {
            name: _messages2.default.RESTYLER_READY
        });
    }
});

var applyRestylerMethod = function applyRestylerMethod(method, args) {
    if (typeof Restyler[method] === 'function') {
        Restyler[method].apply(null, args);
    } else {
        throw new Error('Error - no method exists in Restyler: ' + method);
    }
};

//////////////////
// WEBPACK FOOTER
// ./src/extension/js/content_scripts/content_script.js
// module id = 0
// module chunks = 1