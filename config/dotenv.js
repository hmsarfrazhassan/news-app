import dotenv from "dotenv";

const result = dotenv.config({ path: ["./config/config.env"] });

if (result) {
  console.log("Env file connected successfully");
}
