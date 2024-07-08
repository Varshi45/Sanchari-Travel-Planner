import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useGlobalContext } from "../../context/GlobalProvider";
import * as Location from "expo-location";
import { signOutUser, getUsernameByEmail } from "../../lib/firebase";
import { getLatLong, getPopularDestinations } from "../../lib/gemini";
import { router } from "expo-router";
import WeatherInfo from "../../components/WeatherInfo";
import UserInfo from "../../components/UserInfo";
import PopularDestinations from "../../components/popularDestinations";

const Home = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [foundLocation, setFoundLocation] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [username, setUsername] = useState("");
  const mapViewRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isMapMoved, setIsMapMoved] = useState(false);

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied."
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCoordinates({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (user?.email) {
      getUsernameByEmail(user.email)
        .then((username) => {
          setUsername(username);
        })
        .catch((error) => {
          console.error("Error getting username:", error.message);
        });
    }
  }, [user?.email]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      setIsLoggedIn(false);
      Alert.alert("Success", "You have signed out successfully.");
      router.push("/sign-in");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const newCoordinates = await getLatLong(searchQuery);
      setFoundLocation({
        id: Date.now(),
        name: searchQuery,
        coordinates: newCoordinates,
      });
      setCoordinates(newCoordinates);
      setSearchQuery("");
      Alert.alert("Location Found", `Showing location: ${searchQuery}`);

      if (mapViewRef.current) {
        mapViewRef.current.animateToRegion({
          latitude: newCoordinates.latitude,
          longitude: newCoordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      setFoundLocation(null);
      Alert.alert(
        "Location Not Found",
        `No location found for: ${searchQuery}`
      );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCurrentLocation();
    setSearchQuery("");
    setRefreshing(false);
  };

  const handleRegionChangeComplete = () => {
    setIsMapMoved(true);
  };

  const resetMapToCurrentLocation = () => {
    if (mapViewRef.current && coordinates) {
      mapViewRef.current.animateToRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setIsMapMoved(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 p-4 bg-secondary-100"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="h-[75vh] justify-center items-center mt-4 mb-4">
        <Text className="text-3xl m-4 font-bold">Welcome, {username}!</Text>
        <TextInput
          className="border w-full border-gray-300 py-2 px-4 mb-4"
          placeholder="Search for a place..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
        />
      </View>
      <WeatherInfo
        latitude={foundLocation?.coordinates?.latitude || coordinates?.latitude}
        longitude={
          foundLocation?.coordinates?.longitude || coordinates?.longitude
        }
        title={
          foundLocation
            ? `${foundLocation.name}'s Weather`
            : "Weather in Your Location"
        }
      />
      <View className="h-80 mb-4">
        {coordinates ? (
          <MapView
            ref={mapViewRef}
            style={{ flex: 1 }}
            region={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onRegionChangeComplete={handleRegionChangeComplete}
          >
            {foundLocation ? (
              <Marker
                key={foundLocation.id}
                coordinate={foundLocation.coordinates}
                title={foundLocation.name}
              />
            ) : (
              <Marker coordinate={coordinates} title="Your Location" />
            )}
          </MapView>
        ) : (
          <Text>Loading map...</Text>
        )}
        {isMapMoved && (
          <TouchableOpacity
            onPress={resetMapToCurrentLocation}
            className="absolute bottom-4 right-4 bg-blue-500 py-2 px-4 rounded-full"
          >
            <Text className="font-pbold text-black">+</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* <UserInfo user={user} /> */}
      <PopularDestinations
        latitude={coordinates?.latitude}
        longitude={coordinates?.longitude}
      />
    </ScrollView>
  );
};

export default Home;
