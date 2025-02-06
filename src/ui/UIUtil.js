/**
 * Creates a debounce function that delays the execution of a callback
 * @param {function} callback - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {function} A debounced function
 */
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

/**
 * Creates an input element with the specified type, value, and change event handler.
 * @param {string} type - The input type (e.g., 'text', 'checkbox').
 * @param {*} value - The initial value of the input.
 * @param {function} onChange - The event handler for the input's change event.
 * @returns {HTMLInputElement} - The created input element.
 */
export const createInput = (type, value, onChange) => {
    const input = document.createElement('input');
    input.type = type;
    (type === 'checkbox') ?
        input.addEventListener('change', () => onChange(input.checked)) :
        input.addEventListener('input', () => onChange(input.value));

    (type === 'checkbox') ? input.checked = value : input.value = value;

    return input;
};