import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MotiView } from "moti";
import { useNotes } from "../../context/NotesContext";

const COLORS = {
  primary: "#9B5DE5", // Purple theme
  primaryLight: "#B98AF1",
  bg: "#F7F3FF",
  white: "#FFFFFF",
  textDark: "#37304D",
  textLight: "#7A7297",
};

const CATEGORY_COLORS: any = {
  work: "#FEC260",
  study: "#4DD4AC",
  personal: "#FF6B6B",
  ideas: "#8AB4F8",
  other: "#C4C4C4",
};

export default function AllNotesScreen() {
  const { notes, isLoading, deleteNote, sortNotes } = useNotes();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [sortBy, setSortBy] = useState<"dateAdded" | "dateEdited">("dateAdded");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const sorted = sortNotes(sortBy, sortOrder);

    if (searchQuery) {
      const filtered = sorted.filter(
        (note) =>
          (note.title &&
            note.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(sorted);
    }
  }, [notes, searchQuery, sortBy, sortOrder]);

  const handleDeleteNote = (noteId: string, title: string) => {
    Alert.alert("Delete Note", `Remove "${title || "Untitled"}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteNote(noteId),
      },
    ]);
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getCatColor = (cat: string) =>
    CATEGORY_COLORS[cat.toLowerCase()] || CATEGORY_COLORS.other;

  const renderNote = ({ item, index }: any) => (
    <MotiView
      from={{ opacity: 0, translateY: 20, rotate: "-2deg" }}
      animate={{
        opacity: 1,
        translateY: 0,
        rotate: index % 2 === 0 ? "-1deg" : "1deg",
      }}
      transition={{ delay: index * 120, damping: 12 }}
    >
      <TouchableOpacity
        style={[
          styles.noteCard,
          { backgroundColor: getCatColor(item.category) },
        ]}
        onPress={() => router.push(`/edit-note?id=${item.id}`)}
      >
        <View style={styles.noteHeader}>
          <Ionicons
            name="document-text-outline"
            size={22}
            color={COLORS.textDark}
          />

          <Text style={styles.noteTitle} numberOfLines={1}>
            {item.title || "Untitled"}
          </Text>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        <Text style={styles.noteContent} numberOfLines={3}>
          {item.content}
        </Text>

        <View style={styles.noteFooter}>
          <Text style={styles.noteDate}>
            {item.dateEdited
              ? `Edited: ${formatDate(item.dateEdited)}`
              : `Added: ${formatDate(item.dateAdded)}`}
          </Text>

          <TouchableOpacity
            onPress={() => handleDeleteNote(item.id, item.title)}
          >
            <Ionicons name="trash" size={20} color="#B00020" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </MotiView>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Notes</Text>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search notes..."
        placeholderTextColor="#a8a0c2"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Sorting */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "dateAdded" && styles.sortActive,
          ]}
          onPress={() => setSortBy("dateAdded")}
        >
          <Text
            style={[
              styles.sortText,
              sortBy === "dateAdded" && styles.sortTextActive,
            ]}
          >
            Date Added
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortButton,
            sortBy === "dateEdited" && styles.sortActive,
          ]}
          onPress={() => setSortBy("dateEdited")}
        >
          <Text
            style={[
              styles.sortText,
              sortBy === "dateEdited" && styles.sortTextActive,
            ]}
          >
            Date Edited
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          <Ionicons
            name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-note")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  profileButton: {
    backgroundColor: COLORS.primary,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  searchInput: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E6DFFD",
  },

  sortContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  sortButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: "#ECE6FF",
    borderRadius: 10,
  },

  sortActive: {
    backgroundColor: COLORS.primary,
  },

  sortText: {
    textAlign: "center",
    color: COLORS.textLight,
    fontWeight: "600",
    fontSize: 13,
  },

  sortTextActive: {
    color: COLORS.white,
  },

  orderButton: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  noteCard: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    transform: [{ rotate: "-1deg" }], // sticky note feel
  },

  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },

  noteTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  categoryBadge: {
    backgroundColor: "#00000033",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  categoryText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },

  noteContent: {
    fontSize: 15,
    color: COLORS.textDark,
    marginBottom: 10,
  },

  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  noteDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  addButton: {
    position: "absolute",
    bottom: 28,
    right: 28,
    backgroundColor: COLORS.primary,
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
