module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.extensions = ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'];

            // Найти правило для SVG
            const svgRule = webpackConfig.module.rules.find((rule) => rule.test && rule.test.toString().includes('svg'));

            if (svgRule) {
                svgRule.exclude = /\.inline\.svg$/; // Исключаем файлы inline.svg
            }

            // Добавляем новое правило для inline.svg
            webpackConfig.module.rules.push({
                test: /\.inline\.svg$/, // Для inline.svg
                use: ['@svgr/webpack'],
            });

            // Добавляем правило для остальных SVG
            webpackConfig.module.rules.push({
                test: /\.svg$/, // Для других SVG файлов
                exclude: /\.inline\.svg$/, // Исключая inline.svg
                use: ['@svgr/webpack', 'file-loader'], // Используем svgr и file-loader
            });

            return webpackConfig;
        },
    },
};
