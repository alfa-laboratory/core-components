export default function ignoreCss() {
    return {
        name: 'ignore-css',
        resolveId(source) {
            if (source.includes('.css')) {
                return false;
            }

            return null;
        },
    };
}
