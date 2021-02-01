#!/usr/bin/env node

/* index.js
 * Main command script
 * Dependencies: yargs modules
 * Author: Joshua Carter
 * Created: January 31, 2021
 */
"use strict";
//import dependencies
import yargs from 'yargs';
// weird bug, trying fix
import "core-js/stable";
import "regenerator-runtime/runtime";
import { GameService } from './GameService.js';

// create new game service
const gameService = new GameService();
// init game service
const init = gameService.init();

async function play () {
    var result;
    try {
        // wait for intilaization
        await init;
        // once, done, play!
        result = await gameService.play();
    }
    catch (e) {
        console.error("Error!");
        console.error(e);
    }
    console.log();
    console.log();
    if (result) {
        console.log("WINNER!!!!!!!!!!!!!!!");
        console.log("Gussed word: ", gameService.hangmanString);
    }
    else {
        console.log("You lost.... sorry, better luck next time :(");
        console.log("Progress: ", gameService.hangmanString);
    }
}

function main (argv) {

}

main(yargs
    .scriptName("hangman")
    .usage('$0 <cmd> [args]')
    .command(
        '*',
        false,
        () => yargs.showHelp()
    )
    .command(
        "play",
        "Play hangman.",
        function () {},
        async argv => await play()
    )
    .version()
    .alias("version", "v")
    .help()
    .argv
);
