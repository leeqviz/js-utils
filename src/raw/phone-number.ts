function createPhoneNumber(numbers) {
  if (
    !Array.isArray(numbers) ||
    numbers.length !== 10 ||
    !numbers.every((num) => Number.isInteger(num) && num >= 0 && num <= 9)
  ) {
    return null; // Return null for invalid input
  }

  let format = "(xxx) xxx-xxxx";

  for (var i = 0; i < numbers.length; i++) {
    console.log(format);
    format = format.replace("x", numbers[i]); // Replace only the first occurrence of 'x' on each iteration
  }

  return format;
}

// Example usage:
console.log(createPhoneNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]));
