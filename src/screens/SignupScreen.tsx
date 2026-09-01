import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import ErrorBanner from "../components/ErrorBanner";
import PrimaryButton from "../components/PrimaryButton";
import TextField from "../components/TextField";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";
import { colors, fontSize, spacing } from "../theme";
import type { AuthStackParamList } from "../types";
import {
	validateEmail,
	validateName,
	validatePassword,
} from "../utils/validation";

type Props = NativeStackScreenProps<AuthStackParamList, "Signup">;

const validators = {
	name: validateName,
	email: validateEmail,
	password: validatePassword,
};

export default function SignupScreen({ navigation }: Props) {
	const { signup } = useAuth();
	const { values, handleChange, handleBlur, validateAll, errorFor } = useForm(
		{ name: "", email: "", password: "" },
		validators,
	);
	const [formError, setFormError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit() {
		setFormError(null);
		if (!validateAll()) return;

		setSubmitting(true);
		try {
			await signup(values.name, values.email, values.password);
		} catch (error) {
			setFormError(
				error instanceof Error
					? error.message
					: "Something went wrong.",
			);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					contentContainerStyle={styles.content}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.header}>
						<Text style={styles.title}>Create account</Text>
						<Text style={styles.subtitle}>
							It only takes a moment.
						</Text>
					</View>

					<ErrorBanner message={formError} />

					<TextField
						label="Name"
						value={values.name}
						onChangeText={(text) => handleChange("name", text)}
						onBlur={() => handleBlur("name")}
						error={errorFor("name")}
						placeholder="Your name"
						autoCapitalize="words"
						autoComplete="name"
					/>

					<TextField
						label="Email"
						value={values.email}
						onChangeText={(text) => handleChange("email", text)}
						onBlur={() => handleBlur("email")}
						error={errorFor("email")}
						placeholder="you@example.com"
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
						autoComplete="email"
					/>

					<TextField
						label="Password"
						value={values.password}
						onChangeText={(text) => handleChange("password", text)}
						onBlur={() => handleBlur("password")}
						error={errorFor("password")}
						placeholder="At least 6 characters"
						autoCapitalize="none"
						autoComplete="new-password"
						secure
					/>

					<PrimaryButton
						title="Signup"
						onPress={handleSubmit}
						loading={submitting}
					/>

					<View style={styles.footer}>
						<Text style={styles.footerText}>
							Already have an account?
						</Text>
						<TouchableOpacity
							onPress={() => navigation.navigate("Login")}
						>
							<Text style={styles.link}>Go to Login</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	flex: {
		flex: 1,
	},
	content: {
		flexGrow: 1,
		justifyContent: "center",
		padding: spacing.xl,
	},
	header: {
		marginBottom: spacing.xl,
	},
	title: {
		fontSize: fontSize.xxl,
		fontWeight: "700",
		color: colors.text,
	},
	subtitle: {
		marginTop: spacing.xs + 2,
		fontSize: fontSize.md,
		color: colors.textMuted,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.xs + 2,
		marginTop: spacing.xl,
	},
	footerText: {
		fontSize: fontSize.md,
		color: colors.textMuted,
	},
	link: {
		fontSize: fontSize.md,
		fontWeight: "600",
		color: colors.primary,
	},
});
