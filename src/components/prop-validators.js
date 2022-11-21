export const shirtSizes = ["sm", "md", "lg"];
export const buttonStyles = ["primary", "secondary", "outline", "danger", "select", "disabled" , "main"];
export const buttonStyleValidator = (value) => {
    return buttonStyles.includes(value.toLowerCase());
};
export const shirtSizeValidator = (value) => {
    return shirtSizes.includes(value.toLowerCase());
};
