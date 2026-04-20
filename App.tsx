import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoommateDiscoveryScreen from './rn-roommate-finder/src/screens/RoommateDiscoveryScreen';
import RoommateProfileScreen from './rn-roommate-finder/src/screens/RoommateProfileScreen';
import GroupFormationScreen from './src/screens/GroupFormationScreen';
import NotificationsScreen from './rn-roommate-finder/src/screens/NotificationsScreen';
import TagBoardingHouseScreen from './rn-roommate-finder/src/screens/TagBoardingHouseScreen';
import SettingsScreen from './rn-roommate-finder/src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoommateDiscovery">
        <Stack.Screen name="RoommateDiscovery" component={RoommateDiscoveryScreen} options={{ title: 'Find Roommates' }} />
        <Stack.Screen name="RoommateProfile" component={RoommateProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="GroupFormation" component={GroupFormationScreen} options={{ title: 'Form Group' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
        <Stack.Screen name="TagBoardingHouse" component={TagBoardingHouseScreen} options={{ title: 'Tag Boarding House' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
