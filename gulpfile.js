var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    path = require('path'),
    url = require('gulp-css-url-adjuster'),
    autoprefixer = require('autoprefixer-core'),
    postcss = require('gulp-postcss');




// Make a folder for the build files
var params = {
        out: 'public/',
        htmlSrc: 'index.potter.html',
        levels: ['common.blocks', 'potter.blocks']
    },

    // A script which collects 2 declaration levels of index.html
    getFileNames = require('html2bl').getFileNames(params);


// A list of tasks

// A task for inititalizing the server
gulp.task('default', ['server', 'build']);

// Build task for html, css, images, js
gulp.task('build', ['html', 'css', 'images', 'js']);

gulp.task('server', function() {

    // Is the server directory where server is initiated
    browserSync.init({
        server: params.out
    });

    // Watch the change in all html files
    gulp.watch('*.html', ['html']);

    gulp.watch(params.levels.map(function(level) {
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['css']);

    gulp.watch(params.levels.map(function(level) {
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['js']);
});





// Initiate the task to build html and css simultaneously

gulp.task('html', function() {
    gulp.src(params.htmlSrc)
        .pipe(rename('index.html'))
        .pipe(gulp.dest(params.out))
        .pipe(reload({ stream: true }));
});

gulp.task('css', function() {
    getFileNames.then(function(files) {
        return gulp.src(files.css)
            .pipe(concat('styles.css'))
            .pipe(url({
                prepend: 'images/'
            }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(params.out))
            .pipe(reload({ stream: true }));
    })

    // To make the script work only once at the loading

        .done();

    // Was used before we build plugin that runs through required files

    // gulp.src(['common.blocks/**/*.css', 'pink.blocks/**/*.css'])
    //.pipe(concat('styles.css'))
    //....

});

// Task for changing images directory name according to build page directory images, and put them into build images directory


gulp.task('images', function() {
    getFileNames.then(function(src) {
        gulp.src(src.dirs.map(function(dirName) {
            var imgGlob = path.resolve(dirName) + '/*.{jpg,png,svg}';
            console.log(imgGlob);
            return imgGlob;
        }))
            .pipe(gulp.dest(path.join(params.out + '/images/')));
    })

    // To make the script works only once at the loading
        .done();
});

// Task for building js

gulp.task('js', function() {
    getFileNames.then(function(src) {

        // Use return here because we need to concat it in one file
        return src.dirs.map(function(dirName) {
            var jsGlob = path.resolve(dirName) + '/*.js';

            return jsGlob;
        });

    })

        .then(function(jsGlobs) {
            console.log(jsGlobs);
            gulp.src(jsGlobs)
                .pipe(concat('app.js'))
                .pipe(gulp.dest(params.out))
                .pipe(reload({ stream: true }));

        })



        .done();

});