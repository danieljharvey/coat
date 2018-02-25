import { simpleObject } from "../objects/simpleObject";

import { Coat } from "../Coat";

const thing = new Coat(simpleObject);

console.log("opening thing", thing);
const nextThing = thing
  .set("width", 900)
  .call("bang", ["_width"])
  .call("go", [])
  .call("go", [])
  .call("go", [])
  .set("width", 400)
  .call("bang", ["_height"])
  .call("go", [])
  .set("width", 100)
  .get("height", (data: any) => {
    data.coat.call("bang", ["_width"]).call("bang", [200]);
  });

console.log("go...");

nextThing.run();

//console.log(nextThing);
//console.log("closing thing", thing);
