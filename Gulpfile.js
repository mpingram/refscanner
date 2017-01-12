const gulp = require("gulp");
const del = require("del");
const typescript = require("gulp-typescript").createProject("tsconfig.json");
const sourcemaps = require("gulp-sourcemaps");

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

function watch(){
  gulp.watch("app/**/*@(.ts|.js)", build);
}


//gulp.task("default", gulp.series( build, watch ));
gulp.task("default", gulp.series( compileTs, watch ));

