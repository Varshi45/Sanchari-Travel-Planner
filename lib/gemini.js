//lib\gemini.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
import Constants from "expo-constants";

const apiKey = new GoogleGenerativeAI(
  Constants.expoConfig.extra.GEMINI_API_KEY
);

let model;

async function initializeModel() {
  try {
    model = apiKey.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch (error) {
    console.error("Error initializing model:", error.message);
    throw error;
  }
}

initializeModel();

export async function getLatLong(city) {
  const prompt = `give only the latitude and longitude of ${city} only in JSON format. Strictly no extra text`;

  try {
    if (!model) {
      await initializeModel();
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();
    text = text.replace(/^```json|```$/g, "").trim();
    // console.log("Response:", text);
    const data = JSON.parse(text);

    if (data && data.latitude && data.longitude) {
      return { latitude: data.latitude, longitude: data.longitude };
    } else {
      throw new Error("Location not found or invalid format");
    }
  } catch (error) {
    console.error("Error fetching location:", error.message);
    throw error;
  }
}

export async function getPopularDestinations(latitude, longitude) {
  const prompt = `get a minimum 10 popular destinations near ${latitude},${longitude} only in JSON format with attributes destination name, distance, type, and description. Strictly no extra text`;

  try {
    if (!model) {
      await initializeModel();
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();
    text = text.replace(/^```json|```$/g, "").trim();
    // console.log("Response:", text);
    const data = JSON.parse(text);

    if (Array.isArray(data)) {
      const destinationsWithKeys = data.map((destination, index) => ({
        ...destination,
        id: index.toString(),
      }));

      return destinationsWithKeys;
    } else {
      throw new Error("Popular destinations not found or invalid format");
    }
  } catch (error) {
    console.error("Error fetching popular destinations:", error.message);
    throw error;
  }
}

export async function getTripPlan(destination, travelers, pets, budget, days) {
  const prompt = `Create a detailed trip plan for a trip to ${destination}. The response should be in JSON format with the following structure:
  {
    "itinerary": [
      {
        "day": <day_number>,
        "activities": ["<activity1>", "<activity2>", ...],
        "accommodation": "<accommodation_name>"
      },
      ...
    ],
    "activities": ["<activity1>", "<activity2>", ...],
    "accommodation_options": ["<option1>", "<option2>", ...],
    "tips": ["<tip1>", "<tip2>", ...]
  }
  The details should be based on the following:
  - Travelers: ${travelers}
  - Pets: ${pets}
  - Budget: ${budget}
  - Number of Days: ${days}
  Ensure that the response does not contain any extra text or explanations outside the JSON format.`;

  try {
    if (!model) {
      await initializeModel();
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();
    text = text.replace(/^```json|```$/g, "").trim();
    // console.log(text);
    const data = JSON.parse(text);

    return data;
  } catch (error) {
    console.error("Error fetching trip plan:", error.message);
    throw error;
  }
}

///weather api calls

async function fetchWeather(latitude, longitude) {
  const WeatherApiKey = Constants.expoConfig.extra.WEATHER_API_KEY;
  const WeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${WeatherApiKey}`;

  try {
    const response = await fetch(WeatherApiUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    throw error; // Rethrow to handle it where fetchWeather is called
  }
}

export async function getWeatherInfo(latitude, longitude) {
  if (!latitude || !longitude) {
    throw new Error(
      "Latitude and longitude are required for weather information."
    );
  }

  try {
    const weatherData = await fetchWeather(latitude, longitude);
    return weatherData;
  } catch (error) {
    console.error("Error getting weather information:", error.message);
    throw error; // Rethrow to handle it in the calling component
  }
}
