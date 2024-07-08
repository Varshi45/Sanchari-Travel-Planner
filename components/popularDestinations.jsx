// components/PopularDestinations.js

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { getPopularDestinations } from "../lib/gemini";

const PopularDestinations = ({ latitude, longitude }) => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getPopularDestinations(latitude, longitude);
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching popular destinations:", error.message);
      }
    };

    if (latitude && longitude) {
      fetchDestinations();
    }
  }, [latitude, longitude]);

  return (
    <View className="mt-20 mb-8">
      <Text className="font-pbold text-xl mb-10">Popular Destinations</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {destinations.map((destination) => (
          <View
            key={destination.id}
            style={{
              marginRight: 8,
              padding: 16,
              backgroundColor: "#f0f0f0",
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 1,
              width: 150,
            }}
          >
            <Image
              source={{ uri: destination.image }}
              style={{
                width: "100%",
                height: 100,
                borderRadius: 8,
                marginBottom: 8,
              }}
            />
            <Text className="text-16 font-bold">
              {destination.destination_name}
            </Text>
            <View className="mt-7">
              <Text>{destination.distance}</Text>
              <Text>{destination.type}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PopularDestinations;
