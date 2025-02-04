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
    (type === 'checkbox') ? input.addEventListener('change', () => onChange(input.checked)) : input.addEventListener('input', () => onChange(input.value));
    (type === 'checkbox') ? input.checked = value : input.value = value;

    return input;

};