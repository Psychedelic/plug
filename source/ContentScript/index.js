/* eslint-disable */
console.log("helloworld from content script");

window.addEventListener("message", (event) => {
  console.log("running event listener Content Script");
  console.log(event.data);

  if (event.data.type === "test_req") {
    window.postMessage({ type: "test_res", payload: "ok" }, "*");
  }
});

export {};
