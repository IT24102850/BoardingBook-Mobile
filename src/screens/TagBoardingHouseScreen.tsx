import React from "react";
import { View, Text } from "react-native";

const TagBoardingHouseScreen: React.FC = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Tag Current or Planned Boarding House</Text>
    {/* UI for tagging a boarding house if 1 vacancy left or planning a new one */}
  </View>
);

export default TagBoardingHouseScreen;
