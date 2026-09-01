import { useState } from "react";

type FormValues = Record<string, string>;
type Validators<T> = { [K in keyof T]?: (value: string) => string | null };
type Errors<T> = Partial<Record<keyof T, string>>;
type Touched<T> = Partial<Record<keyof T, boolean>>;

export function useForm<T extends FormValues>(
	initialValues: T,
	validators: Validators<T>,
) {
	const [values, setValues] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Errors<T>>({});
	const [touched, setTouched] = useState<Touched<T>>({});

	const fields = Object.keys(initialValues) as (keyof T)[];

	function collectErrors(next: T): Errors<T> {
		const found: Errors<T> = {};
		for (const field of fields) {
			const message = validators[field]?.(next[field]);
			if (message) found[field] = message;
		}
		return found;
	}

	function handleChange(field: keyof T, value: string) {
		const next = { ...values, [field]: value };
		setValues(next);

		// Only re-validate a field the user has already left or submitted, otherwise
		// the form turns red while they're still typing the first character.
		if (touched[field]) {
			setErrors(collectErrors(next));
		}
	}

	function handleBlur(field: keyof T) {
		setTouched((prev) => ({ ...prev, [field]: true }));
		setErrors(collectErrors(values));
	}

	function validateAll(): boolean {
		const found = collectErrors(values);
		setErrors(found);
		setTouched(
			fields.reduce<Touched<T>>(
				(acc, field) => ({ ...acc, [field]: true }),
				{},
			),
		);
		return Object.keys(found).length === 0;
	}

	function errorFor(field: keyof T): string | undefined {
		return touched[field] ? errors[field] : undefined;
	}

	return { values, handleChange, handleBlur, validateAll, errorFor };
}
