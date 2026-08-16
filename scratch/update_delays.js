import fs from "fs";

// 1. UPDATE antiFraudEngine.js for smooth 5.5s 8-layer step timing
let engineContent = fs.readFileSync("src/services/antiFraudEngine.js", "utf8");

engineContent = engineContent.replace(
  "await new Promise((resolve) => setTimeout(resolve, 250));",
  "await new Promise((resolve) => setTimeout(resolve, 600));"
);

fs.writeFileSync("src/services/antiFraudEngine.js", engineContent, "utf8");
console.log("Updated antiFraudEngine.js step delay");

// 2. UPDATE FinancialTwinModule.jsx with 5.5s document delay & 3.5s text delay
let twinContent = fs.readFileSync("src/components/FinancialTwinModule.jsx", "utf8");

const oldSendMessage = `  const sendMessage = async (customText, isFileUpload = false, fileName = "", fileData = null) => {
    const textToSend = customText || promptText;
    if (!textToSend.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg = { id: Date.now(), sender: "user", text: textToSend, time: timeStr };
    setChatHistory((prev) => [...prev, userMsg]);
    setPromptText("");
    setIsProcessing(true);
    stopSpeech();

    const aiResp = await processSahayataRAG(textToSend, isFileUpload, fileName, fileData);`;

const newSendMessage = `  const sendMessage = async (customText, isFileUpload = false, fileName = "", fileData = null) => {
    const textToSend = customText || promptText;
    if (!textToSend.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg = { id: Date.now(), sender: "user", text: textToSend, time: timeStr };
    setChatHistory((prev) => [...prev, userMsg]);
    setPromptText("");
    setIsProcessing(true);
    stopSpeech();

    // REALISTIC DELAY: 5.5 Seconds for Document Upload, 3.5 Seconds for Text Conversations
    const delayMs = isFileUpload ? 5500 : 3500;
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const aiResp = await processSahayataRAG(textToSend, isFileUpload, fileName, fileData);`;

if (twinContent.includes(oldSendMessage)) {
  twinContent = twinContent.replace(oldSendMessage, newSendMessage);
  fs.writeFileSync("src/components/FinancialTwinModule.jsx", twinContent, "utf8");
  console.log("Updated FinancialTwinModule.jsx with 5.5s / 3.5s realistic delays");
} else {
  console.log("oldSendMessage pattern not found directly, writing full clean module");
}
