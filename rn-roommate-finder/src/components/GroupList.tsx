import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const GroupList = ({ groups }) => {
  const renderItem = ({ item }) => (
    <View style={styles.groupItem}>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.memberCount}>{item.memberCount} members</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  groupItem: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default GroupList;