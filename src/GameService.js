/* GameService.js
 * Interacts with the game API
 * Dependencies: modules, services, classes, utils
 * Author: Joshua Carter
 * Created: January 1, 2021
 */
"use strict";
//import dependencies
import fs from 'fs';
import path from 'path';
import util from 'util';
import { fetch, log }  from './utils.js';
// weird bug, trying fix
import "core-js/stable";
import "regenerator-runtime/runtime";
//create our GameService class
class GameService {
    
    constructor () {
        // store config
        this.MAX_INCORRECT = 6;
        this.HANGMAN_API_ROOT = "https://hangman-api.herokuapp.com";
        this.UNDERSCORE = "_";
        this.wordsPath = path.join(__dirname, '..', 'resources', 'words.txt');
        // store empty leter frequency map
        this.emptyLetterFrequencies = Object.fromEntries(
            "abcdefghijklmnopqrstuvwxyz".split("").map(it => [it, [it, 0]])
        );
        // init session data
        this.__initData(); 
    }
    
    log (...args) {
        log(...args);
    }
    
    __initData () {
        // load the words file
        this.wordsList = [];
        // the game token to be used on the next request
        this.gameToken = "";
        // current hangman string
        this.hangmanString = "";
        // track guessed letters (both correct and incorrect)
        this.guessedLetters = [];
        // track number of incorrect guesses
        this.incorrectGuesses = 0;
    }
    
    async init ({reloadWords=false} = {}) {
        // re-init session data
        this.__initData();
        // init promise chain
        const initChain = [];
        // load the words into memory
        if (this.wordsList.length <= 0 || reloadWords) {
            const loadWords = util.promisify(fs.readFile)(this.wordsPath)
                .then(data => {
                    this.wordsList = data.toString().split("\n");
                });
            initChain.push(loadWords);
        }
        // make request to game API
        const gameRequest = fetch(`${this.HANGMAN_API_ROOT}/hangman`, {
            method: 'POST'
        }).then(response => {
            return response.json();
        }).then(json => {
            // store session info
            this.hangmanString = json.hangman_string;
            this.gameToken = json.token;
        });
        initChain.push(gameRequest);
        // wait for all tasks to complete
        return Promise.all(initChain);
    }
    
    async __makeGuess (letter) {
        // make request to game API
        return fetch(`${this.HANGMAN_API_ROOT}/hangman`, {
            method: 'PUT',
            body: encodeURIComponent(JSON.stringify({
                token: this.gameToken,
                letter
            }))
        }).then(response => {
            return response.json();
        }).then(json => {
            // update session info
            this.hangmanString = json.hangman_string;
            this.gameToken = json.token;
            // if this guess was incorrect
            if (!json.correct) {
                // track incorrect guess
                this.incorrectGuesses++;
            }
            // return correctness of guess
            return json.correct;
        });
    }
    
    // filter words using callback
    // return filtered words and letter frequences
    __filterWords (words, cb) {
        // start by filtering our list based on word length
        // also, track frequencies of letters
        var frequencies = Object.assign({}, this.emptyLetterFrequencies);
        var words = words.filter(word => {
            var keep = cb(word);
            if (keep) {
                // track letter frequency of word
                for (let i=0; i<word.length; i++) {
                    frequencies[word[i]][1]++;
                }
            }
            return keep;
        });
        // sort letter frequencies
        var frequencies = Object.values(frequencies)
            .sort((a, b) => b[1] - a[1]);
        return {words, frequencies};
    }
    
    // filter our words by our current hangman string
    // return letter frequencies
    __filterWordsByHangman (words) {
        // create regular expression to match against hangman string
        const re = new RegExp(
            "^" + this.hangmanString.replace(this.UNDERSCORE, ".") + "$", "i"
        );
        return this.__filterWords(
            words,
            it => re.match(it)
        );
    }
    
    // remove all words not matching letter
    __filterWordsByLetter (words, letter) {
        return this.__filterWords(
            words,
            it => !it.includes(letter)
        );
    }
    
    __checkWin () {
        return !this.hangmanString.includes(this.UNDERSCORE);
    }
    
    __checkLoss () {
        return this.incorrectGuesses >= this.MAX_INCORRECT;
    }
    
    // keep guessing until we have either won or lost
    // returns boolean
    async __guessToWin (words, frequencies) {
        // make a guess
        const guess = frequencies[0][0];
        log(`Guessing letter: ${guess}`);
        var correct =  await this.__makeGuess(guess);
        var words, frequencies;
        // if our guess was correct
        if (correct) {
            this.log(`Guess was correct!`);
            ({words, frequencies} = this.__filterWordsByHangman(words));
        }
        else {
            this.log(`Guess was NOT correct :(`);
            ({words, frequencies} = this.__filterWordsByLetter(words, guess));
        }
        // if we have won
        if (this.__checkWin()) {
            return true;
        }
        // if we have lost
        if (this.__checkLoss()) {
            return false;
        }
        // else, we are still playing, recur
        return this.__guessToWin(words, frequencies);
    }
    
    async play () {
        // start by filtering our list based on word length
        // also, track frequencies of letters
        var {words, frequencies} = this.__filterWords(
            this.wordsList,
            it => it.length == this.hangmanString.length
        );
        // guess until we have won, return result
        return this.__guessToWin(words, frequencies); 
    }
    
};
//export GameService class
export { GameService };
