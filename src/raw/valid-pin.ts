function validatePIN(pin: string) {
  //return true or false

  return /^(\d{4}|\d{6})$/.test(pin);
}

console.log(validatePIN(""));
