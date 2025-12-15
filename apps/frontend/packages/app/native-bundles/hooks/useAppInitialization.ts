import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useLoadSession } from 'app/native-bundles/auth/hooks/useLoadSession';

export const useAppInitialization = () => {
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_Thin: require('@tamagui/font-inter/otf/Inter-Light.otf'),
    Inter_ExtraLight: require('@tamagui/font-inter/otf/Inter-ExtraLight.otf'),
    Inter_Light: require('@tamagui/font-inter/otf/Inter-Light.otf'),
    Inter_Regular: require('@tamagui/font-inter/otf/Inter-Regular.otf'),
    Inter_Medium: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    Inter_SemiBold: require('@tamagui/font-inter/otf/Inter-SemiBold.otf'),
    Inter_Bold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  useLoadSession();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [fontsLoaded]);

  return appReady;
};
