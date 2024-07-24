import PubSub from "pubsub-js";
export function initInput() {
  let btn = document.querySelector(".btn");
  let inputBox = document.querySelector(".answer");
  btn.addEventListener("click", () => {
    PubSub.publish("SendAnswer", inputBox.value);
  });
}
