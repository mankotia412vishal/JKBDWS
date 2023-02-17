'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stopInspect = exports.startInspect = undefined;

var _chromeExtMessenger = __webpack_require__(1);

var _chromeExtMessenger2 = _interopRequireDefault(_chromeExtMessenger);

var _messages = __webpack_require__(2);

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var messenger = new _chromeExtMessenger2.default();
var connection = messenger.initConnection('content_script', 'inspect');

var $inspectedElement = null;

function onMouseOver() {
    var $this = $(this);

    // Ignore parents inspection, only add it to bottom level child.
    if ($this.has('.restylerInspect').length > 0) {
        $this.removeClass('restylerInspect');
    } else {
        $inspectedElement = $this;
        $inspectedElement.addClass('restylerInspect');
    }
}

function onMouseOut() {
    $(this).removeClass('restylerInspect');
}

function onInspectClick(e) {
    // NOTE: Disable the actual click, seems to work but not 100% sure :)
    e.preventDefault();
    e.stopImmediatePropagation();

    var getInspectValue = function getInspectValue($inspectedElement) {
        var retVal = '';

        retVal += $inspectedElement.prop('tagName');

        var id = $inspectedElement.attr('id');
        if (id) {
            retVal += '#' + id;
        }

        var classesStr = $inspectedElement[0].className;
        if (classesStr && typeof classesStr === 'string') {
            var classesArr = classesStr.split(/\s+/);
            classesArr.forEach(function(classStr) {
                retVal += '.' + classStr;
            });
        }

        return retVal;
    };

    if ($inspectedElement) {
        // We don't want our class name to be in the element path.
        $inspectedElement.removeClass('restylerInspect');

        connection.sendMessage('devtool:rules_adder', {
            name: _messages2.default.INSPECT_VALUE,
            value: getInspectValue($inspectedElement)
        });
    }

    // NOTE: stopping the inspection will also be done by the devtool
    // NOTE: so will apply to all other content scripts (iframes).
    stopInspect();
}

function startInspect() {
    $('*').not('body, html').on({
        mouseover: onMouseOver,
        mouseout: onMouseOut,
        click: onInspectClick
    });
}

function stopInspect() {
    $('*').not('body, html').off({
        mouseover: onMouseOver,
        mouseout: onMouseOut,
        click: onInspectClick
    });

    $('*').removeClass('restylerInspect');

    $inspectedElement = null;
}

exports.startInspect = startInspect;
exports.stopInspect = stopInspect;

//////////////////
// WEBPACK FOOTER
// ./src/extension/js/content_scripts/inspect.js
// module id = 3
// module chunks = 1