class PrivacyPolicy {
  const PrivacyPolicy({
    this.cloudBackupEnabled = false,
    this.aiCaptionsEnabled = false,
    this.locationEnabled = false,
  });
  final bool cloudBackupEnabled;
  final bool aiCaptionsEnabled;
  final bool locationEnabled;

  // This policy deliberately has no cloud biometric toggle.
  bool get faceEmbeddingsRemainLocal => true;
}
