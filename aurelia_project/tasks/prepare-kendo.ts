import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as project from '../aurelia.json';
import * as cleanCSS from 'gulp-clean-css';
import * as rename from 'gulp-rename';
import * as merge from 'merge-stream';

export default function prepareBootstrap() {
    const kendoSrc = 'node_modules/kendo-ui-core';

    const theme = gulp.src(`src/styles/kendo.axc.css`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`${project.platform.output}/css`));

    const coreCss = gulp.src(`${kendoSrc}/css/web/kendo.common.core.min.css`)
        .pipe(changedInPlace({firstPass: true}))
        .pipe(gulp.dest(`${project.platform.output}/css`));

    return merge(theme, coreCss);
}