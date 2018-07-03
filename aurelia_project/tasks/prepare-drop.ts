import * as gulp from 'gulp';
import * as project from '../aurelia.json';
import * as merge from 'merge-stream';

export default function prepareDrop() {

    const taskTopLevelFiles = gulp.src(['index.html', 'favicon.ico'])
        .pipe(gulp.dest(`${project.dropFolder.path}`));

    const taskMoveScripts = gulp.src('scripts/**/*')
        .pipe(gulp.dest(`${project.dropFolder.path}/scripts`));

    return merge(taskMoveScripts, taskTopLevelFiles);
}
