import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as project from '../aurelia.json';
import * as cleanCSS from 'gulp-clean-css';
import * as rename from 'gulp-rename';

export default function prepareBootstrap() {
  return gulp.src(`src/styles/bootstrap.css`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`${project.platform.output}/css`));
}