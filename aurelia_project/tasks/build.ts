import * as gulp from 'gulp';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import prepareFontAwesome from './prepare-font-awesome';
import prepareBootstrap from './prepare-bootstrap';
import prepareKendo from './prepare-kendo';
import prepareAssets from './prepare-assets';
import prepareDrop from './prepare-drop';
import clean from './clean';
import { build } from 'aurelia-cli';
import * as project from '../aurelia.json';

export default gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processMarkup,
    processCSS,
    prepareFontAwesome,
    prepareBootstrap,
    prepareKendo,
    prepareAssets
  ),
  writeBundles
);

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}
