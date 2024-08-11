import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  Button,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableHighlight,
  Alert,
  Animated,
} from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import {
  getUserDetailsByEmail,
  signOutUser,
  getCurrentUser,
  fetchFavoritedTrips,
  uploadProfilePicture,
} from "../../lib/firebase";
import { router } from "expo-router";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [favoritedTrips, setFavoritedTrips] = useState([]);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        const trips = await fetchFavoritedTrips(currentUser.uid);
        setFavoritedTrips(trips);
      } catch (error) {
        console.error("Error fetching favorited trips: ", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user?.email) {
      getUserDetailsByEmail(user.email)
        .then(({ username, photoURL }) => {
          setUsername(username);
          setPhotoURL(photoURL);
        })
        .catch((error) => {
          console.error("Error getting user details:", error.message);
        });
    }
  }, [user?.email]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleExpandCollapse = (index) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const currentUser = await getCurrentUser();
      const trips = await fetchFavoritedTrips(currentUser.uid);
      setFavoritedTrips(trips);
    } catch (error) {
      console.error("Error refreshing favorited trips: ", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleImageUpload = () => {
    Alert.alert(
      "Select Photo",
      "Choose a method to upload your profile picture",
      [
        {
          text: "Camera",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });
            handleImageResponse(result);
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });
            handleImageResponse(result);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handleImageResponse = async (result) => {
    if (result.cancelled) {
      console.log("User cancelled image picker");
    } else if (result.error) {
      console.error("ImagePicker Error: ", result.error);
    } else {
      const uri = result.assets[0].uri;
      setImageLoading(true);
      try {
        const photoURL = await uploadProfilePicture(user.uid, uri);
        setPhotoURL(photoURL);
      } catch (error) {
        console.error("Error updating profile picture:", error.message);
      } finally {
        setImageLoading(false);
      }
    }
  };

  const renderItem = ({ item, index }) => {
    if (item.type === "profile") {
      return null;
    } else {
      return (
        <View className="p-4 border-b border-gray-300">
          <TouchableOpacity onPress={() => handleExpandCollapse(index)}>
            <Text className="text-lg font-pbold">Trip {index}</Text>
          </TouchableOpacity>
          {expandedIndex === index && (
            <View>
              <Text className="text-lg font-pbold">Accommodation Options:</Text>
              {item.accommodation_options.map((option, idx) => (
                <Text key={idx} className="text-gray-500">
                  - {option}
                </Text>
              ))}
              <Text className="text-lg font-pbold">Activities:</Text>
              {item.activities.map((activity, idx) => (
                <Text key={idx} className="text-gray-500">
                  - {activity}
                </Text>
              ))}
              <Text className="text-lg font-pbold">Tips:</Text>
              {item.tips.map((tip, idx) => (
                <Text key={idx} className="text-gray-500">
                  - {tip}
                </Text>
              ))}
            </View>
          )}
        </View>
      );
    }
  };

  const profileHeight = Dimensions.get("window").height * 0.5; // Adjust the height as needed

  const listData = loading
    ? []
    : [
        { type: "profile" },
        ...favoritedTrips.map((trip, index) => ({
          ...trip,
          type: "trip",
          index,
        })),
      ];

  const renderProfile = () => {
    const animatedTranslateY = scrollY.interpolate({
      inputRange: [0, profileHeight - 100],
      outputRange: [0, -profileHeight + 100],
      extrapolate: "clamp",
    });

    const animatedScale = scrollY.interpolate({
      inputRange: [0, profileHeight - 100],
      outputRange: [1, 0.7],
      extrapolate: "clamp",
    });

    const animatedOpacity = scrollY.interpolate({
      inputRange: [0, profileHeight - 100],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          height: profileHeight,
          transform: [
            { translateY: animatedTranslateY },
            { scale: animatedScale },
          ],
          opacity: animatedOpacity,
          backgroundColor: "white",
          overflow: "hidden",
        }}
        className="relative"
      >
        <Image
          source={{ uri: photoURL || "https://via.placeholder.com/150" }}
          style={{ width: "100%", height: "100%", position: "absolute" }}
        />
        <TouchableHighlight
          underlayColor="#e0e0e0"
          onPress={handleImageUpload}
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            transform: [{ translateX: -25 }, { translateY: -25 }],
            zIndex: 1,
          }}
        >
          <View className="absolute top-6 left-3 bg-last p-2 rounded-full">
            <Text className="text-white font-bold">+</Text>
          </View>
        </TouchableHighlight>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
          }}
        >
          <Text className="text-2xl font-pbold text-last mb-2">
            {username || "User Name"}
          </Text>
          <Text className="text-lg font-psemibold text-last mb-5">
            {user?.email || "user@example.com"}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#FF6347", // Replace with your theme color
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              width: "40%",
              alignItems: "center",
            }}
            onPress={handleSignOut}
          >
            <Text
              className="font-pbold"
              style={{ color: "white", fontSize: 16 }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={() => (
        <>
          {renderProfile()}
          {!loading && (
            <Text className="text-xl text-center font-pbold mb-4 mt-5">
              Favorites
            </Text>
          )}
        </>
      )}
      data={listData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      ListEmptyComponent={() =>
        loading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FFC5C5" />
          </View>
        )
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
    />
  );
};

export default Profile;
