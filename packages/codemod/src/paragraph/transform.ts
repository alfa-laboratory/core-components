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

const componentViewMap = {
    small: 'primary-small',
    normal: 'primary-medium',
    lead: 'small',
};

const componentSizeMap = {
    small: 'Typography.Text',
    normal: 'Typography.Text',
    lead: 'Typography.Title',
};

const transformSize = (
    j: JSCodeshift,
    openingElement: JSXOpeningElement,
    fileInfo: FileInfo,
): string => {
    let size = 'normal';
    let componentName = componentSizeMap[size];

    j(openingElement)
        .find(j.JSXAttribute, { name: { name: 'view' } })
        .replaceWith(({ node }) => {
            /**
             * Если размер указан явно, то меняем значение
             */
            if (node.value.type === 'StringLiteral') {
                const nodeValue = node.value as StringLiteral;
                size = nodeValue.value;
                componentName = componentSizeMap[size];

                return j.jsxAttribute(
                    j.jsxIdentifier('view'),
                    j.stringLiteral(componentViewMap[size]),
                );
            }

            /**
             * Если размер указан неявно (например, записан в переменную, или использовано выражение),
             * то меняем название атрибута, значение оставляем как есть и выводим предупреждение
             */
            node.name.name = 'view';

            log(
                `Не удалось определить значение 'view' у компонента Paragraph:\n${fileInfo.path}:${node.loc.start.line}\n`,
                'warning',
            );

            return node;
        });

    return componentName;
};

const paragraphTransform: Transform = (fileInfo, api) => {
    const j = api.jscodeshift;
    const source = j(fileInfo.source);

    transformTypographyImports(j, source, {
        from: 'arui-feather/paragraph',
    });

    /**
     * Находим использование компонента Heading и меняем ему пропсы
     */
    source.findJSXElements('Paragraph').forEach(path => {
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

            if (componentName === 'Typography.Title') {
                addStringAttribute(j, openingElement, { name: 'weight', value: 'regular' });
                addStringAttribute(j, openingElement, { name: 'tag', value: 'h4' });
                addStringAttribute(j, openingElement, { name: 'font', value: 'system' });
            }

            renameAttribute(j, openingElement, { from: 'data-test-id', to: 'dataTestId' });
            addStringAttribute(j, openingElement, { name: 'color', value: 'primary' });

            const hasMarkProp =
                j(openingElement).find(j.JSXAttribute, { name: { name: 'mark' } }).length > 0;

            if (hasMarkProp) {
                log(
                    `Свойство 'mark' не существует у компонента 'Typography.Text':\n${fileInfo.path}:${node.loc.start.line}\n`,
                    'warning',
                );
            }

            return node;
        });
    });

    return source.toSource({
        quote: 'single',
        wrapColumn: 1000,
    });
};

paragraphTransform.componentName = 'Paragraph';

export default paragraphTransform;
