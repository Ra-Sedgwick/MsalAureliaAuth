import * as gulp from "gulp";
import * as project from "../aurelia.json";
import * as merge from "merge-stream";

export default function prepareAssets() {
    const axcSrc = "src/styles/axc/**/*";
    const commonJSFolder = "src/common/**/*";
    const appConfig = "src/appConfig.json";
    const images = "src/images/**/*";

    const axcTask = gulp.src(axcSrc)
        .pipe(gulp.dest(`${project.platform.output}/css/axc`));
    const commonJSTask = gulp.src(commonJSFolder)
        .pipe(gulp.dest(`${project.platform.output}`));
    const appConfigTask = gulp.src(appConfig)
        .pipe(gulp.dest(`${project.platform.output}`));
    const imageConfigTask = gulp.src(images)
        .pipe(gulp.dest(`${project.platform.output}/images`));


    return merge(axcTask, commonJSTask, appConfigTask, imageConfigTask);
}