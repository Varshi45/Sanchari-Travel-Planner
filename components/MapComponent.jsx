import React from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapComponent = ({ coordinates, foundLocation, mapViewRef }) => {
  // console.log(coordinates);
  // console.log(foundLocation);
  // console.log(mapViewRef);
  return (
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
    </View>
  );
};

export default MapComponent;
