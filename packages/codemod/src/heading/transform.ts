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

const sizes = {
    xs: 'xsmall',
    s: 'small',
    m: 'medium',
    l: 'large',
    xl: 'xlarge',
};

const tag = {
    xs: 'h5',
    s: 'h4',
    m: 'h3',
    l: 'h2',
    xl: 'h1',
};

const transformSize = (j: JSCodeshift, openingElement: JSXOpeningElement, fileInfo: FileInfo) => {
    const hasSizeProp =
        j(openingElement).find(j.JSXAttribute, { name: { name: 'size' } }).length !== 0;

    /**
     * Если указан size, то
     */
    if (hasSizeProp) {
        /**
         * Выставляем соответствующий тэг
         */
        j(openingElement)
            .find(j.JSXAttribute, { name: { name: 'size' } })
            .forEach(({ node }) => {
                /**
                 * Если размер указан явно, то выставляем соответствующий тэг
                 */
                if (node.value.type === 'StringLiteral') {
                    const nodeValue = node.value as StringLiteral;

                    openingElement.attributes.push(
                        j.jsxAttribute(
                            j.jsxIdentifier('tag'),
                            j.stringLiteral(tag[nodeValue.value]),
                        ),
                    );
                }
            });

        /**
         * Меняем size на view
         */
        j(openingElement)
            .find(j.JSXAttribute, { name: { name: 'size' } })
            .replaceWith(({ node }) => {
                /**
                 * Если размер указан явно, то меняем значение
                 */
                if (node.value.type === 'StringLiteral') {
                    const nodeValue = node.value as StringLiteral;

                    return j.jsxAttribute(
                        j.jsxIdentifier('view'),
                        j.stringLiteral(sizes[nodeValue.value]),
                    );
                }

                /**
                 * Если размер указан неявно (например, записан в переменную, или использовано выражение),
                 * то меняем название атрибута, значение оставляем как есть и выводим предупреждение
                 */
                node.name.name = 'view';

                log(
                    `Не удалось определить значение 'view' у компонента Heading:\n${fileInfo.path}:${node.loc.start.line}\n`,
                    'warning',
                );

                return node;
            });
    } else {
        /**
         * Если size не указан, то выставляем view='xlarge',
         * так как в фижере дефолтный size='xl'
         */
        addStringAttribute(j, openingElement, { name: 'view', value: 'xlarge' });

        /**
         * Выставляем тэг h1
         */
        addStringAttribute(j, openingElement, { name: 'tag', value: 'h1' });
    }
};

const transformMargins = (j: JSCodeshift, openingElement: JSXOpeningElement) => {
    const hasHasDefaultMarginsProp =
        j(openingElement).find(j.JSXAttribute, { name: { name: 'hasDefaultMargins' } }).length !==
        0;

    /**
     * Если указана пропса hasDefaultMargins, то
     */
    if (hasHasDefaultMarginsProp) {
        /**
         * Удаляем ее, если она false
         */
        j(openingElement)
            .find(j.JSXAttribute, {
                name: { name: 'hasDefaultMargins' },
                value: { expression: { value: false } },
            })
            .remove();

        /**
         * Меняем имя на defaultMargins, если он true
         */
        j(openingElement)
            .find(j.JSXAttribute, {
                name: { name: 'hasDefaultMargins' },
                value: { expression: { value: true } },
            })
            .replaceWith(() =>
                j.jsxAttribute(
                    j.jsxIdentifier('defaultMargins'),
                    j.jsxExpressionContainer(j.booleanLiteral(true)),
                ),
            );
    } else {
        /**
         * Если hasDefaultMargins не указан, то выставляем defaultMargins='true',
         * так как в фижере дефолтный hasDefaultMargins='true'
         */
        openingElement.attributes.push(
            j.jsxAttribute(
                j.jsxIdentifier('defaultMargins'),
                j.jsxExpressionContainer(j.booleanLiteral(true)),
            ),
        );
    }
};

const headingTransform: Transform = (fileInfo, api) => {
    const j = api.jscodeshift;
    const source = j(fileInfo.source);

    transformTypographyImports(j, source, {
        from: 'arui-feather/heading',
    });

    /**
     * Находим использование компонента Heading и меняем ему пропсы
     */
    source.findJSXElements('Heading').forEach(path => {
        j(path).replaceWith((path: ASTPath<JSXElement>) => {
            const { node } = path;

            const { openingElement, closingElement } = node;

            const openingElementName = openingElement.name as JSXIdentifier;

            openingElementName.name = 'Typography.TitleResponsive';

            if (closingElement) {
                const closingElementName = closingElement.name as JSXIdentifier;
                closingElementName.name = 'Typography.TitleResponsive';
            }

            transformSize(j, openingElement, fileInfo);

            transformMargins(j, openingElement);

            renameAttribute(j, openingElement, { from: 'data-test-id', to: 'dataTestId' });

            addStringAttribute(j, openingElement, { name: 'font', value: 'system' });

            addStringAttribute(j, openingElement, { name: 'color', value: 'primary' });

            return node;
        });
    });

    return source.toSource({
        quote: 'single',
        // Не переносим строки, чтобы было удобнее писать тесты
        wrapColumn: 1000,
    });
};

headingTransform.componentName = 'Heading';

export default headingTransform;
