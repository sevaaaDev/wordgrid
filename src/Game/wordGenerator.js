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
    if (el.length < 6) return true;
    return false;
  });
  console.log(arrayOfWord);
  return arrayOfWord;
}

export async function getWords(array = []) {
  if (array.length === 10) return array;
  let words = await fetchWords();
  let sanitizedWords = sanitizeWords(words);
  array = [...array, ...sanitizedWords];
  if (array.length > 10) {
    array.splice(10, array.length - 10);
  }
  return getWords(array);
}

// TODO: refactor the function
