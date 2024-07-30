async function fetchWords() {
  let response = await fetch(
    "https://random-word-api.vercel.app/api?words=30&alphabetize=true",
  );
  let json = await response.json();

  console.log("call");
  return json;
}

function sanitizeWords(arrayOfWord) {
  arrayOfWord = arrayOfWord.filter((el) => {
    if (el.length < 7) return true;
    return false;
  });
  console.log(arrayOfWord);
  return arrayOfWord;
}

function fetchWordsMock() {
  return [
    "over",
    "pluto",
    "ball",
    "north",
    "hole",
    "planet",
    "globe",
    "lost",
    "break",
    "world",
  ];
}

export async function getWords(array = []) {
  if (array.length === 8) return array;
  let words = await fetchWords();
  //let words = fetchWordsMock();
  let sanitizedWords = sanitizeWords(words);
  array = [...array, ...sanitizedWords];
  if (array.length > 8) {
    array.splice(8, array.length - 8);
  }
  return getWords(array);
}

// TODO: refactor the function
