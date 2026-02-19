const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/members", require("./routes/members"));
app.use("/expenses", require("./routes/expenses"));
app.use("/debts", require("./routes/debts"));
app.use("/transactions", require("./routes/transactions"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
