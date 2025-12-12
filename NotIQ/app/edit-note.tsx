import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNotes } from "../context/NotesContext";

const COLORS = {
  primary: "#9B5DE5",
  primaryLight: "#B98AF1",
  bg: "#F7F3FF",
  white: "#FFFFFF",
  textDark: "#37304D",
  textLight: "#7A7297",
};

const categories = ["Work", "Study", "Personal", "Ideas"];

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams();
  const { notes, updateNote, deleteNote } = useNotes();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [noteExists, setNoteExists] = useState(false);

  useEffect(() => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setTitle(note.title || "");
      setContent(note.content);
      setCategory(note.category);
      setNoteExists(true);
    } else {
      setNoteExists(false);
    }
  }, [id, notes]);

  const handleSave = async () => {
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Error", "Please enter note content");
      return;
    }

    setIsLoading(true);
    try {
      await updateNote(
        id as string,
        title.trim() || undefined,
        content.trim(),
        category
      );
      Alert.alert("Success", "Note updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            await deleteNote(id as string);
            Alert.alert("Success", "Note deleted successfully!", [
              { text: "OK", onPress: () => router.back() },
            ]);
          } catch (error) {
            Alert.alert("Error", "Failed to delete note. Please try again.");
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  if (!noteExists) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="document-text-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>Note not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.form}>
          <Text style={styles.label}>Title (Optional)</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Enter note title..."
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
            editable={!isLoading && !isDeleting}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              enabled={!isLoading && !isDeleting}
              dropdownIconColor={COLORS.primary}
              style={styles.picker}
            >
              {categories.map((cat) => (
                <Picker.Item label={cat} value={cat} key={cat} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Content *</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Enter your note content..."
            placeholderTextColor={COLORS.textLight}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            editable={!isLoading && !isDeleting}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                (isLoading || isDeleting) && styles.buttonDisabled,
              ]}
              onPress={handleDelete}
              disabled={isLoading || isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FF3B30" />
              ) : (
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                (isLoading || isDeleting) && styles.buttonDisabled,
              ]}
              onPress={() => router.back()}
              disabled={isLoading || isDeleting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (isLoading || isDeleting) && styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={isLoading || isDeleting}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: 15,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  form: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#E6DFFD",
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    backgroundColor: COLORS.bg,
    marginBottom: 20,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#E6DFFD",
    borderRadius: 14,
    backgroundColor: COLORS.bg,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: COLORS.textDark,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: "#E6DFFD",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    backgroundColor: COLORS.bg,
    minHeight: 220,
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  deleteButton: {
    width: 50,
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6DFFD",
    alignItems: "center",
    backgroundColor: COLORS.bg,
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  saveButton: {
    flex: 2,
    padding: 16,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
