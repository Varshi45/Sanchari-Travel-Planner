import React from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

const TripItinerary = ({
  itinerary,
  activities,
  accommodationOptions,
  tips,
  isLoading,
  onAddToFavourites,
  addingToFavourites,
}) => {
  return (
    <View className="mt-5 p-4 bg-primary rounded">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFC5C5" />
        </View>
      ) : (
        <>
          <Text className="text-lg font-pbold mb-2">Trip Itinerary:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            className="mb-4"
          >
            {itinerary.map((dayPlan) => (
              <View
                key={dayPlan.day}
                className="w-80 bg-secondary border border-gray-300 p-4 rounded mr-2"
              >
                <Text className="text-xl font-psemibold mb-2">
                  Day {dayPlan.day}
                </Text>
                {dayPlan.activities.map((activity, index) => (
                  <Text key={index} className="mb-1">
                    - {activity}
                  </Text>
                ))}
                <Text className="font-psemibold mt-2">Accommodation:</Text>
                <Text>{dayPlan.accommodation}</Text>
              </View>
            ))}
          </ScrollView>

          <Text className="text-lg font-pbold mt-4 mb-2">Activities:</Text>
          {activities.map((activity, index) => (
            <Text key={index} className="mb-1">
              - {activity}
            </Text>
          ))}

          <Text className="text-lg font-pbold mt-4 mb-2">
            Accommodation Options:
          </Text>
          {accommodationOptions.map((option, index) => (
            <Text key={index} className="mb-1">
              - {option}
            </Text>
          ))}

          <Text className="text-lg font-pbold mt-4 mb-2">Travel Tips:</Text>
          {tips.map((tip, index) => (
            <Text key={index} className="mb-1">
              - {tip}
            </Text>
          ))}

          <TouchableOpacity
            className="bg-green-500 py-2 px-4 rounded mb-4"
            onPress={onAddToFavourites}
            disabled={addingToFavourites}
          >
            <View className="flex-row bg-secondary justify-center items-center mb-6 mt-6">
              {addingToFavourites ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text className="text-terinary text-lg font-psemibold">
                  Add to Favourites
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default TripItinerary;
