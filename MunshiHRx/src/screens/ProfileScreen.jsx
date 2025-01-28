import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Header from "../components/Header"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { logout, getUserData } from "../services/api"

const ProfileItem = ({ icon, title, value }) => (
  <View style={styles.profileItem}>
    <Ionicons name={icon} size={scale(24)} color={colors.primary} style={styles.itemIcon} />
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemValue}>{value || "Not provided"}</Text>
    </View>
  </View>
)

const ProfileScreen = () => {
  const navigation = useNavigation()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const data = await getUserData()
      setUserData(data)
      console.log("User data:", data)
    } catch (error) {
      console.error("Error fetching user data:", error)
      Alert.alert("Error", "Failed to load user data. Please try again.")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.")
    }
  }

  // Function to format the birthday
  const formatBirthday = (dateString) => {
    if (!dateString) return "Not provided"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Function to capitalize the first letter of each word
  const capitalizeWords = (str) => {
    if (!str) return "Not provided"
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <Header title="Profile" />
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <Header title="Profile" />
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={scale(60)} color={colors.primary} />
          </View>
          <Text style={styles.name}>{capitalizeWords(userData.name)}</Text>
          <Text style={styles.jobTitle}>{capitalizeWords(userData.job_title)}</Text>
        </View>
        <View style={styles.card}>
          <ProfileItem icon="mail-outline" title="Work Email" value={userData.email} />
          <ProfileItem icon="call-outline" title="Work Phone" value={userData.phoneNumber} />
          <ProfileItem icon="heart-outline" title="Marital Status" value={capitalizeWords(userData.marital)} />
          <ProfileItem icon="calendar-outline" title="Birthday" value={formatBirthday(userData.birthday)} />
          <ProfileItem icon="person-outline" title="Gender" value={capitalizeWords(userData.gender)} />
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={scale(24)} color={colors.text.light} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: verticalScale(24),
  },
  avatarContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: colors.card.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
    elevation: 3,
  },
  name: {
    ...colors.typography.header,
    fontSize: moderateScale(24),
    color: colors.text.primary,
    marginBottom: verticalScale(4),
  },
  jobTitle: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.secondary,
  },
  card: {
    backgroundColor: colors.card.background,
    borderRadius: scale(16),
    padding: scale(24),
    marginHorizontal: scale(24),
    marginBottom: verticalScale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
    elevation: 3,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  itemIcon: {
    marginRight: scale(16),
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    ...colors.typography.caption,
    fontSize: moderateScale(14),
    color: colors.text.secondary,
    marginBottom: verticalScale(2),
  },
  itemValue: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.primary,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: scale(12),
    padding: scale(16),
    marginHorizontal: scale(24),
    marginBottom: verticalScale(24),
  },
  logoutText: {
    ...colors.typography.button,
    fontSize: moderateScale(16),
    color: colors.text.light,
    marginLeft: scale(8),
  },
})

export default ProfileScreen