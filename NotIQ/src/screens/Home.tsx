import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React from "react";
import CategoryCard from "../components/CategoryCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  CreateNote: undefined;
  Category: { name: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const Home: React.FC<Props> = ({ navigation }) => {
  const categories = [
    { name: "Work", color: "#d0b3ff" },
    { name: "Study", color: "#ffc4e1" },
    { name: "Personal", color: "#b8e8ff" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>NotIQ</Text>
        <Text style={styles.subtitle}>Your Notes</Text>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {categories.map((cat, i) => (
            <CategoryCard
              key={i}
              name={cat.name}
              color={cat.color}
              onPress={() =>
                navigation.navigate("Category", { name: cat.name })
              }
            />
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateNote")}
        >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f2ff",
    width: '100%',
    minHeight: '100%'
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#6a00ff",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#555",
  },
  scrollContent: {
    paddingBottom: 100, // Make space for the floating button
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#6a00ff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  addText: {
    color: "#fff",
    fontSize: 34,
    marginTop: -3,
  },
});
