
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { fetchGroups } from '../api/groupFormationApi';


const GroupFormationScreen: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchGroups();
        setGroups(data);
      } catch (err: any) {
        setError('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Group Formation & Invitations</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.name || JSON.stringify(item)}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default GroupFormationScreen;
