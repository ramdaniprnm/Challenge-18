import readline from "readline";
import { loginController } from "./controllers/loginController.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Main app function
const app = (rl) => {
  console.log("==============================================");
  console.log("Welcome to Universitas LangLang");
  console.log("Jl. Rusuk Tusuk NO. 01");
  console.log("==============================================");
  loginController.login(rl);
};

app(rl);
