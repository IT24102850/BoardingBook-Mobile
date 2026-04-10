import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import NotificationItem from '../components/NotificationItem';

const RequestsScreen = () => {
  const requests = useSelector(state => state.roommate.requests);

  const renderItem = ({ item }) => (
    <NotificationItem notification={item} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incoming Requests</Text>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default RequestsScreen;