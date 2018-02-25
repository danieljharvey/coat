"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simpleObject_1 = require("../objects/simpleObject");
var Coat_1 = require("../Coat");
var thing = new Coat_1.Coat(simpleObject_1.simpleObject);
console.log("opening thing", thing);
var nextThing = thing
    .set("width", 900)
    .call("bang", ["_width"])
    .call("go", [])
    .call("go", [])
    .call("go", [])
    .set("width", 400)
    .call("bang", ["_height"])
    .call("go", [])
    .set("width", 100)
    .get("height", function (data) {
    data.coat.call("bang", ["_width"]).call("bang", [200]);
});
console.log("go...");
nextThing.run();
//console.log(nextThing);
//console.log("closing thing", thing);
