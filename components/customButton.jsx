import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({ onPress, title, containerStyles, textStyles }) => {
  return (
    <View className={`${containerStyles} items-center w-full rounded-lg mb-4`}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text className={`${textStyles}`}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
