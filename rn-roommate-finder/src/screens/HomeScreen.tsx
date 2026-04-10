import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Roommate Finder</Text>
      <Button
        title="Browse Profiles"
        onPress={() => navigation.navigate('BrowseProfiles')}
      />
      <Button
        title="Create Group"
        onPress={() => navigation.navigate('CreateGroup')}
      />
      <Button
        title="View Requests"
        onPress={() => navigation.navigate('Requests')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;