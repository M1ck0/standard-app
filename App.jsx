import { useEffect, useRef, useState } from 'react';

import WebView from 'react-native-webview';
import BootSplash from 'react-native-bootsplash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BackHandler, Platform, View } from 'react-native';

const Page = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  const webViewRef = useRef();

  const handleLinkClick = event => {
    if (event.navigationType === 'click') {
      navigation.push('Page', {
        link: event.mainDocumentURL,
      });
      return false;
    }

    return true;
  };

  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onAndroidBackPress,
        );
      };
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: '#fff',

        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <WebView
        ref={webViewRef}
        key={route?.params?.link}
        source={{ uri: route?.params?.link || 'https://standard.co.me/' }}
        style={{ flex: 1, height: '100%' }}
        onShouldStartLoadWithRequest={handleLinkClick}
        decelerationRate="normal"
        allowsBackForwardNavigationGestures={true}
      />
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  const [link, setLink] = useState(null);

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  OneSignal.initialize('adc74647-9b00-4b2e-bcb3-a3f2b54f4975');

  OneSignal.Notifications.requestPermission(true);

  OneSignal.Notifications.addEventListener('click', event => {
    if (Platform.OS === 'android') {
      setLink(
        JSON.parse(JSON.parse(event.notification.rawPayload).custom).a.novost,
      );
    } else {
      setLink(event.notification.rawPayload.custom.a.novost);
    }
  });

  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <NavigationContainer key={link}>
      <Stack.Navigator initialRouteName="Page">
        <Stack.Screen
          name="Page"
          component={Page}
          options={{ headerShown: false }}
          initialParams={{ link: link }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
