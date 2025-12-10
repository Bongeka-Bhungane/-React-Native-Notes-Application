import CategoryCard from "@/src/components/CategoryCard";
import NoteCard from "@/src/components/NoteCard";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <NoteCard
        title="Shopping List"
        text="Buy milk, eggs, and bread from the store."
        date={new Date(new Date().getTime() - 5 * 60 * 1000)} // 5 minutes ago
      />
      <CategoryCard
      name="bongeka"
      color="purple"
      />
    </View>
  );
}
