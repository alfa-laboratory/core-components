const content = `{
    "module": "%path%"
}
`;

/**
 * Создает контент файла package.json, в котором указывается путь до es-модулей.
 * Это нужно для корректной работы динамического импорта и tree-shaking'а.
 */
export default function createPackageJson(path) {
    return content.replace('%path%', path);
}
