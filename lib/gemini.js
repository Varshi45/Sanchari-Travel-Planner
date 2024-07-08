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
  const prompt = `get a minimum 10 popular destinations near ${latitude},${longitude} only in JSON format with attributes destination name, distance, type, and image-link. Strictly no extra text`;

  try {
    if (!model) {
      await initializeModel();
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();
    text = text.replace(/^```json|```$/g, "").trim();
    console.log("Response:", text);
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

///weather api calls

async function fetchWeather(latitude, longitude) {
  const WeatherApiKey = Constants.expoConfig.extra.WEATHER_API_KEY;
  const WeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${WeatherApiKey}`;

  try {
    const response = await fetch(WeatherApiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

export async function getWeatherInfo(latitude, longitude) {
  try {
    const weatherData = await fetchWeather(latitude, longitude);
    return weatherData;
  } catch (error) {
    console.error("Error getting weather information:", error.message);
    throw error;
  }
}
