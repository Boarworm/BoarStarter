// start CUSTOM

// var gulp = require('gulp');
// var $    = require('gulp-load-plugins')();

var gulp = require('gulp'),
    fileinclude = require('gulp-file-include'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync'),
    image = require('gulp-image'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    postCss = require('gulp-postcss'),
    autoPrefixer = require('autoprefixer'),
    discardComments = require('postcss-discard-comments'),
    postcssSorting = require('postcss-sorting'),
    // realFavicon = require('gulp-real-favicon'),
    rename = require('gulp-rename'),
    twig = require('gulp-twig'),
    data = require('gulp-data'),
    fs = require('fs'),
    path = require('path'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps');

//
// //     gutil          = require('gulp-util' ),
// //     concat         = require('gulp-concat'),
// //     uglify         = require('gulp-uglify'),
// //     cleanCSS       = require('gulp-clean-css'),
// //     rename         = require('gulp-rename'),
// //     del            = require('del'),
// //     imagemin       = require('gulp-imagemin'),
// //     cache          = require('gulp-cache'),
// //     autoprefixer   = require('gulp-autoprefixer'),
// //     ftp            = require('vinyl-ftp'),
// //     notify         = require("gulp-notify"),
// //     rsync          = require('gulp-rsync'),

// gulp.task('twig-pages', function () {
//     'use strict';
//
//     return gulp.src('src/pages/**/*.twig')
//         .pipe(data(function(file) {
//              var dir = path.dirname(file.path);
//              var datapath = dir+"/data.json";
//             // console.log(dir);
//             // console.log(datapath);
//             if (fs.existsSync(datapath)) {
//                 return JSON.parse(
//                     fs.readFileSync(datapath)
//                 );
//             }
//         }))
//         .pipe(twig({
//         //     errorLogToConsole:true
//         //     // data: {
//         //     //     title: 'Gulp and Twig',
//         //     //     benefits: [
//         //     //         'Fast',
//         //     //         'Flexible',
//         //     //         'Secure'
//         //     //     ]
//         //     // }
//         }))
//         .pipe(gulp.dest('dist/pages/'));
// });

// ---------------------------------------------------
// Configs
// ---------------------------------------------------
var paths = {
    styles: {
        srcComponents: 'src/components/**/*.scss',
        srcStatic: 'src/static/scss/**/*.scss',
        srcEntry: 'src/static/scss/entry.scss',
        srcAll: ['src/components/**/*.scss','src/static/scss/**/*.scss'],
        dist: 'dist/css/',
        opts: {}
    },
    scripts: {
        srcComponents: 'src/components/**/*.js',
        srcStatic: 'src/static/js/**/*.js',
        srcAll : ['src/components/**/*.js','src/static/js/**/*.js'],
        dist : 'dist/js/',
    },
    html: {
        srcComponents: 'src/components/**/*.pug',
        srcPages: 'src/pages/*.pug',
        dist: 'dist/'
    },
    images: {
        src: ['src/static/img/**/*'],
        dist: 'dist/img'
    },
    fonts: {
        srcAll: ['src/static/fonts/**/*','node_modules/font-awesome/fonts/*'],
        dist: 'dist/fonts'
    },
    misc: {
        src: ['src/static/misc/**/*'],
        dist: 'dist/'
    },
    browsersync: {
        dist: 'dist/'
    }
};
// ---------------------------------------------------
// JS
// ---------------------------------------------------
gulp.task('js:compile', function () {
    //console.log('Running js:compile...');
    return gulp.src([paths.scripts.srcComponents,paths.scripts.srcStatic])
    // .pipe(changed('dist/js/'))
        .pipe(concat("scripts.js"))
        .pipe(gulp.dest(paths.scripts.dist))
        .pipe(browserSync.reload({stream: true}))
});
// ---------------------------------------------------
// Scss
// ---------------------------------------------------
var processors = [
    discardComments(),
    autoPrefixer({browsers: ['last 2 versions', 'ios_saf <= 7', 'ie <=10']}),
    postcssSorting({"properties-order": "alphabetical"})
    // cssnano()
];
gulp.task('css:compile', function () {
    //console.log('Running css:compile...');
    return gulp.src(paths.styles.srcEntry)
    // .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on("error", sass.logError))
    .pipe(concat('style.css'))
    .pipe(postCss(processors))
    // .pipe(sourcemaps.write())
    //.pipe(rename({suffix: '.min', prefix: ''}))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(browserSync.reload({stream: true}));
});
// ---------------------------------------------------
// Fonts
// ---------------------------------------------------
gulp.task('fonts:copy', function () {
    //console.log('Running fonts:copy...');
    return gulp.src(paths.fonts.srcAll)
        .pipe(changed(paths.fonts.dist))
        .pipe(gulp.dest(paths.fonts.dist));
});
// ---------------------------------------------------
// Misc
// ---------------------------------------------------
gulp.task('misc:copy', function () {
    //console.log('Running misc:copy...');
    return gulp.src(paths.misc.src)
        .pipe(changed(paths.misc.dist))
        .pipe(gulp.dest(paths.misc.dist));
});
// ---------------------------------------------------
// Pug
// ---------------------------------------------------
gulp.task('html:compile', function () {
    //console.log('Running html:compile...');
    return gulp.src([paths.html.srcPages])
            .pipe(data(function(file) {
                var datapath = 'src/pages/data.json';
                if (fs.existsSync(datapath)) {
                    return JSON.parse(
                        fs.readFileSync(datapath)
                   );
                }
            }))
        .pipe(pug())
        .pipe(gulp.dest(paths.html.dist))
        .pipe(browserSync.reload({stream: true}));
});
// ---------------------------------------------------
// Img compress and copy
// ---------------------------------------------------
gulp.task('img:compress', function () {
    return gulp.src(paths.images.src)
        .pipe(changed(paths.images.dist))
        .pipe(image())
        .pipe(gulp.dest(paths.images.dist));
});
// ---------------------------------------------------
// Browsersync
// ---------------------------------------------------
gulp.task('browser-sync', function(cb) {
    browserSync({
        server: {
            baseDir: paths.browsersync.dist,
            directory: true
        },
        //port: 4000,
        notify: true,
        open: false
    }, cb);
});
// ---------------------------------------------------
// Clean Dist folder
// ---------------------------------------------------
gulp.task('clean', function(cb) {
    //console.log('Running clean dist...');
    del(['dist'], cb);
});
// ---------------------------------------------------
// Watch
// ---------------------------------------------------
gulp.task('watch', function () {
    //console.log('Running watch...');
    gulp.watch(paths.styles.srcAll, {interval: 1000, usePolling: true}, gulp.series('css:compile'));
    gulp.watch([paths.html.srcComponents,paths.html.srcPages], {interval: 1000, usePolling: true}, gulp.series('html:compile'));
    gulp.watch(paths.scripts.srcAll, {interval: 1000, usePolling: true}, gulp.series('js:compile'));
    gulp.watch(paths.images.src, {interval: 1000, usePolling: true}, gulp.series('img:compress'));
    gulp.watch(paths.fonts.srcAll, {interval: 1000, usePolling: true}, gulp.series('fonts:copy'));
    gulp.watch(paths.misc.src, {interval: 1000, usePolling: true}, gulp.series('misc:copy'));
});
// ---------------------------------------------------
// Default
// ---------------------------------------------------
gulp.task('default', gulp.series(
    'css:compile',
    'html:compile',
    'js:compile',
    'fonts:copy',
    'img:compress',
    'misc:copy',
    'browser-sync',
    gulp.parallel('watch')
));