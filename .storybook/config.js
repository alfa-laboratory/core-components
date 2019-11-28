/**
 * Vendor
 */

import { configure, addDecorator, addParameters } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { withKnobs } from "@storybook/addon-knobs";

/**
 * Theme
 */

import { alfaTheme } from "./alfaTheme";

/**
 * Set theme
 */

// addParameters({
//   options: {
//     theme: alfaTheme,
//   },
// });

/**
 * Set config
 */

// automatically import all files ending in *.stories.tsx
configure([
    require.context('../src/components', true, /\.stories\.(tsx|mdx)$/)
], module);

addDecorator(withInfo);
addDecorator(withKnobs);
