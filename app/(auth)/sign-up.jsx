import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { signUp } from "../../lib/firebase";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const handleSignUp = async () => {
    try {
      const user = await signUp(email, password, username);
      setUser(user);
      setIsLoggedIn(true);
      Alert.alert("Signed Up", `Welcome ${username}!`);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-secondary px-6">
      <Text className="text-3xl font-pbold text-primary mb-6">Sign Up</Text>
      <TextInput
        className="w-full p-4 mb-4 bg-gray-100 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-full p-4 mb-4 bg-gray-100 rounded"
        placeholder="Username" // Add username input
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="w-full p-4 mb-6 bg-gray-100 rounded"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} color="#FFC5C5" />
    </View>
  );
};

export default SignUp;
