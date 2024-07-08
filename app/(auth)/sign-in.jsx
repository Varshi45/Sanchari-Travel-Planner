// SignIn.jsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { signIn } from "../../lib/firebase";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const handleSignIn = async () => {
    try {
      const user = await signIn(email, password);
      // console.log(user);
      setUser(user);
      setIsLoggedIn(true);
      Alert.alert("Signed In", `Welcome back ${user.email}!`);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-secondary px-6">
      <Text className="text-3xl font-pbold text-primary mb-6">Sign In</Text>
      <TextInput
        className="w-full p-4 mb-4 bg-gray-100 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-full p-4 mb-6 bg-gray-100 rounded"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} color="#FFC5C5" />
    </View>
  );
};

export default SignIn;
