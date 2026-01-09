/**
 *
 * @param {Promise<any>[]} promises
 * @returns
 */
function promiseAll(promises) {
  let result = new Array(promises.length); //initialize array with length same as of promises array
  let totalPromisesResolved = 0;

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      promise
        .then((val) => {
          result[index] = val; //store the result of promise at the same index
          totalPromisesResolved++;
          if (totalPromisesResolved == promises.length) resolve(result); //all promises are resolved, call resolve
        })
        .catch((err) => {
          reject(err); //if any promise rejects, call the reject function
        });
    });
  });
}

// Example usage:
let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Resolved-1");
  }, 1000);
});

let promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Resolved-2");
  }, 500);
});

let promise3 = new Promise((resolve, reject) => {
  resolve("Resolved-3");
});

const promises = [promise1, promise2, promise3];
promiseAll(promises).then((result) => console.log(result));
