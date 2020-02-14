const Koa = require("koa");
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
app.use(static(__dirname));
app.use(bodyParser());

const router = require("koa-router")();

router.get("/login", (ctx, next) => {
  ctx.cookies.set("token", "lisa", {
    domain: "localhost",
    maxAge: 1000 * 60 * 60 * 1
  });
  ctx.response.body = "登录成功，已经种下cookie";
});

router.get("/transform", (ctx, next) => {
  const { from, to } = ctx.request.query;
  if (ctx.cookies.get("token") === "lisa") {
    ctx.response.body = `alert("GET方式 : 转账成功 : 已经${from}下的500万转到了${to}名下")`;
  } else {
    ctx.response.body = `alert('有内鬼')`;
  }
});

router.post("/transform", (ctx, next) => {
  console.log(ctx.request.body);
  const { from, to } = ctx.request.body;
  if (ctx.cookies.get("token") === "lisa") {
    ctx.response.body = `alert("POST方式 : 转账成功 : 已经${from}下的500万转到了${to}名下")`;
  } else {
    ctx.response.body = `alert('有内鬼')`;
  }
});

app.use(router.routes());
app.listen(9000, () => {
  console.log("bank server has been running : localhost:9000");
});
