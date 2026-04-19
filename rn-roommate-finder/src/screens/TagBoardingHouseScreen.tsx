
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { fetchBoardingHouses } from '../api/tagBoardingHouseApi';


const TagBoardingHouseScreen: React.FC = () => {
  const [boardingHouses, setBoardingHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoardingHouses = async () => {
      try {
        const data = await fetchBoardingHouses();
        setBoardingHouses(data);
      } catch (err: any) {
        setError('Failed to load boarding houses');
      } finally {
        setLoading(false);
      }
    };
    loadBoardingHouses();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tag Current or Planned Boarding House</Text>
      <FlatList
        data={boardingHouses}
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

export default TagBoardingHouseScreen;
