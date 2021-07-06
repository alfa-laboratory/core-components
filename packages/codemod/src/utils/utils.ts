import { JSCodeshift, Collection, JSXOpeningElement } from 'jscodeshift';

type TransformTypographyImportOpts = {
    from: string;
};

type RenameAttributeOpts = {
    from: string;
    to: string;
};

type AddStringAttributeOpts = {
    name: string;
    value: string;
};

export const transformTypographyImports = (
    j: JSCodeshift,
    source: Collection,
    opts: TransformTypographyImportOpts,
) => {
    const { from } = opts;

    const to = '@alfalab/core-components/typography';
    const componentName = 'Typography';

    /**
     * Импорты типографики
     */
    const existedTypographyImports = source
        .find(j.ImportSpecifier)
        .filter(path => path.parent.value.source.value === to)
        .map(path => path.parent);

    /**
     * Импорты компонента, который надо заменить
     */
    const imports = source
        .find(j.ImportSpecifier)
        .filter(path => path.parent.value.source.value === from)
        .map(path => path.parent);

    /**
     * Импорты компонента, который надо заменить (import default)
     */
    const defaultImports = source
        .find(j.ImportDefaultSpecifier)
        .filter(path => path.parent.value.source.value === from)
        .map(path => path.parent);

    if (existedTypographyImports.length > 0) {
        /**
         * Если типографика уже заимпортирована, то просто удаляем импорт компонента
         */
        imports.remove();
        defaultImports.remove();
    } else {
        /**
         * Если типографика не заимпортирована, то заменяем импорт компонента на импорт типографики
         */
        imports.replaceWith(() =>
            j.importDeclaration(
                [j.importSpecifier(j.identifier(componentName))],
                j.stringLiteral(to),
            ),
        );
        defaultImports.replaceWith(() =>
            j.importDeclaration(
                [j.importSpecifier(j.identifier(componentName))],
                j.stringLiteral(to),
            ),
        );
    }
};

export const renameAttribute = (
    j: JSCodeshift,
    openingElement: JSXOpeningElement,
    opts: RenameAttributeOpts,
) => {
    const { from, to } = opts;

    j(openingElement)
        .find(j.JSXAttribute, { name: { name: from } })
        .replaceWith(path => {
            const { node } = path;

            node.name.name = to;

            return node;
        });
};

export const addStringAttribute = (
    j: JSCodeshift,
    openingElement: JSXOpeningElement,
    opts: AddStringAttributeOpts,
) => {
    const { name, value } = opts;

    openingElement.attributes.push(j.jsxAttribute(j.jsxIdentifier(name), j.stringLiteral(value)));
};

type LogLevel = 'error' | 'warning' | 'info' | 'success';

const messageColor = {
    error: '\x1b[31m',
    warning: '\x1b[33m',
    success: '\x1b[32m',
    info: '\x1b[37m',
};

export const log = (message: string, level: LogLevel = 'error') => {
    // eslint-disable-next-line no-console
    console.log(`${messageColor[level]}%s\x1b[0m`, message);
};
