import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "../theme";

export default function ErrorBanner({ message }: { message: string | null }) {
	if (!message) return null;

	return (
		<View style={styles.banner} accessibilityRole="alert">
			<Text style={styles.text}>{message}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	banner: {
		backgroundColor: colors.dangerSurface,
		borderRadius: radius.sm,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	text: {
		color: colors.danger,
		fontSize: fontSize.md,
	},
});
