import React from "react";
import { View, Text } from "react-native";

const UserInfo = ({ user }) => {
  return (
    <View className="mb-4">
      <Text className="text-lg font-bold">{user.email}</Text>
    </View>
  );
};

export default UserInfo;
