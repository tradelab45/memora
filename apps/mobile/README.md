# Flutter foundation

Mobile is intentionally scaffolded separately from the cinematic web experience.
Requires a Flutter SDK with Dart >=3.11.0. Verified on October 4, 2026 with Flutter 3.47.6 and Dart 3.13.5: dependencies resolved, Drift code generated, analysis passed, and both existing privacy tests passed. Android SDK and platform runners are still needed before building an Android app.

From this directory:

```sh
flutter create --platforms=ios,android --project-name memora_mobile .
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter analyze
flutter test
flutter run
```

The create step generates platform runners; keep the checked-in lib/ implementation.
Commit pubspec.lock after the first successful SDK resolution.

Five tab shell: Home, People, Memories, Books, Create.
Use Riverpod for application state, Drift for local memory metadata, and a separately encrypted
device-only vault for recognition templates. The Drift executor is an injection point and is
not yet instantiated. flutter_secure_storage holds encryption keys; it does not itself encrypt
the Drift database. Choose an audited database/vault encryption adapter before handling real
photos or biometrics. No cloud auth initialization, photo permissions or recognition SDK is
enabled by this skeleton.

Feature boundaries:
- domain: pure entities and repository interfaces
- data (next milestone): Drift, OS photo library, recognition adapters
- application (next milestone): Riverpod controllers and use cases
- presentation: widgets and interactions
- core: privacy, storage, theme, errors
- sync: explicit allowlist serialization; never serialize device photo locators or embeddings
