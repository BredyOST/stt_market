/** @type {import('stylelint').Config} */

export default {
    // extends: 'stylelint-config-standard', // Подключение стандартных правил
    rules: {
        'no-invalid-double-slash-comments': true, // Включение проверки на недопустимые комментарии
        'block-no-empty': true, // Запрет пустых блоков
        'color-no-invalid-hex': true, // Запрет недопустимых шестнадцатеричных значений
        'declaration-colon-space-after': 'always', // Пробел после двоеточия в декларациях
        'property-no-unknown': true, // Запрет неизвестных свойств
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: ['v-deep'], // Игнорировать v-deep для Vue
            },
        ],
    },
};
