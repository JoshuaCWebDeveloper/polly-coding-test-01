#!/usr/bin/env node

/* index.js
 * Main command script
 * Dependencies: yargs modules
 * Author: Joshua Carter
 * Created: January 31, 2021
 */
"use strict"; //import dependencies

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _yargs = _interopRequireDefault(require("yargs"));

require("core-js/stable");

require("regenerator-runtime/runtime");

var _GameService = require("./GameService.js");

// weird bug, trying fix
// create new game service
var gameService = new _GameService.GameService(); // init game service

var init = gameService.init();

function play() {
  return _play.apply(this, arguments);
}

function _play() {
  _play = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var result;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return init;

          case 3:
            _context2.next = 5;
            return gameService.play();

          case 5:
            result = _context2.sent;
            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            console.error("Error!");
            console.error(_context2.t0);

          case 12:
            console.log();
            console.log();

            if (result) {
              console.log("WINNER!!!!!!!!!!!!!!!");
              console.log("Gussed word: ", gameService.hangmanString);
            } else {
              console.log("You lost.... sorry, better luck next time :(");
              console.log("Progress: ", gameService.hangmanString);
            }

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));
  return _play.apply(this, arguments);
}

function main(argv) {}

main(_yargs["default"].scriptName("hangman").usage('$0 <cmd> [args]').command('*', false, function () {
  return _yargs["default"].showHelp();
}).command("play", "Play hangman.", function () {}, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(argv) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return play();

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).version().alias("version", "v").help().argv);