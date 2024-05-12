import gulp from "gulp"
import concat from "gulp-concat"

gulp.task("default", () => {
    return gulp.src(["src/files/*.js", "src/files/*.json", "src/files/*.css", "src/files/*.html",])
            .pipe(concat("all.js"))
            .pipe(gulp.dest("./dest/files"))
});