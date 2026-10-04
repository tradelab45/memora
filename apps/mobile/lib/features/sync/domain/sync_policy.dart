import '../../../core/privacy/privacy_policy.dart';

class SyncPolicy {
  const SyncPolicy(this.privacy);
  final PrivacyPolicy privacy;
  bool maySyncMemory({required bool userSelected}) =>
      privacy.cloudBackupEnabled && userSelected;
  // Local face templates and reference photos never pass this boundary.
}
