const app = require("./app");
const dotenv = require("dotenv");
const connectToDB = require("./libs/mongoose");

dotenv.config({ path: ".env" });

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

connectToDB();

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 5000}`
  );
});

//un handled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Server is shutting down due to unhandledRejection`);

  server.close(() => {
    process.exit(1);
  });
});
