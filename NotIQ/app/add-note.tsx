import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

export default function AddNoteScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(""); // default empty -> "Select"
  const [isLoading, setIsLoading] = useState(false);
  const { addNote } = useNotes();
  const router = useRouter();

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
      await addNote(title.trim() || undefined, content.trim(), category);
      Alert.alert("Success", "Note added successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            editable={!isLoading}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              enabled={!isLoading}
              dropdownIconColor={COLORS.primary}
              style={styles.picker}
            >
              {/* Default "Select" option */}
              <Picker.Item label="Select" value="" color={COLORS.textLight} />
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
            editable={!isLoading}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? "Saving..." : "Save Note"}
              </Text>
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
    gap: 15,
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
