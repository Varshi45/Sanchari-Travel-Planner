import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

const Explore = () => {
  return (
    <ScrollView className="flex-1 bg-primary px-6 py-4">
      {/* Back Button */}
      <View className="z-50 absolute top-6 left-4 bg-primary p-3 rounded-full">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={32} color="#FFC5C5" />
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View className="relative bg-terinary rounded-lg overflow-hidden mt-6 mb-6">
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqmFSTW2lCAaqwHccDA7Z6vYwi8DhHnw0CCQ&s",
          }} // Replace with your image URL
          style={{ width: "100%", height: 200, resizeMode: "cover" }}
        />
      </View>

      {/* Main Content */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <Text className="text-4xl font-pbold text-terinary text-center px-4">
          Discover Sanchari !!
        </Text>
        <Text className="text-lg font-pregular text-gray-800 mb-4">
          Welcome to Sanchari, your ultimate travel companion! Our app helps you
          explore new destinations, plan your trips, and create unforgettable
          memories.
        </Text>
        <Text className="text-lg font-pregular text-gray-800 mb-4">
          With Sanchari, you can:
        </Text>
        <View className="ml-4 mb-4">
          <Text className="text-lg font-pregular text-gray-800 mb-2">
            ✨ Discover exciting travel destinations
          </Text>
          <Text className="text-lg font-pregular text-gray-800 mb-2">
            🗺️ Plan your trips with detailed itineraries
          </Text>
          <Text className="text-lg font-pregular text-gray-800 mb-2">
            📈 Get personalized travel recommendations
          </Text>
          <Text className="text-lg font-pregular text-gray-800 mb-2">
            🌦️ Check real-time weather updates for your destinations
          </Text>
        </View>
        <Text className="text-lg font-pregular text-gray-800 mb-4">
          Our app uses Google's Gemini and real-time data to provide you with
          the best travel plans tailored to your preferences.
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-center space-x-4 gap-4 mb-6">
        <View className="bg-button p-4 rounded-full shadow-md flex-1 max-w-xs">
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text className="text-white font-pbold text-center text-lg">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-button p-4 rounded-full shadow-md flex-1 max-w-xs">
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text className="text-white font-pbold text-center text-lg">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Explore;
