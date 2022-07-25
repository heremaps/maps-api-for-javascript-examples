const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
console.log(dom.window.document.querySelector("p").textContent); // "Hello world"