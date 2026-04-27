const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDK7OcVzFzrsDWFhAfYFN2j1LQfVcNPLg4";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log(response.text());
  } catch (e) {
    console.error(e);
  }
}
run();
