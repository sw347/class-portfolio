import express from "express";

const app = express();

app.use(express.static("public"));

app.listen(3342, () => {
  console.log("Server is running on http://localhost:3342");
});
