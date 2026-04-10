import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = ({ route }) => {
    const { profile } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}>Age: {profile.age}</Text>
            <Text style={styles.interests}>Interests: {profile.interests.join(', ')}</Text>
            <Text style={styles.preferences}>Preferences: {profile.preferences.join(', ')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    age: {
        fontSize: 18,
        marginVertical: 10,
    },
    interests: {
        fontSize: 16,
        marginVertical: 5,
    },
    preferences: {
        fontSize: 16,
        marginVertical: 5,
    },
});

export default ProfileScreen;