var gulp    = require('gulp');
var gutil   = require('gulp-util');
var scss    = require('gulp-sass');
var concat  = require('gulp-concat');
var fixPath = require('./libs/fixPath.js');
var path    = require('path');
var uglify  = require('gulp-uglify');
var minifyCss       = require('gulp-minify-css');
var rebaseUrls      = require('gulp-css-rebase-urls');
var gulpIf          = require('gulp-if');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jpegtran = require('imagemin-jpegtran');
var gifsicle = require('imagemin-gifsicle');

// config
var basePath, destPath;
basePath = destPath = '../../';

var scripts     = require('./config/scripts.js');
var scssFiles   = require('./config/scss.js');
var prod        = true;

// callback for watch files
function watchFiles (type, key, files) {
    gulp.watch(files, function() {
        if (type == 'script') {
            buildScriptFile(key, files);
        } else if (type == 'scss') {
            buildScssFile(key, files);
        }
    });
}

// build js files
function buildScriptFile(dest, files) {
    gutil.log('Building ' + files.length + ' js files to ' + dest);

    if (files.length) {
        gulp.src(files)
            .pipe(concat(path.basename(dest)))
            .pipe(gulpIf(prod, uglify()))
            .pipe(gulp.dest(path.dirname(destPath + dest)))
        ;
    }
}

// build scss files
function buildScssFile(dest, files) {
    gutil.log('Building ' + files.length + ' scss files to ' + dest);

    if (files.length) {
        gulp.src(files)
            .pipe(scss())
            .pipe(rebaseUrls({root: path.dirname(basePath + dest)}))
            .pipe(concat(path.basename(dest)))
            .pipe(gulpIf(prod, minifyCss()))
            .pipe(gulp.dest(path.dirname(destPath + dest)))
        ;
    }
}

// build scripts
gulp.task('scss', function() {
    gutil.log('Start building scss');
    for (key in scssFiles) {
        buildScssFile(key, fixPath(scssFiles[key], basePath));
    }
});

// build scripts
gulp.task('scripts', function() {
    gutil.log('Start building scripts');
    for (key in scripts) {
        buildScriptFile(key, fixPath(scripts[key], basePath));
    }
});

// default task
gulp.task('default', ['scripts', 'scss']);

// watch
gulp.task('watch', ['watch-scripts', 'watch-scss']);

// watch scripts
gulp.task('watch-scripts', ['scripts'], function() {
    // scripts
    for (key in scripts) {
        var files = fixPath(scripts[key], basePath);
        watchFiles ('script', key, files);
    }
});

// watch scss
gulp.task('watch-scss', ['scss'], function() {
    // scss
    for (key in scssFiles) {
        var files = fixPath(scssFiles[key], basePath);
        watchFiles ('scss', key, files);
    }
});

gulp.task('jpgs', function() {
    var dest = destPath+'wp-content/uploads/2015/10/';

    return gulp.src(dest+'*.{gif,jpg,png,svg}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant(), jpegtran(), gifsicle()]
        }))
        .pipe(gulp.dest(dest));
});

// prod build
gulp.task('set-prod', function() {
    prod = true;
});

gulp.task('prod', ['set-prod', 'default']);