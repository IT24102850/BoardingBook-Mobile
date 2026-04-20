import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TemplateComponent = ({ title = 'Template Component' }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default TemplateComponent;
