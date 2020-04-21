const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function getCSSModuleLocalIdent(context, localIdentName, localName, options) {
    // В случае компонентов - использует имя папки, в остальных - имя ресурса.
    const matches = context.resourcePath.match(/packages\/(.*)\/src\/index\.module\.css$/);
    const componentOrFileName = matches ? matches[1] : '[name]';

    // Создает уникальный хэш, основанные на расположении файла и className.
    const hash = loaderUtils.getHashDigest(
        path.posix.relative(context.rootContext, context.resourcePath) + localName,
        'md5',
        'base64',
        5,
    );

    // Интерполирует шаблон и составляет className.
    return loaderUtils.interpolateName(
        context,
        componentOrFileName + '_' + localName + '--' + hash,
        options,
    );
};
