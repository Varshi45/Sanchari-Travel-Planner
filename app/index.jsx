//app\index.jsx

import { StatusBar } from "expo-status-bar";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Redirect } from "expo-router";
import CustomButton from "../components/customButton";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }
  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <ScrollView
        contentContainerStyle={{
          minHeight: "100%",
        }}
      >
        <View className="h-full bg-secondary w-full items-center justify-center px-6">
          <View className="">
            <Text className="text-4xl text-center font-pbold text-terinary mb-4">
              Welcome to Sanchari !!
            </Text>
            <Text className="text-lg font-pextralight text-center mb-8">
              Discover new places, plan your travels, and make unforgettable
              memories.
            </Text>
          </View>
          <CustomButton
            onPress={() => router.push("/explore")}
            title="Explore..."
            containerStyles="bg-secondary-100"
            textStyles="text-terinary font-psemibold py-2 px-4"
          />
          <CustomButton
            onPress={() => router.push("/sign-in")}
            title="Sign In"
            containerStyles="bg-secondary-100"
            textStyles="text-terinary font-psemibold py-2 px-4"
          />

          <CustomButton
            onPress={() => router.push("/sign-up")}
            title="Sign Up"
            containerStyles="bg-secondary-100"
            textStyles="text-terinary font-psemibold py-2 px-4"
          />
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
