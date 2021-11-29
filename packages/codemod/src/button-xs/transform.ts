/* eslint-disable no-param-reassign, no-shadow */
import { Transform, ASTPath, JSXElement } from 'jscodeshift';

/**
 * Меняет <button size="xs" /> на <button size="xxs" />
 */
const buttonTransform: Transform = (fileInfo, api) => {
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
                    name: { name: 'size' },
                    value: { value: 'xs' },
                })
                .replaceWith(() => j.jsxAttribute(j.jsxIdentifier('size'), j.stringLiteral('xxs')));

            return node;
        });
    });

    /**
     * Находим использование компонента Tag и меняем ему пропсы
     */
     source.findJSXElements('Tag').forEach(path => {
        j(path).replaceWith((path: ASTPath<JSXElement>) => {
            const { node } = path;

            const { openingElement } = node;

            j(openingElement)
                .find(j.JSXAttribute, {
                    name: { name: 'size' },
                    value: { value: 'xs' },
                })
                .replaceWith(() => j.jsxAttribute(j.jsxIdentifier('size'), j.stringLiteral('xxs')));

            return node;
        });
    });

    return source.toSource({
        quote: 'single',
        wrapColumn: 1000,
    });
};

export default buttonTransform;
