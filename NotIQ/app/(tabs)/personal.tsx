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
import { useNotes } from "../../context/NotesContext";

const COLORS = {
  primary: "#9B5DE5",
  primaryLight: "#B98AF1",
  bg: "#F7F3FF",
  white: "#FFFFFF",
  textDark: "#37304D",
  textLight: "#7A7297",
};

export default function PersonalNotesScreen() {
  const { notes, isLoading, deleteNote, sortNotes } = useNotes();
  const router = useRouter();
  const [personalNotes, setPersonalNotes] = useState(notes);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(personalNotes);
  const [sortBy, setSortBy] = useState<"dateAdded" | "dateEdited">("dateAdded");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    const personal = notes.filter(
      (note) => note.category.toLowerCase() === "personal"
    );
    const sorted = sortNotes(sortBy, sortOrder).filter(
      (note) => note.category.toLowerCase() === "personal"
    );
    setPersonalNotes(sorted);

    if (searchQuery) {
      const filtered = sorted.filter(
        (note) =>
          (note.title &&
            note.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(sorted);
    }
  }, [notes, searchQuery, sortBy, sortOrder]);

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${noteTitle || "Untitled"}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteNote(noteId),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const renderNote = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => router.push(`/edit-note?id=${item.id}`)}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title || "Untitled"}
        </Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>Personal</Text>
        </View>
      </View>
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.content}
      </Text>
      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>
          {item.dateEdited
            ? "Edited: " + formatDate(item.dateEdited)
            : "Added: " + formatDate(item.dateAdded)}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNote(item.id, item.title)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
      {/* Header: Title + Profile */}
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

        {/* Search & Filter */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textLight}
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
        contentContainerStyle={styles.notesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="person-outline"
              size={64}
              color={COLORS.textLight}
            />
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No personal notes found"
                : "No personal notes yet. Create your first personal note!"}
            </Text>
          </View>
        }
      />

      {/* Add Note Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-note")}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.primary },
  profileButton: {},

  searchRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.primaryLight + "20",
    color: COLORS.textDark,
  },
  filterButton: { flexDirection: "row", alignItems: "center", marginLeft: 12 },
  filterText: { marginLeft: 6, color: COLORS.primary, fontWeight: "600" },

  notesList: { padding: 15 },
  noteCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: { color: COLORS.white, fontSize: 12, fontWeight: "500" },
  noteContent: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 10,
  },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteDate: { fontSize: 12, color: COLORS.textLight },
  deleteButton: { padding: 5 },

  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 15,
    textAlign: "center",
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
