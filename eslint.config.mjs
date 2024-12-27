import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('blog/core-web-vitals', 'blog/typescript'),
    {
        ignores: ['dist', 'node_modules'],
        rules: {
            // Основные правила для JS/TS
            'no-console': 'warn', // Предупреждения при использовании console
            'no-unused-vars': 'warn', // Предупреждения при наличии неиспользуемых переменных
            'no-undef': 'error', // Ошибка при использовании неопределенных переменных

            // Для React
            'react/react-in-jsx-scope': 'off', // Не нужно импортировать React в каждом файле JSX/TSX

            // Для TypeScript

            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Предупреждения для неиспользуемых переменных, игнорируем аргументы с подчеркиванием

            // Для улучшения производительности (Web Vitals)
            'next/next-script-for-ga': 'off', // Отключаем правило для Google Analytics, если используем стороннее решение
        },
        settings: {
            react: {
                version: 'detect', // Автоматически определяем версию React
            },
        },
    },
];
// ...compat.extends("blog/core-web-vitals", "blog/typescript"),

// extends: [
//     'eslint:recommended', // Рекомендуемые настройки ESLint
//     'plugin:react/recommended', // Рекомендуемые настройки для React
//     'plugin:@typescript-eslint/recommended', // Рекомендуемые настройки для TypeScript
//     'blog/core-web-vitals', // Настройки для Web Vitals в Next.js
//     'blog/typescript', // Настройки для TypeScript в Next.js
// ],

export default eslintConfig;
