// components/PopularDestinations.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { getPopularDestinations } from "../lib/gemini";
import { useGlobalContext } from "../context/GlobalProvider";

const PopularDestinations = ({ latitude, longitude }) => {
  const [destinations, setDestinations] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const { isLoading, setIsLoading } = useGlobalContext();

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      try {
        const data = await getPopularDestinations(latitude, longitude);
        setDestinations(data);
      } catch (error) {
        console.error("Error fetching popular destinations:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchDestinations();
    }
  }, [latitude, longitude]);

  const toggleModal = (destination) => {
    setSelectedDestination(destination);
    setModalVisible(!isModalVisible);
  };

  return (
    <View className="mt-20 mb-8">
      <Text className="font-pbold text-xl mb-10">Popular Destinations</Text>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFC5C5" />
          <Text className="mt-4 text-gray-500">Loading destinations...</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {destinations.map((destination) => (
            <TouchableOpacity
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
              onPress={() => toggleModal(destination)}
            >
              <Text className="text-16 font-pbold">
                {destination.destination_name}
              </Text>
              <View className="mt-7">
                {/* <Text>{destination.distance}</Text> */}
                <Text>{destination.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <Modal
        isVisible={isModalVisible}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-4">
          <Text className="text-terinary font-pbold text-lg mb-2 text-center">
            {selectedDestination?.destination_name}
          </Text>
          <Text className="text-gray-700 mb-4 text-center">
            {selectedDestination?.description}
          </Text>
          <View className="bg-button p-2 rounded-full">
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text className="text-terinary text-center font-psemibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PopularDestinations;
