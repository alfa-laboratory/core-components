/* eslint-disable no-param-reassign, no-shadow */
import { Transform, ASTPath, JSXElement } from 'jscodeshift';

const buttonViewsTransform: Transform = (fileInfo, api) => {
    const j = api.jscodeshift;
    const source = j(fileInfo.source);

    /**
     * Находим использование компонента Button и меняем ему пропсы
     */
    source.findJSXElements('Button').forEach(path => {
        j(path).replaceWith((path: ASTPath<JSXElement>) => {
            const { node } = path;

            const { openingElement } = node;

            j(openingElement)
                .find(j.JSXAttribute, {
                    name: { name: 'view' },
                    value: { value: 'filled' },
                })
                .replaceWith(() =>
                    j.jsxAttribute(j.jsxIdentifier('view'), j.stringLiteral('secondary')),
                );

            j(openingElement)
                .find(j.JSXAttribute, {
                    name: { name: 'view' },
                    value: { value: 'outlined' },
                })
                .replaceWith(() =>
                    j.jsxAttribute(j.jsxIdentifier('view'), j.stringLiteral('tertiary')),
                );

            j(openingElement)
                .find(j.JSXAttribute, {
                    name: { name: 'view' },
                    value: { value: 'transparent' },
                })
                .replaceWith(() =>
                    j.jsxAttribute(j.jsxIdentifier('view'), j.stringLiteral('secondary')),
                );

            return node;
        });
    });

    return source.toSource({
        quote: 'single',
        wrapColumn: 1000,
    });
};

export default buttonViewsTransform;
