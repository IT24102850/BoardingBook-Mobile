import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RoommateCardProps {
  name: string;
  age: number;
  interests: string[];
}

const RoommateCard: React.FC<RoommateCardProps> = ({ name, age, interests }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.age}>Age: {age}</Text>
      <Text style={styles.interests}>Interests: {interests.join(', ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 14,
    color: '#555',
  },
  interests: {
    fontSize: 14,
    color: '#777',
  },
});

export default RoommateCard;