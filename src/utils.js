/* utils.js
 * Utility methods
 * Dependencies: node-fetch modules, services, classes
 * Author: Joshua Carter
 * Created: February 1, 2021
 */
"use strict";
//import dependencies
import fetch from 'node-fetch';

// fetch wrapper that rejects failed requests
async function fetchFail (...args) {
    return fetch(...args).then(res => {
        if (!res.status || res.status < 100 || res.status >= 400) {
            throw res;
        }
        return res;
    });
}

function log (obj, level="log") {
    console[level](obj);
}

export { fetchFail as fetch, log };
