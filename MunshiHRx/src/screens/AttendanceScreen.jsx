import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import Header from "../components/Header"
import { colors } from "../styles/colors"
import { scale, verticalScale, moderateScale } from "../utils/responsive"
import { getEmployeesUnderSupervisor, getUserData, getAttendanceHistory, checkIn, checkOut } from "../services/api"
import * as Location from "expo-location"

const AttendanceButton = ({ title, icon, onPress, isActive, style }) => (
  <TouchableOpacity
    style={[styles.attendanceButton, isActive ? styles.attendanceButtonActive : styles.attendanceButtonInactive, style]}
    onPress={onPress}
  >
    <Ionicons name={icon} size={scale(20)} color={isActive ? colors.text.light : colors.primary} />
    <Text
      style={[
        styles.attendanceButtonText,
        isActive ? styles.attendanceButtonTextActive : styles.attendanceButtonTextInactive,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
)

const EmployeeItem = ({ name, isCheckedIn, onPress, onCheckInOut }) => (
  <View style={styles.employeeListItem}>
    <TouchableOpacity style={styles.employeeItem} onPress={onPress}>
      <Text style={styles.employeeName}>{name}</Text>
      <View style={[styles.statusIndicator, isCheckedIn ? styles.checkedInIndicator : styles.checkedOutIndicator]} />
    </TouchableOpacity>
    <AttendanceButton
      title={isCheckedIn ? "Check Out" : "Check In"}
      icon={isCheckedIn ? "log-out-outline" : "log-in-outline"}
      onPress={onCheckInOut}
      isActive={isCheckedIn}
      style={styles.employeeAttendanceButton}
    />
  </View>
)

const AttendanceHistoryItem = ({ date, checkIn, checkOut, workedHours, overtimeHours }) => (
  <View style={styles.historyItem}>
    <Text style={styles.historyDate}>{new Date(date).toLocaleDateString()}</Text>
    <View style={styles.historyTimes}>
      <Text style={styles.historyTime}>In: {checkIn ? new Date(checkIn).toLocaleTimeString() : "N/A"}</Text>
      <Text style={styles.historyTime}>Out: {checkOut ? new Date(checkOut).toLocaleTimeString() : "N/A"}</Text>
    </View>
    <View style={styles.historyHours}>
      <Text style={styles.historyTime}>Worked: {(workedHours || 0).toFixed(2)} hrs</Text>
      <Text style={styles.historyTime}>Overtime: {(overtimeHours || 0).toFixed(2)} hrs</Text>
    </View>
  </View>
)

const AttendanceScreen = () => {
  const [viewMode, setViewMode] = useState("personal")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [locationPermission, setLocationPermission] = useState(null)

  useEffect(() => {
    const fetchUserDataAndCheckPermission = async () => {
      try {
        const data = await getUserData()
        setUserData(data)
        console.log("User data fetched:", data)
        // Check if the user is already checked in
        const today = new Date().toISOString().split("T")[0]
        const todayAttendance =
          data.attendance_records && data.attendance_records.find((record) => record.date.startsWith(today))
        setIsCheckedIn(todayAttendance && !todayAttendance.check_out)
        setTodayAttendance(todayAttendance || null)

        // Check location permission
        const { status } = await Location.requestForegroundPermissionsAsync()
        setLocationPermission(status)
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required for attendance. Please enable it in your device settings.",
            [{ text: "OK" }],
          )
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to fetch user data. Please try again.")
      }
    }
    fetchUserDataAndCheckPermission()
  }, [])

  useEffect(() => {
    if (userData?.id && viewMode === "employees") {
      fetchEmployees(userData.id)
    }
  }, [userData?.id, viewMode])

  const fetchEmployees = async (employeeId) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getEmployeesUnderSupervisor(employeeId)
      setEmployees(data)
    } catch (err) {
      setError(err.message || "An error occurred while fetching employees")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAttendanceHistory = async (employeeId) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAttendanceHistory(employeeId)
      if (data.message === "No attendance history found") {
        setAttendanceHistory([])
      } else {
        setAttendanceHistory(data)
      }
    } catch (err) {
      setError(err.message || "No attendance history found")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmployeePress = (employee) => {
    setSelectedEmployee(employee)
    fetchAttendanceHistory(employee.id)
    setViewMode("history")
  }

  const getCurrentLocation = async () => {
    if (locationPermission !== "granted") {
      Alert.alert("Location Permission Required", "Please enable location services to check in/out.", [{ text: "OK" }])
      return null
    }

    try {
      let location
      if (Platform.OS === "android") {
        // For Android, we'll use getCurrentPositionAsync with a timeout
        location = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Update every 5 seconds
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Location request timed out")), 15000)),
        ])
      } else {
        // For iOS, we'll use the original method
        location = await Location.getCurrentPositionAsync({})
      }
      return location
    } catch (error) {
      console.error("Error getting location:", error)
      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please check your device settings and try again.",
        [{ text: "OK" }],
      )
      return null
    }
  }

  const handleCheckInOut = async () => {
    setIsLoading(true)
    try {
      const location = await getCurrentLocation()
      if (!location) {
        setIsLoading(false)
        return
      }

      const { latitude, longitude } = location.coords
      const currentTime = new Date().toISOString()

      if (isCheckedIn) {
        await checkOut(userData.id, currentTime, latitude, longitude)
        setIsCheckedIn(false)
        setTodayAttendance({ ...todayAttendance, check_out: currentTime })
        Alert.alert("Success", "You have been checked out.")
      } else {
        await checkIn(userData.id, currentTime, latitude, longitude)
        setIsCheckedIn(true)
        setTodayAttendance({ check_in: currentTime, check_out: null })
        Alert.alert("Success", "You have been checked in.")
      }

      // Refresh attendance history
      fetchAttendanceHistory(userData.id)
    } catch (error) {
      console.error("Check-in/out error:", error)
      Alert.alert("Error", error.message || "An error occurred during check-in/out.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmployeeCheckInOut = async (employeeId) => {
    setIsLoading(true)
    try {
      const employee = employees.find((emp) => emp.id === employeeId)
      const location = await getCurrentLocation()
      if (!location) {
        setIsLoading(false)
        return
      }

      const { latitude, longitude } = location.coords
      const currentTime = new Date().toISOString()

      if (employee.isCheckedIn) {
        await checkOut(employeeId, currentTime, latitude, longitude)
      } else {
        await checkIn(employeeId, currentTime, latitude, longitude)
      }

      // Update the local state
      setEmployees(employees.map((emp) => (emp.id === employeeId ? { ...emp, isCheckedIn: !emp.isCheckedIn } : emp)))

      Alert.alert("Success", `Employee ${employee.isCheckedIn ? "checked out" : "checked in"} successfully.`)
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred during employee check-in/out.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderPersonalAttendance = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Attendance</Text>
      <View style={styles.attendanceButtons}>
        <AttendanceButton
          title={isCheckedIn ? "Check Out" : "Check In"}
          icon={isCheckedIn ? "log-out-outline" : "log-in-outline"}
          onPress={handleCheckInOut}
          isActive={isCheckedIn}
        />
      </View>
      {locationPermission !== "granted" && (
        <Text style={styles.warningText}>
          Location permission is required for attendance. Please enable it in your device settings.
        </Text>
      )}
      {todayAttendance && (
        <View style={styles.todayAttendance}>
          <Text style={styles.todayAttendanceTitle}>Today's Attendance:</Text>
          <Text style={styles.todayAttendanceText}>
            Check-in:{" "}
            {todayAttendance.check_in ? new Date(todayAttendance.check_in).toLocaleTimeString() : "Not checked in"}
          </Text>
          <Text style={styles.todayAttendanceText}>
            Check-out:{" "}
            {todayAttendance.check_out ? new Date(todayAttendance.check_out).toLocaleTimeString() : "Not checked out"}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => {
          fetchAttendanceHistory(userData.id)
          setViewMode("history")
        }}
      >
        <Text style={styles.historyButtonText}>View Attendance History</Text>
      </TouchableOpacity>
    </View>
  )

  const renderEmployeesList = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Employee Attendance</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : employees.length > 0 ? (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EmployeeItem
              name={item.name}
              isCheckedIn={item.isCheckedIn}
              onPress={() => handleEmployeePress(item)}
              onCheckInOut={() => handleEmployeeCheckInOut(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <Text style={styles.noEmployeesText}>No employees found</Text>
      )}
    </View>
  )

  const renderAttendanceHistory = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {selectedEmployee ? `${selectedEmployee.name}'s Attendance History` : "Your Attendance History"}
      </Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : attendanceHistory.length > 0 ? (
        <FlatList
          data={attendanceHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AttendanceHistoryItem
              date={item.check_in}
              checkIn={item.check_in}
              checkOut={item.check_out}
              workedHours={item.worked_hours}
              overtimeHours={item.overtime_hours}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <Text style={styles.noAttendanceText}>No attendance history found</Text>
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setViewMode(selectedEmployee ? "employees" : "personal")
          setSelectedEmployee(null)
        }}
      >
        <Ionicons name="arrow-back" size={scale(24)} color={colors.primary} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <Header title="Attendance" />
      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, viewMode === "personal" && styles.activeTab]}
            onPress={() => setViewMode("personal")}
          >
            <Text style={[styles.tabText, viewMode === "personal" && styles.activeTabText]}>Personal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, viewMode === "employees" && styles.activeTab]}
            onPress={() => setViewMode("employees")}
          >
            <Text style={[styles.tabText, viewMode === "employees" && styles.activeTabText]}>Employees</Text>
          </TouchableOpacity>
        </View>
        {viewMode === "personal" && renderPersonalAttendance()}
        {viewMode === "employees" && renderEmployeesList()}
        {viewMode === "history" && renderAttendanceHistory()}
      </View>
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
    padding: scale(16),
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: verticalScale(16),
    backgroundColor: colors.card.background,
    borderRadius: scale(12),
    padding: scale(4),
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(8),
    alignItems: "center",
    borderRadius: scale(8),
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.text.light,
    fontWeight: "bold",
  },
  section: {
    flex: 1,
    backgroundColor: colors.card.background,
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    ...colors.typography.header,
    fontSize: moderateScale(20),
    color: colors.text.primary,
    marginBottom: verticalScale(16),
  },
  attendanceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(12),
    padding: scale(12),
    marginVertical: verticalScale(8),
    minWidth: scale(140),
    height: verticalScale(48),
  },
  attendanceButtonActive: {
    backgroundColor: colors.primary,
  },
  attendanceButtonInactive: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  attendanceButtonText: {
    ...colors.typography.button,
    fontSize: moderateScale(14),
    marginLeft: scale(8),
  },
  attendanceButtonTextActive: {
    color: colors.text.light,
  },
  attendanceButtonTextInactive: {
    color: colors.text.primary,
  },
  employeeListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(12),
  },
  employeeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    marginRight: scale(8),
  },
  employeeName: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.primary,
  },
  statusIndicator: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
  },
  checkedInIndicator: {
    backgroundColor: colors.success,
  },
  checkedOutIndicator: {
    backgroundColor: colors.error,
  },
  employeeAttendanceButton: {
    minWidth: scale(140),
    height: verticalScale(48),
    paddingHorizontal: scale(8),
  },
  historyItem: {
    backgroundColor: colors.background,
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: verticalScale(8),
  },
  historyDate: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.primary,
    marginBottom: verticalScale(4),
    fontWeight: "bold",
  },
  historyTimes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyTime: {
    ...colors.typography.caption,
    fontSize: moderateScale(14),
    color: colors.text.secondary,
  },
  historyHours: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(4),
  },
  separator: {
    height: 1,
    backgroundColor: colors.card.border,
  },
  historyButton: {
    alignItems: "center",
    padding: scale(12),
  },
  historyButtonText: {
    ...colors.typography.body,
    fontSize: moderateScale(14),
    color: colors.primary,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(16),
  },
  backButtonText: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.primary,
    marginLeft: scale(8),
  },
  errorText: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.error,
    textAlign: "center",
    marginTop: verticalScale(16),
  },
  noEmployeesText: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: verticalScale(16),
  },
  noAttendanceText: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: verticalScale(16),
  },
  todayAttendance: {
    marginTop: verticalScale(16),
    padding: scale(12),
    backgroundColor: colors.background,
    borderRadius: scale(8),
  },
  todayAttendanceTitle: {
    ...colors.typography.body,
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: verticalScale(8),
  },
  todayAttendanceText: {
    ...colors.typography.body,
    fontSize: moderateScale(14),
    color: colors.text.secondary,
    marginBottom: verticalScale(4),
  },
  warningText: {
    ...colors.typography.caption,
    fontSize: moderateScale(14),
    color: colors.error,
    textAlign: "center",
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
  },
})

export default AttendanceScreen

