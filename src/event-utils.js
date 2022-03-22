
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today


function getData() {
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  // Open (or create) the database
  const request = indexedDB.open("CarsDatabase", 1);

  request.onsuccess = function (event) {

    const db = request.result;
    const transaction = db.transaction("cars", "readonly");
    const store = transaction.objectStore("cars");

    const subaru = store.getAll();

    subaru.onsuccess = function () {
      console.log(subaru.result)
      return(subaru.result)
    };
  }
}


// promise1.then((value) => {
//   console.log(value);
//   // expected output: "Success!"
// });

// let INITIAL_EVENTS = await getData()

export const INITIAL_EVENTS = new Promise((resolve, reject) => {
  resolve('Success!');
});





export function createEventId() {
  // return String(eventGuid++)

  // https://gist.github.com/gordonbrander/2230317
  return ('_' + Math.random().toString(36).substr(2, 9));
}
