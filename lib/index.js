"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHistory = void 0;

var _mlyn = require("mlyn");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var createHistory = function createHistory(subject$) {
  var past$ = (0, _mlyn.createSubject)([]);
  var blocked = (0, _mlyn.createBlock)();
  var future$ = (0, _mlyn.createSubject)([]);
  var c2hScope = (0, _mlyn.runInReactiveScope)(function () {
    var newValue = subject$();
    blocked(function () {
      future$([]); // @ts-ignore

      past$([].concat(_toConsumableArray(past$.__value), [newValue]));
    });
  });
  var h2cScope = (0, _mlyn.runInReactiveScope)(function () {
    var history = past$();
    blocked(function () {
      return subject$(history[history.length - 1]);
    });
  });

  var jumpTo = function jumpTo(index) {
    // @ts-ignore
    var history = past$.__value;

    if (index < history.length) {
      var past = history.slice(0, index);
      var futureItems = history.slice(index);
      (0, _mlyn.batch)(function () {
        // @ts-ignore
        future$([].concat(_toConsumableArray(futureItems), _toConsumableArray(future$.__value)));
        past$(past);
      });
    } else {
      var prevFuture = future$();
      var futureIndex = index - history.length;

      var _past = [].concat(_toConsumableArray(history), _toConsumableArray(prevFuture.slice(0, futureIndex)));

      var future = _toConsumableArray(prevFuture.slice(futureIndex));

      (0, _mlyn.batch)(function () {
        past$(_past);
        future$(future);
      });
    }
  };

  var undo = function undo() {
    jumpTo(past$().length - 1);
  };

  var redo = function redo() {
    jumpTo(past$().length);
  };

  var canUndo$ = function canUndo$() {
    return past$().length > 1;
  };

  var canRedo$ = function canRedo$() {
    return future$().length > 0;
  };

  var reset = function reset() {
    (0, _mlyn.batch)(function () {
      past$([past$()[0]]);
      future$([]);
    });
  };

  var commit = function commit() {
    // @ts-ignore
    past$([past$.__value[past$.__value.length - 1]]);
  };

  return [{
    past$: past$,
    commit: commit,
    future$: future$,
    entries$: function entries$() {
      return [].concat(_toConsumableArray(past$()), _toConsumableArray(future$()));
    },
    canUndo$: canUndo$,
    canRedo$: canRedo$,
    reset: reset,
    redo: redo,
    undo: undo,
    jumpTo: jumpTo
  }, function () {
    return {
      destroy: function destroy() {
        c2hScope.destroy();
        h2cScope.destroy();
      }
    };
  }];
};

exports.createHistory = createHistory;