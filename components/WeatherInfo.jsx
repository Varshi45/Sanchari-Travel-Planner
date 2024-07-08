import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { getWeatherInfo } from "../lib/gemini";

const WeatherInfo = ({ latitude, longitude, title }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const data = await getWeatherInfo(latitude, longitude);
        setWeather(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setLoading(false);
      }
    };

    if (latitude !== null && longitude !== null) {
      fetchWeatherData();
    }
  }, [latitude, longitude]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#D4E7C5" />
        <Text className="mt-4 text-lg">Loading weather...</Text>
      </View>
    );
  }
  if (!weather) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">No weather data available</Text>
      </View>
    );
  }

  return (
    <View className="p-4 bg-white rounded-lg shadow-md">
      <Text className="text-2xl font-bold mb-2">{title}</Text>
      <Text className="text-lg">
        Current: {weather.weather[0].description}, {weather.main.temp}°C
      </Text>
      <Text className="text-lg">Feels like: {weather.main.feels_like}°C</Text>
      <Text className="text-lg">
        Min: {weather.main.temp_min}°C, Max: {weather.main.temp_max}°C
      </Text>
      <Text className="text-lg">Humidity: {weather.main.humidity}%</Text>
      <Text className="text-lg">Wind: {weather.wind.speed} m/s</Text>
    </View>
  );
};

export default WeatherInfo;
