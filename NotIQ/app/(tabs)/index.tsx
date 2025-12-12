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
  Modal,
  TouchableWithoutFeedback,
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
};

export default function AllNotesScreen() {
  const { notes, isLoading, deleteNote, sortNotes } = useNotes();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [sortBy, setSortBy] = useState<"dateAdded" | "dateEdited">("dateAdded");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterVisible, setFilterVisible] = useState(false);

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
    CATEGORY_COLORS[cat.toLowerCase()] || "#CCC";

  const renderNote = ({ item, index }: any) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 120, damping: 12 }}
      style={{ flex: 1 }}
    >
      <TouchableOpacity
        style={styles.noteCard}
        onPress={() => router.push(`/edit-note?id=${item.id}`)}
      >
        {/* Top Icon */}
        <Ionicons
          name="document-text-outline"
          size={26}
          color="#4A4458"
          style={{ marginBottom: 6 }}
        />

        {/* Title */}
        <Text style={styles.noteTitle} numberOfLines={2}>
          {item.title || "Untitled"}
        </Text>

        {/* Category Dot */}
        <View
          style={[
            styles.categoryDot,
            { backgroundColor: getCatColor(item.category) },
          ]}
        />

        {/* Date */}
        <Text style={styles.noteDateSmall}>
          {item.dateEdited
            ? `Edited • ${formatDate(item.dateEdited)}`
            : `Added • ${formatDate(item.dateAdded)}`}
        </Text>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeleteNote(item.id, item.title)}
        >
          <Ionicons name="trash" size={22} color="#B00020" />
        </TouchableOpacity>
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
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>NotIQ</Text>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/profile")}
          >
            <Ionicons
              name="person-circle-outline"
              size={32}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Search + Filter */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons name="filter-outline" size={20} color={COLORS.primary} />
            <Text style={styles.filterText}>Sort</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sort Notes</Text>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setSortBy("dateAdded");
              setFilterVisible(false);
            }}
          >
            <Text style={styles.modalOptionText}>Date Added</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setSortBy("dateEdited");
              setFilterVisible(false);
            }}
          >
            <Text style={styles.modalOptionText}>Date Edited</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              setFilterVisible(false);
            }}
          >
            <Text style={styles.modalOptionText}>
              Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

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

  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: "700", color: COLORS.primary },
  profileButton: {
    backgroundColor: COLORS.primary + "20",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E6DFFD",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.primaryLight + "20",
    borderRadius: 12,
    marginLeft: 8,
  },
  filterText: {
    marginLeft: 6,
    color: COLORS.primary,
    fontWeight: "600",
  },

  noteCard: {
    height: 170,
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
    justifyContent: "flex-start",
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 6,
  },
  noteDateSmall: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  deleteBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 6,
    borderRadius: 12,
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

  modalOverlay: { flex: 1, backgroundColor: "#00000050" },
  modalContent: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.textDark,
  },
  modalOption: { paddingVertical: 10 },
  modalOptionText: { fontSize: 16, color: COLORS.textDark },
});
