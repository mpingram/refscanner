const gulp = require("gulp");
const del = require("del");
const typescript = require("gulp-typescript").createProject("tsconfig.json");
const sourcemaps = require("gulp-sourcemaps");
const jasmine = require("gulp-jasmine");

function compileTs() {
  return gulp.src(["app/**/*@(.ts|.js)"])
    .pipe(sourcemaps.init())
    .pipe(typescript())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist"));
}

function clean() {
  return del(["dist"]);
}

const build = gulp.series( clean, compileTs );

function test() {
  return gulp.src(["dist/**/*.spec.js"])
    .pipe(jasmine({
      errorOnFail: false,
    }));
}

function watch(){
  gulp.watch("app/**/*@(.ts|.js)", gulp.series( build, test ));
}


gulp.task("default", gulp.series( build, test, watch ));

gulp.task("test", test);

