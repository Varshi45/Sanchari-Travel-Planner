// components/WeatherInfo.jsx

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { getWeatherInfo } from "../lib/gemini";
import { useGlobalContext } from "../context/GlobalProvider";

const WeatherInfo = ({ latitude, longitude, title }) => {
  const { isLoading, setIsLoading } = useGlobalContext(); // Use global state
  const [weather, setWeather] = useState(null);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      const data = await getWeatherInfo(latitude, longitude);
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchWeatherData();
    }
  }, [latitude, longitude, setIsLoading]);

  if (isLoading) {
    return (
      <View className="mb-6 flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FFC5C5" />
        <Text className="mt-4 text-lg">Loading weather...</Text>
      </View>
    );
  }
  if (!weather) {
    return (
      <View className="mb-6 flex-1 justify-center items-center">
        <Text className="text-lg">No weather data available</Text>
      </View>
    );
  }

  const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(0);
  const mpsToKmph = (speed) => (speed * 3.6).toFixed(0);

  return (
    <View className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <Text className="text-2xl font-pbold mb-2">{title}</Text>
      <Text className="text-lg">
        Current: {weather.weather[0].description},{" "}
        {kelvinToCelsius(weather.main.temp)}°C
      </Text>
      <Text className="text-lg">
        Feels like: {kelvinToCelsius(weather.main.feels_like)}°C
      </Text>
      <Text className="text-lg">
        Min: {kelvinToCelsius(weather.main.temp_min)}°C, Max:{" "}
        {kelvinToCelsius(weather.main.temp_max)}°C
      </Text>
      <Text className="text-lg">Humidity: {weather.main.humidity}%</Text>
      <Text className="text-lg">
        Wind: {mpsToKmph(weather.wind.speed)} KMPH
      </Text>
    </View>
  );
};

export default WeatherInfo;
