import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { useAuth } from "../context/AuthContext";

const COLORS = {
  primary: "#9B5DE5",
  primaryLight: "#B98AF1",
  bg: "#F7F3FF",
  white: "#FFFFFF",
  textDark: "#37304D",
  textLight: "#7A7297",
  danger: "#FF3B30",
};

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeForm, setActiveForm] = useState<"none" | "profile" | "password">(
    "none"
  );

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username is required");
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateProfile(
        email.trim(),
        undefined,
        username.trim()
      );
      if (success) {
        Alert.alert("Success", "Profile updated successfully!");
        setActiveForm("none");
      } else {
        Alert.alert(
          "Error",
          email !== user?.email
            ? "Email already exists"
            : "Failed to update profile"
        );
      }
    } catch {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateProfile(undefined, newPassword, undefined);
      if (success) {
        Alert.alert("Success", "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setActiveForm("none");
      } else {
        Alert.alert("Error", "Failed to change password");
      }
    } catch {
      Alert.alert("Error", "Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
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
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() =>
              setActiveForm(activeForm === "profile" ? "none" : "profile")
            }
          >
            <Text style={styles.mainButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() =>
              setActiveForm(activeForm === "password" ? "none" : "password")
            }
          >
            <Text style={styles.mainButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Form */}
        {activeForm === "profile" && (
          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              editable={!isLoading}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.buttonDisabled]}
              onPress={handleUpdateProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Password Form */}
        {activeForm === "password" && (
          <View style={styles.form}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.buttonDisabled]}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },

  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0EFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 5,
  },
  email: { fontSize: 16, color: COLORS.textLight },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  mainButton: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    alignItems: "center",
  },
  mainButtonText: { color: COLORS.white, fontWeight: "600", fontSize: 16 },

  form: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6DFFD",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    backgroundColor: COLORS.bg,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitButtonText: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
  buttonDisabled: { opacity: 0.6 },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  logoutButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
