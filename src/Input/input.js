import PubSub from "pubsub-js";
export function initInput() {
  let btn = document.querySelector(".btn");
  let inputBox = document.querySelector(".answer");
  btn.addEventListener("click", () => {
    PubSub.publish("SendAnswer", inputBox.value);
  });
}

export function initBtn() {
  let btn = document.querySelector(".startBtn");
  btn.addEventListener("click", () => {
    PubSub.publish("StartGame");
  });
}
