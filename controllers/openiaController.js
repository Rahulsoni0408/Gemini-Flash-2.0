const { GoogleGenAI } = require('@google/genai');
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY, // Ensure API key is set in .env
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


exports.summaryController = async (req, res) => {
  try {

    const { text } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Summarize this \n${text}`,
    });
    
    if (response) {
      if (response.text) {
        console.log(response.text);
        return res.status(200).json(response.text);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err.message,
    });
  }
};


exports.paragraphController = async (req, res) => {
  try {

    const { text } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `write a detail paragraph about \n${text}`,
    });

    if (response) {
      if (response.text) {
        console.log(response.text);
        return res.status(200).json(response.text);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err.message,
    });
  }
};


exports.chatbotController = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: text,
    });

    if (response && response.text ) {
      console.log(response.text);
      return res.status(200).json(response.text);
    } else {
      throw new Error("No response or choices from OpenAI");
    }
  } catch (err) {
    console.error("Error occurred:", err);  // Log any error
    return res.status(500).json({ message: err.message });
  }
};


exports.jsconverterController = async (req, res) => {
  try {

    const { text } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `/* convert these instruction into javascript code \n${text}`,
    });

    if (response) {
      if (response.text) {
        console.log(response.text);
        return res.status(200).json(response.text);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err.message,
    });
  }
};


exports.scifiImageController = async (req, res) => {
  try {
    const { text } = req.body;
    const data = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: `generate a scifi image of ${text}`,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    console.log(data.candidates[0].content);

    let responseText = "";
    let imageBase64 = "";

    for (const part of data.candidates[0].content.parts) {
      if (part.text) {
        responseText = part.text; // Store text response
      } else if (part.inlineData) {
        imageBase64 = part.inlineData.data; // Store image as base64
      }
    }

    // Send the response as JSON to the frontend
    return res.status(200).json({
      text: responseText,
      image: imageBase64 ? `data:image/png;base64,${imageBase64}` : null, // Embed image in base64 format
    });

  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: err.message,
    });
  }
};
