// Fork of https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/getCSSModuleLocalIdent.js

const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function getCSSModuleLocalIdent(context, localIdentName, localName, options) {
    const matches = context.resourcePath.match(
        /src\/(.*)\/src\/(index|Component)\.module\.(css|scss|sass)$/,
    );

    // Use the filename or component folder name, based on some uses the index.js / index.module.(css|scss|sass) project style
    // We store sources in /src folder, so [folder] === 'src'. For this reason, we should get component name from regexp.
    const fileNameOrFolder = matches ? matches[1] : '[name]';

    // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
    const hash = loaderUtils.getHashDigest(
        path.posix.relative(context.rootContext, context.resourcePath) + localName,
        'md5',
        'base64',
        5,
    );
    // Use loaderUtils to find the file or folder name
    const className = loaderUtils.interpolateName(
        context,
        fileNameOrFolder + '_' + localName + '__' + hash,
        options,
    );

    // remove the .module that appears in every classname when based on the file.
    return className.replace('.module_', '_');
};
