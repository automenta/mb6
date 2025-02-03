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
    if (type === 'checkbox') {
        input.checked = value;
        input.addEventListener('change', () => onChange(input.checked));
    } else {
        input.value = value;
        input.addEventListener('input', () => onChange(input.value));
    }
    return input;
};