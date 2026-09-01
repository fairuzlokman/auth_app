export type User = {
	name: string;
	email: string;
};

export type AuthContextValue = {
	user: User | null;
	isRestoring: boolean;
	login: (email: string, password: string) => Promise<void>;
	signup: (name: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
};

export type AuthStackParamList = {
	Login: undefined;
	Signup: undefined;
};

export type AppStackParamList = {
	Home: undefined;
};
