import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="map" />
        <Stack.Screen name="wardrobe" />
        <Stack.Screen name="lesson" />
        <Stack.Screen name="reward" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
