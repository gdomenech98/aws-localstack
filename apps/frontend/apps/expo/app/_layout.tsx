import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Provider } from 'app/provider'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Slot, SplashScreen } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAppInitialization } from 'app/native-bundles/hooks/useAppInitialization';

SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
  const appReady = useAppInitialization();
  const scheme = useColorScheme()

  // 👇🏼👇🏼👇🏼 Can't add hooks before this line 👇🏼👇🏼👇🏼
  if (!appReady) {
    return null
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider>
            <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Slot/>
            </ThemeProvider>
          </Provider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default MainLayout;
