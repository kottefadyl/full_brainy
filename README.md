# Brainy

Read [AGENTS.md](AGENTS.md) for the current product description and business rules before changing the app.

The ordered task index is in [ROADMAP_BRAINY.md](ROADMAP_BRAINY.md); each task has its own file in `docs/tasks/` with [shared principles](docs/tasks/_PRINCIPES.md). The [inventory](docs/T01_INVENTAIRE.md), [UX and language guide](docs/T02_UX_LANGUES.md), and [data contract](docs/T03_CONTRAT_DONNEES.md) explain the current foundation.

Brainy has a Next.js web app and a Flutter mobile/desktop app, backed by a NestJS GraphQL API and MongoDB. People can sign in, create named collections, define multiple data formats with their own fields, and write entries that sync through their account.

On first sign-in, Brainy asks people to complete a private profile: name, profession, current job, field of study, interests, and hobbies. Profession, job, and studies can be left blank; at least one interest or hobby is required. The profile can be edited later. These details are saved for a future people-matching feature; they are not currently shown to other users.

## Collections and entries

Entries appear as compact rows. Each row shows when it was created. Use **Copy entry** to copy its populated fields as plain text, including number units; an edited entry also shows when it was changed.

In the signed-in workspace, select **New collection**, name it, and create its first named data format with one or more fields. Use **Add data format** to give the same collection another field layout. Choose one of 24 pale colors for each data format; colors within a collection must be different. Use **Change color** to recolor a data format later, including those in older collections. Use **Edit data format** to rename, reorder, or add fields; fields with saved values keep their type, unit, and existing choices. Select a data format when adding an entry; every saved entry uses its data format's pale background. Field types are Title, Date, Number, Time, Link, Character, Text, Long text, Yes/No, Single choice, Multiple choices, Date and time, Duration, and Attachment. Setup starts with a single Title field. Add fields to mix types. Number fields can stay plain or use a unit: distance, mass, volume, temperature, currency, percent, time, or a custom unit such as `m/s²`. Units are stored with the field and shown beside saved values. An entry needs at least one populated field. Attachments are stored with entries, limited to 2 MiB per file and 8 MiB per entry, and downloaded only by the account owner. Entries can be edited or deleted. Collections can be renamed or deleted; deleting a collection also deletes its entries. Existing collections automatically gain a General data format and keep their entries.

The interface supports English and French, including form labels, validation messages, and displayed dates and times. Use the language menu in the header to switch languages. The choice is saved on the device; new users start in French when their device language is French. French number input accepts a comma as a decimal separator and stores it in a locale-neutral format.

The API exposes `updateProfile`, `collectionsList`, `createCollection`, `addCollectionFormat`, `setCollectionFormatColor`, `collectionFormatImpact`, `updateCollectionFormat`, `renameCollection`, `deleteCollection`, `collectionEntries`, `createEntry`, `updateEntry`, `deleteEntry`, and `entryAttachment` through GraphQL. All operations require a Brainy session token and are scoped to that account. The API validates profile details, data format colors, field names, and each entry value against its selected data format.

## Start locally

1. Install Node.js 22.12 or later and MongoDB Community Server as a system service. MongoDB Compass can browse the data.
2. Run `npm ci` in `api/` and in `brainy_web_app/`.
3. Copy `api/.env.example` to `api/.env`, then replace `JWT_SECRET`, `S3_ACCESS_KEY` and `S3_SECRET_KEY` with long random values.
4. For files above 2 MiB, extract the [VersityGW](https://github.com/versity/versitygw/releases) archive for your system into `.tools/versitygw/`.
5. Run `node scripts/dev-local.mjs` from this directory. It starts S3 storage, the API and the web app; add `--no-s3` to skip storage. The GraphQL API is at `http://localhost:3000/graphql` and the web app at `http://localhost:3001`.
6. For mobile or desktop, run `flutter pub get` and `flutter run -d windows` (or a mobile device ID) from `brainy/`.

The Flutter client uses `http://localhost:3000/graphql` on desktop and `http://10.0.2.2:3000/graphql` on the Android emulator. For a phone, remote API, or a different port, pass `--dart-define=API_URL=https://your-host/graphql` to `flutter run` or `flutter build`. The Next.js app forwards web requests to the API server-side. Set `GRAPHQL_API_URL` in `brainy_web_app/.env.local` when the API is not at `http://127.0.0.1:3000/graphql`. Production apps should use HTTPS.

## Try the demo charts

With the local API and web app running, sign in at `http://localhost:3001`. The repeatable `node --env-file=.env scripts/demo-seed.mjs` command, run from `api/`, fills the sole local account with seven collections named `Démo · ...`; it refuses to choose an account when more than one exists. Existing demo entries are kept, while missing dated observations may be added on a later day.

Select `Démo · Observations météo`, open **Calculs et graphiques** (the chart icon in Flutter), then choose **Graphique rapide**. This shows the daily temperature curve in °C. `Démo · Boutique` shows daily sales totals in EUR, and `Démo · Santé personnelle` shows daily resting pulse in bpm. In **Affichage**, choose **Barres** to compare the same values as a bar chart. The table below each chart lists the underlying values. These observations and sales are fictional.

## GraphQL authentication

```graphql
mutation {
  register(input: {name: "Ada", email: "ada@example.com", password: "strongpass123"}) {
    token
    user { id name email }
  }
}
```

Use `login(input: {email: "ada@example.com", password: "strongpass123"})` to sign in. Send the returned token as `Authorization: Bearer <token>` for `me`, collections, entries, and notes operations. Tokens expire after seven days. Passwords are salted and hashed with scrypt. Data is scoped to the signed-in account; anonymous notes from the earlier demo are not shown.

## Google sign-in with Firebase

The Firebase project ID is `brainy-6d65c`. In Firebase Console, enable **Authentication > Sign-in method > Google** and save a public project name and support email. The registered Android app uses package name `com.example.brainy` and already has the development SHA-1 fingerprint `5D:EF:55:B1:C8:06:C2:B0:B6:35:85:B1:3D:2D:4E:CF:69:EC:85:F5`. For other machines or release builds, add the SHA-1 fingerprint of the signing key used there. Web and Windows apps are also registered. To test web sign-in locally, add `localhost` under **Authentication > Settings > Authorized domains**.

The Flutter app uses `brainy/lib/firebase_options.dart`, generated by `flutterfire configure --project=brainy-6d65c --platforms=android,windows`. The Next.js app uses Firebase web project settings in `brainy_web_app/lib/firebase-client.ts`. The Android configuration is in `brainy/android/app/google-services.json`. To regenerate Flutter settings, install the official Firebase CLI, run `firebase login`, then run `dart pub global activate flutterfire_cli` and the configure command from `brainy/`. On Windows, add `%LOCALAPPDATA%\Pub\Cache\bin` to `PATH` if `flutterfire` is not recognized.

The Android Web OAuth client ID is in `brainy/lib/firebase_config.dart`. If the Firebase project changes, update this ID from the `client_id` entry with `client_type: 3` in `google-services.json`. iOS and macOS Google sign-in need their own Firebase app registration and native OAuth setup before they can be enabled.

Start the API and the web app with `node scripts/dev-local.mjs`. For Flutter mobile/desktop, run from `brainy/` with:

```powershell
flutter run -d windows
# Or, with an Android emulator running:
flutter run -d emulator-5554
```

The Google button starts Firebase sign-in when pressed. The client sends a Firebase ID token to `loginWithGoogle(firebaseIdToken: String!)`; the API verifies it against `FIREBASE_PROJECT_ID` and issues the same Brainy session token used by email sign-in. An existing Brainy account with the same verified email is linked to the Google account.

The Windows app uses a project-local copy of `flutter_secure_storage_windows` 4.2.2 that registers its Dart DPAPI backend without the native legacy credential bridge. This avoids the optional Visual Studio ATL requirement. Existing sessions stored by older native Windows plugin versions cannot migrate through this fork and must sign in again. The package and license are in `brainy/packages/flutter_secure_storage_windows/`.

## Checks

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` in `brainy_web_app/`; `npm run typecheck` in `api/`; then `flutter analyze` and `flutter test` in `brainy/`. With the API running, `npm run smoke:auth` in `api/` verifies registration and sign-in, and `npm run smoke:collections` checks collection formats, entries, and account isolation. To check the Next.js session proxy, run `npm run smoke:web` in `api/` while Next.js runs on port 3001. These smoke tests remove their test records.
