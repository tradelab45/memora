import 'package:drift/drift.dart';

part 'local_database.g.dart';

// Embeddings are intentionally absent from sync entities.
// Production biometric templates require a separate encrypted device-only vault.
class LocalMemories extends Table {
  TextColumn get id => text()();
  TextColumn get localPhotoId => text()();
  TextColumn get caption => text().withLength(min: 1, max: 280)();
  DateTimeColumn get occurredAt => dateTime()();
  BoolColumn get optedIntoBackup => boolean().withDefault(const Constant(false))();
  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [LocalMemories])
class LocalDatabase extends _$LocalDatabase {
  LocalDatabase(super.executor);
  @override
  int get schemaVersion => 1;
}
