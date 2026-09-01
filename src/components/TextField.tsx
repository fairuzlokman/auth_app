import { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../theme";

type Props = TextInputProps & {
	label: string;
	error?: string;
	secure?: boolean;
};

export default function TextField({
	label,
	error,
	secure = false,
	...inputProps
}: Props) {
	const [hidden, setHidden] = useState(secure);

	return (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>

			<View
				style={[styles.inputRow, error ? styles.inputRowError : null]}
			>
				<TextInput
					style={styles.input}
					placeholderTextColor={colors.textMuted}
					secureTextEntry={hidden}
					{...inputProps}
				/>

				{secure ? (
					<TouchableOpacity
						onPress={() => setHidden((prev) => !prev)}
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
						accessibilityRole="button"
						accessibilityLabel={
							hidden ? "Show password" : "Hide password"
						}
					>
						<Ionicons
							name={hidden ? "eye-off-outline" : "eye-outline"}
							size={20}
							color={colors.textMuted}
						/>
					</TouchableOpacity>
				) : null}
			</View>

			{error ? <Text style={styles.helperText}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	field: {
		marginBottom: spacing.lg,
	},
	label: {
		fontSize: fontSize.sm,
		fontWeight: "600",
		color: colors.textMuted,
		marginBottom: spacing.xs + 2,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		height: 50,
		paddingHorizontal: spacing.md,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.sm,
	},
	inputRowError: {
		borderColor: colors.danger,
	},
	input: {
		flex: 1,
		fontSize: fontSize.md,
		color: colors.text,
	},
	helperText: {
		marginTop: spacing.xs + 2,
		fontSize: fontSize.sm,
		color: colors.danger,
	},
});
