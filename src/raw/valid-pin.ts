function validatePIN(pin: string) {
  return /^(\d{4}|\d{6})$/.test(pin);
}

console.log(validatePIN(""));
