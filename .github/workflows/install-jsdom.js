// const { JSDOM } = node-jsdom;


// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
// console.log(dom.window.document.querySelector("p").textContent); // "Hello world"

var jsdom = require("node-jsdom");
 
jsdom.env(
  "http://nodejs.org/dist/",
  ["http://code.jquery.com/jquery.js"],
  function (errors, window) {
    console.log("there have been", window.$("a").length, "nodejs releases!");
  }
);