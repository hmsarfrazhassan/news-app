import dotenv from "dotenv";

const result = dotenv.config({ path: ["./config/config.env"] });

if (result.error) {
  console.error("Could not load env file:", result.error);
}
