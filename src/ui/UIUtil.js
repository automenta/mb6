export const debounce = (callback, delay) => {
    let timeout;

    const debounceCallback = (args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(null, args), delay);
    };

    return {
        cancel: () => clearTimeout(timeout),
        then: (args, symbol) => {
            if (typeof args === 'number') {
                debounceCallback(args);
            } else {
                debounceCallback([args, symbol]);
            }
        }
    };
};

export const createInput = (type, value, onChange) => {
    const input = document.createElement('input');
    input.type = type;
    (type === 'checkbox') ?
        input.addEventListener('change', () => onChange(input.checked)) :
        input.addEventListener('input', () => onChange(input.value));

    (type === 'checkbox') ? input.checked = value : input.value = value;

    return input;
};