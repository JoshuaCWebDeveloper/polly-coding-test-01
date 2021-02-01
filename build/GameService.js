/* GameService.js
 * Interacts with the game API
 * Dependencies: modules, services, classes, utils
 * Author: Joshua Carter
 * Created: January 1, 2021
 */
"use strict"; //import dependencies

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameService = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _util = _interopRequireDefault(require("util"));

var _utils = require("./utils.js");

require("core-js/stable");

require("regenerator-runtime/runtime");

// weird bug, trying fix
//create our GameService class
var GameService = /*#__PURE__*/function () {
  function GameService() {
    (0, _classCallCheck2["default"])(this, GameService);
    // store config
    this.MAX_INCORRECT = 6;
    this.HANGMAN_API_ROOT = "https://hangman-api.herokuapp.com";
    this.UNDERSCORE = "_";
    this.wordsPath = _path["default"].join(__dirname, '..', 'resources', 'words.txt'); // store empty leter frequency map

    this.emptyLetterFrequencies = Object.fromEntries("abcdefghijklmnopqrstuvwxyz".split("").map(function (it) {
      return [it, [it, 0]];
    })); // init session data

    this.__initData();
  }

  (0, _createClass2["default"])(GameService, [{
    key: "log",
    value: function log() {
      _utils.log.apply(void 0, arguments);
    }
  }, {
    key: "__initData",
    value: function __initData() {
      // load the words file
      this.wordsList = []; // the game token to be used on the next request

      this.gameToken = ""; // current hangman string

      this.hangmanString = ""; // track guessed letters (both correct and incorrect)

      this.guessedLetters = []; // track number of incorrect guesses

      this.incorrectGuesses = 0;
    }
  }, {
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var _this = this;

        var _ref,
            _ref$reloadWords,
            reloadWords,
            initChain,
            loadWords,
            gameRequest,
            _args = arguments;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref$reloadWords = _ref.reloadWords, reloadWords = _ref$reloadWords === void 0 ? false : _ref$reloadWords;

                // re-init session data
                this.__initData(); // init promise chain


                initChain = []; // load the words into memory

                if (this.wordsList.length <= 0 || reloadWords) {
                  loadWords = _util["default"].promisify(_fs["default"].readFile)(this.wordsPath).then(function (data) {
                    _this.wordsList = data.toString().split("\n");
                  });
                  initChain.push(loadWords);
                } // make request to game API


                gameRequest = (0, _utils.fetch)("".concat(this.HANGMAN_API_ROOT, "/hangman"), {
                  method: 'POST'
                }).then(function (response) {
                  return response.json();
                }).then(function (json) {
                  // store session info
                  _this.hangmanString = json.hangman_string;
                  _this.gameToken = json.token;
                });
                initChain.push(gameRequest); // wait for all tasks to complete

                return _context.abrupt("return", Promise.all(initChain));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "__makeGuess",
    value: function () {
      var _makeGuess = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(letter) {
        var _this2 = this;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", (0, _utils.fetch)("".concat(this.HANGMAN_API_ROOT, "/hangman"), {
                  method: 'PUT',
                  body: encodeURIComponent(JSON.stringify({
                    token: this.gameToken,
                    letter: letter
                  }))
                }).then(function (response) {
                  return response.json();
                }).then(function (json) {
                  // update session info
                  _this2.hangmanString = json.hangman_string;
                  _this2.gameToken = json.token; // if this guess was incorrect

                  if (!json.correct) {
                    // track incorrect guess
                    _this2.incorrectGuesses++;
                  } // return correctness of guess


                  return json.correct;
                }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function __makeGuess(_x) {
        return _makeGuess.apply(this, arguments);
      }

      return __makeGuess;
    }() // filter words using callback
    // return filtered words and letter frequences

  }, {
    key: "__filterWords",
    value: function __filterWords(words, cb) {
      // start by filtering our list based on word length
      // also, track frequencies of letters
      var frequencies = Object.assign({}, this.emptyLetterFrequencies);
      var words = words.filter(function (word) {
        var keep = cb(word);

        if (keep) {
          // track letter frequency of word
          for (var i = 0; i < word.length; i++) {
            frequencies[word[i]][1]++;
          }
        }

        return keep;
      }); // sort letter frequencies

      var frequencies = Object.values(frequencies).sort(function (a, b) {
        return b[1] - a[1];
      });
      return {
        words: words,
        frequencies: frequencies
      };
    } // filter our words by our current hangman string
    // return letter frequencies

  }, {
    key: "__filterWordsByHangman",
    value: function __filterWordsByHangman(words) {
      // create regular expression to match against hangman string
      var re = new RegExp("^" + this.hangmanString.replace(this.UNDERSCORE, ".") + "$", "i");
      return this.__filterWords(words, function (it) {
        return re.match(it);
      });
    } // remove all words not matching letter

  }, {
    key: "__filterWordsByLetter",
    value: function __filterWordsByLetter(words, letter) {
      return this.__filterWords(words, function (it) {
        return it.includes(letter);
      });
    }
  }, {
    key: "__checkWin",
    value: function __checkWin() {
      return !this.hangmanString.includes(this.UNDERSCORE);
    }
  }, {
    key: "__checkLoss",
    value: function __checkLoss() {
      return this.incorrectGuesses >= this.MAX_INCORRECT;
    } // keep guessing until we have either won or lost
    // returns boolean

  }, {
    key: "__guessToWin",
    value: function () {
      var _guessToWin = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(words, frequencies) {
        var guess, correct, _this$__filterWordsBy, _this$__filterWordsBy2;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // make a guess
                guess = frequencies[0][0];
                (0, _utils.log)("Guessing letter: ".concat(guess));
                _context3.next = 4;
                return this.__makeGuess(guess);

              case 4:
                correct = _context3.sent;

                // if our guess was correct
                if (correct) {
                  this.log("Guess was correct!");
                  _this$__filterWordsBy = this.__filterWordsByHangman(words);
                  words = _this$__filterWordsBy.words;
                  frequencies = _this$__filterWordsBy.frequencies;
                } else {
                  this.log("Guess was NOT correct :(");
                  _this$__filterWordsBy2 = this.__filterWordsByLetter(words, guess);
                  words = _this$__filterWordsBy2.words;
                  frequencies = _this$__filterWordsBy2.frequencies;
                } // if we have won


                if (!this.__checkWin()) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return", true);

              case 8:
                if (!this.__checkLoss()) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt("return", false);

              case 10:
                return _context3.abrupt("return", this.__guessToWin(words, frequencies));

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function __guessToWin(_x2, _x3) {
        return _guessToWin.apply(this, arguments);
      }

      return __guessToWin;
    }()
  }, {
    key: "play",
    value: function () {
      var _play = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var _this3 = this;

        var _this$__filterWords, words, frequencies;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // start by filtering our list based on word length
                // also, track frequencies of letters
                _this$__filterWords = this.__filterWords(this.wordsList, function (it) {
                  return it.length == _this3.hangmanString.length;
                }), words = _this$__filterWords.words, frequencies = _this$__filterWords.frequencies; // guess until we have won, return result

                return _context4.abrupt("return", this.__guessToWin(words, frequencies));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function play() {
        return _play.apply(this, arguments);
      }

      return play;
    }()
  }]);
  return GameService;
}();

exports.GameService = GameService;
; //export GameService class