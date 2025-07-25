export const customValidationHandler = (event) => {
    event.target.setCustomValidity('');
  
    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Please fill out this field.');
      return;
    }
};