// start CUSTOM
var gulp = require('gulp'),
    fileinclude = require('gulp-file-include'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    image = require('gulp-image'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    postCss = require('gulp-postcss'),
    autoPrefixer = require('autoprefixer'),
    discardComments = require('postcss-discard-comments'),
    postcssSorting = require('postcss-sorting'),
    realFavicon = require('gulp-real-favicon'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps');


//     gutil          = require('gulp-util' ),
//     concat         = require('gulp-concat'),
//     uglify         = require('gulp-uglify'),
//     cleanCSS       = require('gulp-clean-css'),
//     rename         = require('gulp-rename'),
//     del            = require('del'),
//     imagemin       = require('gulp-imagemin'),
//     cache          = require('gulp-cache'),
//     autoprefixer   = require('gulp-autoprefixer'),
//     ftp            = require('vinyl-ftp'),
//     notify         = require("gulp-notify"),
//     rsync          = require('gulp-rsync'),
// bem     = require('gulp-bem');
// end CUSTOM

// var gulp = require('gulp');
// var $    = require('gulp-load-plugins')();


// gulp.task('default', ['sass'], function () {
//     gulp.watch(['scss/**/*.scss'], ['sass']);
// });


// ---------------------------------------------------
// Scss
// ---------------------------------------------------
var processors = [
    discardComments(),
    autoPrefixer({browsers: ['last 2 versions', 'ios_saf <= 7', 'ie <=10']}),
    postcssSorting({"properties-order": "alphabetical"})
    // cssnano()
];

// gulp.task('scss-blocks', function () {
//     return gulp.src('src/blocks/**/*.scss')
//         .pipe(sourcemaps.init())
//         .pipe(sass({outputStyle: 'compact'}).on("error", sass.logError))
//         //.pipe(rename({suffix: '.min', prefix: ''}))
//         .pipe(changed('dist/blocks/'))
//         .pipe(postCss(processors))
//         .pipe(sourcemaps.write())
//         //.pipe(cleanCSS()) // Опционально, закомментировать при отладке
//         .pipe(gulp.dest('dist/blocks/'))
//         .pipe(browserSync.reload({stream: true}));
// });
gulp.task('scss-style', function () {

    return gulp.src('src/blocks/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on("error", sass.logError))
        .pipe(concat('style.css'))
        .pipe(postCss(processors))
        .pipe(sourcemaps.write())
        //.pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.reload({stream: true}));
});
// ---------------------------------------------------
// Foundation
// ---------------------------------------------------
// var sassPaths = [
//     'bower_components/normalize.scss/sass',
//     'bower_components/foundation-sites/scss',
//     'bower_components/motion-ui/src'
// ];
gulp.task('foundation', function () {
    return gulp.src('scss/app.scss')
        .pipe(sass({
            // includePaths: sassPaths,
            outputStyle: 'compressed' // if css compressed **file size**
        }).on('error', sass.logError))
        .pipe(gulp.dest('dist/libs/'));
});
// ---------------------------------------------------
// File include
// ---------------------------------------------------
gulp.task('html-pages', function () {
    return gulp.src('src/pages/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/pages/'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('html-blocks', function () {
    return gulp.src('src/blocks/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/pages/'))
        .pipe(browserSync.reload({stream: true}));
});
// ---------------------------------------------------
// Fonts
// ---------------------------------------------------
gulp.task('fonts', function () {
    gulp.src('src/fonts')
        .pipe(changed('dist/fonts/'))
        .pipe(gulp.dest('dist/fonts/'));
});
// ---------------------------------------------------
// Root files
// ---------------------------------------------------
gulp.task('root-files', function () {
    gulp.src('src/root-files')
        .pipe(changed('dist/'))
        .pipe(gulp.dest('dist/'));
});
// ---------------------------------------------------
// Imagemin
// ---------------------------------------------------
gulp.task('imagemin', function () {
    return gulp.src('src/img/**/*')
        .pipe(changed('dist/img'))
        .pipe(image())
        .pipe(gulp.dest('dist/img'));
});
// ---------------------------------------------------
// JS
// ---------------------------------------------------
gulp.task('js', function () {
    gulp.src('src/blocks/**/*.js')
    // .pipe(changed(layoutJsDir))
        .pipe(gulp.dest('dist/blocks'))
        .pipe(browserSync.reload({stream: true}))
});
// ---------------------------------------------------
// Browser Sync
// ---------------------------------------------------
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            // root dist directory
            baseDir: 'dist/',
            directory: true
        },
        notify: true
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    });
});
// ---------------------------------------------------
// Watch
// ---------------------------------------------------
gulp.task('watch', ['scss-style', 'browser-sync'], function () {
    gulp.watch('scss/app.scss', ['foundation']);
    gulp.watch('src/blocks/**/*.scss', ['scss-style']);
    gulp.watch('src/pages/**/*.html', ['html-pages']);
    gulp.watch('src/blocks/**/*.html', ['html-blocks', 'html-pages']);
    gulp.watch('src/img/**/*', ['imagemin']);
    // gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
    // gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);