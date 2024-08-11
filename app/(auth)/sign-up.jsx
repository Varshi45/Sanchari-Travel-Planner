// app\(auth)\sign-up.jsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { signUp } from "../../lib/firebase";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import Ionicons from "react-native-vector-icons/Ionicons";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const user = await signUp(email, password, username);
      setUser(user);
      setIsLoggedIn(true);
      Alert.alert("Signed Up", `Welcome ${username}!`);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-secondary px-6">
      <View className="absolute top-6 left-6 bg-primary p-3 rounded-full">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={32} color="#FFC5C5" />
        </TouchableOpacity>
      </View>
      <Text className="text-3xl font-pbold text-terinary mb-6">Sign Up</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFC5C5" />
      ) : (
        <>
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
            placeholder="Username"
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
          <View className="mb-6">
            <Button title="Sign Up" onPress={handleSignUp} color="#FFC5C5" />
          </View>
          <View className="">
            <Button
              title="Already a user?"
              onPress={() => router.push("/sign-in")}
              color="#FFC5C5"
            />
          </View>
        </>
      )}
    </View>
  );
};

export default SignUp;
