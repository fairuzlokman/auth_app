import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";
import { colors, fontSize, radius, spacing } from "../theme";

export default function HomeScreen() {
	const { user, logout } = useAuth();

	if (!user) return null;

	function confirmLogout() {
		Alert.alert("Log out", "Are you sure you want to log out?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Log out",
				style: "destructive",
				onPress: () => void logout(),
			},
		]);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.content}>
				<View style={styles.card}>
					<View style={styles.avatar}>
						<Text style={styles.avatarInitial}>
							{user.name.charAt(0).toUpperCase()}
						</Text>
					</View>

					<Text style={styles.name}>{user.name}</Text>
					<Text style={styles.email}>{user.email}</Text>
				</View>

				<TouchableOpacity
					style={styles.logoutButton}
					onPress={confirmLogout}
					activeOpacity={0.85}
					accessibilityRole="button"
				>
					<Text style={styles.logoutLabel}>Logout</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		padding: spacing.xl,
	},
	card: {
		alignItems: "center",
		backgroundColor: colors.surface,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border,
		paddingVertical: spacing.xxl,
		paddingHorizontal: spacing.xl,
	},
	avatar: {
		width: 84,
		height: 84,
		borderRadius: radius.round,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.lg,
	},
	avatarInitial: {
		color: colors.surface,
		fontSize: 36,
		fontWeight: "700",
	},
	name: {
		fontSize: fontSize.xl,
		fontWeight: "700",
		color: colors.text,
	},
	email: {
		marginTop: spacing.xs,
		fontSize: fontSize.md,
		color: colors.textMuted,
	},
	logoutButton: {
		height: 50,
		borderRadius: radius.sm,
		borderWidth: 1,
		borderColor: colors.danger,
		alignItems: "center",
		justifyContent: "center",
		marginTop: spacing.xl,
	},
	logoutLabel: {
		color: colors.danger,
		fontSize: fontSize.lg,
		fontWeight: "600",
	},
});
