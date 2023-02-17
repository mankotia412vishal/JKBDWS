'use strict';

var _rules = [];

function getRule(id) {
    var rule = null;
    for (var i = 0; i < _rules.length; i++) {
        if (_rules[i].id === id) {
            rule = _rules[i];
            break;
        }
    }

    if (!rule) {
        throw new Error('could not find rule with id: ' + id);
    }

    return rule;
}

function add(id, attr, origVal, newVal, options, isPreview) {
    options = options || {};

    var rule = {
        id: id,
        attr: attr,
        origVal: origVal,
        newVal: newVal,
        options: options,
        isPreview: isPreview
    };

    _rules.push(rule);
}

function remove(id) {
    var origRulesLength = _rules.length;

    for (var i = 0; i < _rules.length; i++) {
        if (_rules[i].id === id) {
            _rules.splice(i, 1);
            break;
        }
    }

    if (origRulesLength === _rules.length) {
        throw new Error('could not find rule to remove with id: ' + id);
    }
}

function disable(id) {
    var rule = getRule(id);
    rule.options.enabled = false;
}

function enable(id) {
    var rule = getRule(id);
    rule.options.enabled = true;
}

function reset() {
    _rules = [];
}

module.exports = {
    getRules: function getRules(includePreview) {
        if (includePreview) {
            return _rules;
        } else {
            return _rules.filter(function(rule) {
                return !rule.isPreview;
            });
        }
    },
    setRules: function setRules(rules) {
        _rules = rules;
    },

    add: add,
    remove: remove,
    disable: disable,
    enable: enable,
    reset: reset
};

//////////////////
// WEBPACK FOOTER
// ./src/core/rules.js
// module id = 4
// module chunks = 2