import 'package:flutter_test/flutter_test.dart';
import 'package:memora_mobile/core/privacy/privacy_policy.dart';
import 'package:memora_mobile/features/sync/domain/sync_policy.dart';

void main() {
  test('backup is blocked by default, even for a selected memory', () {
    expect(const SyncPolicy(PrivacyPolicy()).maySyncMemory(userSelected: true), false);
  });
  test('backup requires both opt-in and selection', () {
    const sync = SyncPolicy(PrivacyPolicy(cloudBackupEnabled: true));
    expect(sync.maySyncMemory(userSelected: false), false);
    expect(sync.maySyncMemory(userSelected: true), true);
  });
}
