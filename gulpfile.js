// const del = require("del"); // need to install del
const { init } = require("browser-sync");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
/**
 * Top Level Functions
 *
 * gulp.task -> Define Tasks
 * gulp.src -> Point to files to use
 * gulp.dest -> Point to the output folder
 * gulp.watch -> Point to files and folders to use
 *
 */
const htmlFiles = "./src/*.html";
const sassFiles = "./src/scss/**/*.scss";

// const clean = () => del(["dist"]);

function reload(cb) {
  browserSync.reload();
  cb();
}

function serverStart(cb) {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
  cb();
}

function copyHTML(cb) {
  gulp.src(htmlFiles).pipe(gulp.dest("./dist"));
  cb();
}

function compileSASS(cb) {
  gulp
    .src(sassFiles)
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
  cb();
}

function watchFiles() {
  gulp.watch(sassFiles, { ignoreInitial: false }, compileSASS);
  gulp.watch(
    htmlFiles,
    { ignoreInitial: false },
    gulp.series(copyHTML, reload)
  );
}

exports.watch = gulp.series(serverStart, watchFiles);
