/* gulpfile.js
 * Glup task-runner configruation for project
 * Dependencies: dev-tasks, gulp, gulp-util modules
 * Author: Joshua Carter
 * Created: Janurary 31, 2021
 */
"use strict";
//include modules
var DevOps = require("dev-tasks"),
    fs = require("fs"),
    gulp = require("gulp"),
    log = require("fancy-log"),
    path = require("path"),
    Q = require("q");

//configure dev-tasks
DevOps.init({
    appName: 'node-api-skeleton',
    babelExtOptions: {
        "presets": ["@babel/preset-env"],
        "plugins": ["@babel/transform-runtime"]
    },
    gitCommitterName: 'NodeDevTasks',
    gitCommitterEmail: 'carter.joshua.603@gmail.com'
});



//default gulp task: documentation
gulp.task('default', function () {
    log(
`

Available Gulp Commands:
 - lint
 - build
 - release major|minor|patch
`
    );
});

//lint code using ESLint
gulp.task('lint', function (cb) {
    DevOps.lint();
    return cb();
});

//transpile code using babel
gulp.task('build', function () {
    //lint first
    DevOps.lint();
    return DevOps.build();
});

//create a new release and push it to master
gulp.task('release', function () {
    return DevOps.release();
});


//create dummy tasks so that we can use non-hyphentated arguments
var dummy = function (cb) {
        return cb();
    },
    dummies = ['patch', 'minor', 'major'];
for (let i=0; i<dummies.length; i++) {
    gulp.task(dummies[i], dummy);
}
