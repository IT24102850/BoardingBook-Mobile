import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ProfileForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({ name, age, preferences });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        placeholder="Enter your age"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Preferences:</Text>
      <TextInput
        style={styles.input}
        value={preferences}
        onChangeText={setPreferences}
        placeholder="Enter your preferences"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default ProfileForm;