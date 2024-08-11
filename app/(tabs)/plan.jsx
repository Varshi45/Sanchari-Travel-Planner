import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getTripPlan } from "../../lib/gemini";
import { getCurrentUser, addTripToFavourites } from "../../lib/firebase";
import TripItinerary from "../../components/TripItinerary";

const PlanTrip = () => {
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("family");
  const [pets, setPets] = useState("no");
  const [budget, setBudget] = useState("1000-2000");
  const [days, setDays] = useState("");
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addingToFavourites, setAddingToFavourites] = useState(false);

  const handleSubmit = async () => {
    if (!destination || !days) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (parseInt(days, 10) > 15) {
      Alert.alert("Error", "Number of days cannot exceed 15.");
      return;
    }

    setLoading(true);
    try {
      const plan = await getTripPlan(
        destination,
        travelers,
        pets,
        budget,
        days
      );
      setTripPlan(plan);
    } catch (error) {
      console.error("Error planning trip:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavourites = async () => {
    if (!tripPlan) {
      Alert.alert("Error", "No trip plan to add to favourites.");
      return;
    }

    setAddingToFavourites(true);
    try {
      const user = await getCurrentUser();
      if (user) {
        await addTripToFavourites(user.uid, tripPlan);
        Alert.alert("Success", "Trip added to favourites!");
      } else {
        Alert.alert("Error", "User not logged in.");
      }
    } catch (error) {
      console.error("Error adding to favourites:", error.message);
      Alert.alert("Error", "Failed to add trip to favourites.");
    } finally {
      setAddingToFavourites(false);
    }
  };

  return (
    <ScrollView className="p-4 mt-6">
      <View className="bg-primary h-[75vh] justify-center p-4 rounded mb-4">
        <Text className="text-2xl font-pbold mb-4">Plan Your Trip</Text>

        <TextInput
          className="h-10 border border-gray-300 mb-3 px-2 rounded"
          placeholder="Where to plan?"
          value={destination}
          onChangeText={setDestination}
        />

        <Text className="text-lg font-pbold mb-2">How many are going?</Text>
        <Picker
          selectedValue={travelers}
          onValueChange={(itemValue) => setTravelers(itemValue)}
          className="h-12 border border-gray-300 mb-3 rounded"
        >
          <Picker.Item label="Family" value="family" />
          <Picker.Item label="Solo" value="solo" />
          <Picker.Item label="Friends" value="friends" />
          <Picker.Item label="Partner" value="partner" />
        </Picker>

        <Text className="text-lg font-pbold mb-2">Pets?</Text>
        <Picker
          selectedValue={pets}
          onValueChange={(itemValue) => setPets(itemValue)}
          className="h-12 border border-gray-300 mb-3 rounded"
        >
          <Picker.Item label="Yes" value="yes" />
          <Picker.Item label="No" value="no" />
        </Picker>

        <Text className="text-lg font-pbold mb-2">Budget range</Text>
        <Picker
          selectedValue={budget}
          onValueChange={(itemValue) => setBudget(itemValue)}
          className="h-12 border border-gray-300 mb-3 rounded"
        >
          <Picker.Item label="500 - 1000" value="500-1000" />
          <Picker.Item label="1000 - 2000" value="1000-2000" />
          <Picker.Item label="2000 - 3000" value="2000-3000" />
          <Picker.Item label="3000+" value="3000+" />
        </Picker>

        <TextInput
          className="h-10 border border-gray-300 mb-3 px-2 rounded"
          placeholder="Number of days (max 15)"
          keyboardType="numeric"
          value={days}
          onChangeText={(text) => setDays(text.replace(/[^0-9]/g, ""))}
        />

        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded mb-4 self-center"
          onPress={handleSubmit}
        >
          <View className="text-center bg-blue-500 py-2 px-4 rounded">
            <Text className="text-white text-lg font-pbold">Plan Trip</Text>
          </View>
        </TouchableOpacity>
      </View>

      {tripPlan && (
        <TripItinerary
          itinerary={tripPlan.itinerary}
          activities={tripPlan.activities}
          accommodationOptions={tripPlan.accommodation_options}
          tips={tripPlan.tips}
          isLoading={loading}
          onAddToFavourites={handleAddToFavourites}
          addingToFavourites={addingToFavourites}
        />
      )}

      {loading && (
        <View className="inset-0 bg-primary bg-opacity-50 justify-center items-center">
          <ActivityIndicator size="large" color="#FFC5C5" />
        </View>
      )}
    </ScrollView>
  );
};

export default PlanTrip;
