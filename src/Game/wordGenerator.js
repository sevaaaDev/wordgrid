async function fetchWords() {
  let response = await fetch(
    "https://random-word-api.vercel.app/api?words=30&alphabetize=true",
  );
  let json = await response.json();

  return json;
}

function sanitizeWords(arrayOfWord, prevArray) {
  arrayOfWord = arrayOfWord.filter((el) => {
    if (el.length < 7) return true;
    return false;
  });
  arrayOfWord = new Set([...prevArray, ...arrayOfWord]);
  arrayOfWord = Array.from(arrayOfWord);
  return arrayOfWord;
}

function fetchWordsMock() {
  return [
    "over",
    "austria",
    "linux",
    "ball",
    "pluto",
    "north",
    "hole",
    "planet",
    "pluto",
    "planet",
    "ash",
  ];
}

export async function getWords(array = []) {
  if (array.length === 8) return array;
  let words = await fetchWords();
  //let words = fetchWordsMock();
  let sanitizedWords = sanitizeWords(words, array);
  array = sanitizedWords;
  if (array.length > 8) {
    array.splice(8, array.length - 8);
  }
  return getWords(array);
}
