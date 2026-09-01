# User Authentication App

A small React Native app with Login, Signup and Home screens, built with Expo and
TypeScript. Authentication state is held in a React Context and persisted to
AsyncStorage, so a session survives closing and reopening the app.

There is no backend — accounts are stored on the device.

## Tech stack

- Expo (SDK 57) + React Native 0.86, TypeScript
- React Context API for auth state
- React Navigation v7 (native stack)
- AsyncStorage for persistence
- Jest for validation unit tests

## Setup

Prerequisites: Node 20+ and npm.

```bash
git clone <repo-url>
cd auth_app
npm install
npx expo start
```

Then pick one:

- **iOS Simulator** (macOS with Xcode): press `i`
- **Android emulator** (Android Studio): press `a`
- **A physical phone** — no Xcode or Android Studio needed: install **Expo Go**
  ([iOS](https://apps.apple.com/app/expo-go/id982107779) /
  [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)) and scan the
  QR code in the terminal. Your phone and computer need to be on the same Wi-Fi; if they
  aren't, run `npx expo start --tunnel` instead.

Run the tests with `npm test`.

## Features

**Auth context** (`src/context/AuthContext.tsx`) exposes `user`, `login`, `signup`,
`logout`, plus an `isRestoring` flag used to show a splash while the stored session is
read back. `useAuth()` throws if it is called outside the provider.

`login` and `signup` throw `Error`s with human-readable messages rather than returning a
result object, so screens just `try/catch` and drop the message into their error banner.

**Login screen** — email and password with inline validation, an error banner for failed
credentials, and a link to Signup.

**Signup screen** — name, email and password. Rejects missing fields, malformed emails,
passwords under 6 characters, and emails that are already registered.

**Home screen** — shows the logged-in user's name and email with an avatar initial, and a
Logout button behind a confirmation dialog.

**Validation** (`src/utils/validation.ts`) is a set of pure functions returning an error
string or `null`, covered by unit tests in `validation.test.ts`. Fields validate on submit,
then re-validate on change once they've been touched, so the form doesn't turn red while
you're still typing.

### Optional tasks

- **Persistent auth** — registered users live under `@auth_app/users` and the active
  session under `@auth_app/session`. Signing up, force-quitting the app and reopening it
  leaves you logged in.
- **Password visibility toggle** — built into the reusable `TextField` via a `secure` prop,
  so both password fields get it from one implementation.

## Notes on a couple of decisions

**Navigation swaps stacks instead of navigating.** `RootNavigator` renders either the auth
stack or the app stack based on whether `user` is set, rather than calling
`navigation.navigate('Home')` after a successful login. This means logging out can't leave
a Home screen sitting in the back stack for the hardware back button to return to.

**Login failures give one vague message.** Both "no account with that email" and "wrong
password" produce `"Incorrect email or password."` Distinguishing them would let someone
enumerate which email addresses have accounts.

**Passwords are stored in plain text.** That's a deliberate scope decision for a local demo
with no server. A real app would send the password to a backend that hashes it (bcrypt or
argon2) and would never persist it on the device at all.

**There's an artificial 600ms delay** on login and signup, standing in for a network call
so the loading states are actually visible.

## Known limitations

- No backend; accounts exist only on the device that created them.
- Passwords unhashed, as above.
- Tests cover the validation helpers only — with more time I'd add React Native Testing
  Library coverage for the context's login/signup branches.
- No "forgot password" or account deletion.
- Light mode only.
