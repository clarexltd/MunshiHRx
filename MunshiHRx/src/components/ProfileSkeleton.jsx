import React from "react"
import { View, StyleSheet } from "react-native"
import { colors } from "../styles/colors"
import { scale, verticalScale } from "../utils/responsive"

const SkeletonItem = () => (
  <View style={styles.skeletonItem}>
    <View style={styles.skeletonIcon} />
    <View style={styles.skeletonContent}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonValue} />
    </View>
  </View>
)

const ProfileSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.avatarSkeleton} />
    <View style={styles.nameSkeleton} />
    <View style={styles.jobTitleSkeleton} />
    <View style={styles.card}>
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: verticalScale(24),
  },
  avatarSkeleton: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: colors.card.border,
    marginBottom: verticalScale(16),
  },
  nameSkeleton: {
    width: scale(200),
    height: verticalScale(24),
    backgroundColor: colors.card.border,
    marginBottom: verticalScale(8),
  },
  jobTitleSkeleton: {
    width: scale(150),
    height: verticalScale(16),
    backgroundColor: colors.card.border,
    marginBottom: verticalScale(24),
  },
  card: {
    backgroundColor: colors.card.background,
    borderRadius: scale(16),
    padding: scale(24),
    width: "90%",
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  skeletonIcon: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: colors.card.border,
    marginRight: scale(16),
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonTitle: {
    width: "30%",
    height: verticalScale(14),
    backgroundColor: colors.card.border,
    marginBottom: verticalScale(4),
  },
  skeletonValue: {
    width: "70%",
    height: verticalScale(16),
    backgroundColor: colors.card.border,
  },
})

export default ProfileSkeleton

