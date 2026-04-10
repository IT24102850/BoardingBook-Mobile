import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NotificationItemProps {
  message: string;
  timestamp: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ message, timestamp }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  message: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default NotificationItem;