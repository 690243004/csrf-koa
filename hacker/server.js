const Koa = require("koa");
const static = require("koa-static");
const app = new Koa();
app.use(static(__dirname));
console.log(__dirname);
app.listen(10086, () => {
  console.log("hacker server has been running : localhost:10086");
});
