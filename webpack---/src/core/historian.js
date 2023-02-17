'use strict';

// NOTE: 'history' is a reserved word in javascript, hence 'historian'.

var rules = __webpack_require__(4);

var _undoStack;
var _redoStack;

function init() {
    _undoStack = [];
    _redoStack = [];
}

function getBackup() {
    // NOTE: Simple cloning that will not work for more complex objects.
    var clonedRules = JSON.parse(JSON.stringify(rules.getRules()));
    return clonedRules;
}

function addRedo() {
    _redoStack.push(getBackup());
}

function addUndo(backup, keepRedoStack) {
    _undoStack.push(backup);

    // Adding something undoable needs to clear all redos (unless specified otherwise).
    if (!keepRedoStack) {
        _redoStack = [];
    }
}

function wrapUndoable(wrappedMethod, methodArgs, keepRedoStack) {
    var backup = getBackup();
    wrappedMethod.apply(this, methodArgs);
    addUndo(backup, keepRedoStack);
}

function destroy() {
    _undoStack = null;
    _redoStack = null;
}

module.exports = {
    getUndoStack: function getUndoStack() {
        return _undoStack;
    },
    setUndoStack: function setUndoStack(undoStack) {
        _undoStack = undoStack;
    },
    getRedoStack: function getRedoStack() {
        return _redoStack;
    },
    setRedoStack: function setRedoStack(redoStack) {
        _redoStack = redoStack;
    },

    init: init,
    getBackup: getBackup,
    addRedo: addRedo,
    addUndo: addUndo,
    wrapUndoable: wrapUndoable,
    destroy: destroy
};

//////////////////
// WEBPACK FOOTER
// ./src/core/historian.js
// module id = 7
// module chunks = 2