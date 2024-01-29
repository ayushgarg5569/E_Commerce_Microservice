const express = require("express");
const proxy = require("express-http-proxy");

const app = express();

app.use(express.json());


app.use("/customer", proxy("http://localhost:8001"));//customer and auth
app.use("/order", proxy("http://localhost:8002"));//order
app.use("/", proxy("http://localhost:8003")); // products

app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});
