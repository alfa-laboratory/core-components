/* eslint-disable no-param-reassign, no-shadow */
import {
    Transform,
    JSXIdentifier,
    StringLiteral,
    ASTPath,
    JSXElement,
    JSCodeshift,
    JSXOpeningElement,
    FileInfo,
} from 'jscodeshift';

import { transformTypographyImports, renameAttribute, addStringAttribute, log } from '../utils';

const componentSizeMap = {
    s: 'Typography.Text',
    m: 'Typography.Text',
    l: 'Typography.Text',
    xl: 'Typography.Title',
    '2xl': 'Typography.Title',
    '3xl': 'Typography.Title',
    '4xl': 'Typography.Title',
};

const sizes = {
    s: 'primary-small',
    m: 'primary-medium',
    l: 'primary-large',
    xl: 'xsmall',
    '2xl': 'medium',
    '3xl': 'large',
    '4xl': 'xlarge',
};

const transformSize = (
    j: JSCodeshift,
    openingElement: JSXOpeningElement,
    fileInfo: FileInfo,
): string => {
    let size = 'm';
    let componentName = componentSizeMap[size];

    j(openingElement)
        .find(j.JSXAttribute, { name: { name: 'size' } })
        .replaceWith(({ node }) => {
            /**
             * Если размер указан явно, то меняем значение
             */
            if (node.value.type === 'StringLiteral') {
                const nodeValue = node.value as StringLiteral;
                size = nodeValue.value;
                componentName = componentSizeMap[size];

                return j.jsxAttribute(j.jsxIdentifier('view'), j.stringLiteral(sizes[size]));
            }

            /**
             * Если размер указан неявно (например, записан в переменную, или использовано выражение),
             * то меняем название атрибута, значение оставляем как есть и выводим предупреждение
             */
            node.name.name = 'view';

            log(
                `Не удалось определить значение 'view' у компонента Label:\n${fileInfo.path}:${node.loc.start.line}\n`,
                'warning',
            );

            return node;
        });

    return componentName;
};

const labelTransform: Transform = (fileInfo, api) => {
    const j = api.jscodeshift;
    const source = j(fileInfo.source);

    transformTypographyImports(j, source, {
        from: 'arui-feather/label',
    });

    /**
     * Находим использование компонента Label и меняем ему пропсы
     */
    source.findJSXElements('Label').forEach(path => {
        j(path).replaceWith((path: ASTPath<JSXElement>) => {
            const { node } = path;

            const { openingElement, closingElement } = node;

            const openingElementName = openingElement.name as JSXIdentifier;

            const componentName = transformSize(j, openingElement, fileInfo);

            openingElementName.name = componentName;

            if (closingElement) {
                const closingElementName = closingElement.name as JSXIdentifier;
                closingElementName.name = componentName;
            }

            renameAttribute(j, openingElement, { from: 'data-test-id', to: 'dataTestId' });

            if (componentName === 'Typography.Title') {
                addStringAttribute(j, openingElement, { name: 'font', value: 'system' });
            }

            addStringAttribute(j, openingElement, { name: 'color', value: 'primary' });

            const hasIsNoWrapProp =
                j(openingElement).find(j.JSXAttribute, { name: { name: 'isNoWrap' } }).length > 0;

            if (hasIsNoWrapProp) {
                log(
                    `Свойство 'isNoWrap' не существует у компонента '${componentName}':\n${fileInfo.path}:${node.loc.start.line}\n`,
                    'warning',
                );
            }

            return node;
        });
    });

    return source.toSource({
        quote: 'single',
        // Не переносим строки, чтобы было удобнее писать тесты
        wrapColumn: 1000,
    });
};

labelTransform.componentName = 'Label';

export default labelTransform;
