let rollup = require('rollup-stream');
let babel = require('rollup-plugin-babel');
let resolve = require('rollup-plugin-node-resolve');
let commonjs = require('rollup-plugin-commonjs');
// let globals = require('rollup-plugin-node-globals');
// let builtins = require('rollup-plugin-node-builtins');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');

let gulp = require('gulp');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
let jsmin = require('gulp-uglify');
let cssmin = require('gulp-clean-css');
let htmlmin = require('gulp-htmlmin');

gulp.task('vendor', function() {
    return gulp.src(['./src/js/vendor/buffer.js', './src/js/vendor/lz4.js', './src/js/vendor/jquery.js', './src/js/vendor/color.js', './src/js/vendor/keycode.js', './src/js/vendor/animate.js', './src/js/vendor/jwt.js', './src/js/vendor/log.js', './src/js/vendor/tether.js', './src/js/vendor/bootstrap.js', './src/js/vendor/bootbox.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('js', function() {
    return rollup({
        input: './src/js/main.js',
        sourcemap: true,
        format: 'iife',
        name: 'Main',
        plugins: [
            babel({
                exclude: 'node_modules/**',
                'presets': [['es2015', {'modules': false}]],
                'plugins': ['external-helpers']
            }),
            resolve({ jsnext: true, main: false, browser: true, preferBuiltins: false }),
            commonjs()
        ]
    })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(jsmin())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('css', function() {
    return gulp.src(['./src/css/main.css'])
        .pipe(cssmin({}))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('html', function() {
    return gulp.src(['./src/index.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            collapseInlineTagWhitespace: false,
            removeAttributeQuotes: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['js', 'css', 'html', 'vendor'], function() {
    gulp.watch('./src/js/vendor/**.js', ['vendor']);
    gulp.watch('./src/js/components/**', ['js']);
    gulp.watch('./src/js/main.js', ['js']);
    gulp.watch('./src/css/main.css', ['css']);
    gulp.watch('./src/index.html', ['html']);
});
