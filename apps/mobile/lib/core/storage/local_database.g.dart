// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'local_database.dart';

// ignore_for_file: type=lint
class $LocalMemoriesTable extends LocalMemories
    with TableInfo<$LocalMemoriesTable, LocalMemory> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LocalMemoriesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _localPhotoIdMeta = const VerificationMeta(
    'localPhotoId',
  );
  @override
  late final GeneratedColumn<String> localPhotoId = GeneratedColumn<String>(
    'local_photo_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _captionMeta = const VerificationMeta(
    'caption',
  );
  @override
  late final GeneratedColumn<String> caption = GeneratedColumn<String>(
    'caption',
    aliasedName,
    false,
    additionalChecks: GeneratedColumn.checkTextLength(
      minTextLength: 1,
      maxTextLength: 280,
    ),
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _occurredAtMeta = const VerificationMeta(
    'occurredAt',
  );
  @override
  late final GeneratedColumn<DateTime> occurredAt = GeneratedColumn<DateTime>(
    'occurred_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _optedIntoBackupMeta = const VerificationMeta(
    'optedIntoBackup',
  );
  @override
  late final GeneratedColumn<bool> optedIntoBackup = GeneratedColumn<bool>(
    'opted_into_backup',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("opted_into_backup" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    localPhotoId,
    caption,
    occurredAt,
    optedIntoBackup,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'local_memories';
  @override
  VerificationContext validateIntegrity(
    Insertable<LocalMemory> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('local_photo_id')) {
      context.handle(
        _localPhotoIdMeta,
        localPhotoId.isAcceptableOrUnknown(
          data['local_photo_id']!,
          _localPhotoIdMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_localPhotoIdMeta);
    }
    if (data.containsKey('caption')) {
      context.handle(
        _captionMeta,
        caption.isAcceptableOrUnknown(data['caption']!, _captionMeta),
      );
    } else if (isInserting) {
      context.missing(_captionMeta);
    }
    if (data.containsKey('occurred_at')) {
      context.handle(
        _occurredAtMeta,
        occurredAt.isAcceptableOrUnknown(data['occurred_at']!, _occurredAtMeta),
      );
    } else if (isInserting) {
      context.missing(_occurredAtMeta);
    }
    if (data.containsKey('opted_into_backup')) {
      context.handle(
        _optedIntoBackupMeta,
        optedIntoBackup.isAcceptableOrUnknown(
          data['opted_into_backup']!,
          _optedIntoBackupMeta,
        ),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  LocalMemory map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LocalMemory(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      localPhotoId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}local_photo_id'],
      )!,
      caption: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}caption'],
      )!,
      occurredAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}occurred_at'],
      )!,
      optedIntoBackup: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}opted_into_backup'],
      )!,
    );
  }

  @override
  $LocalMemoriesTable createAlias(String alias) {
    return $LocalMemoriesTable(attachedDatabase, alias);
  }
}

class LocalMemory extends DataClass implements Insertable<LocalMemory> {
  final String id;
  final String localPhotoId;
  final String caption;
  final DateTime occurredAt;
  final bool optedIntoBackup;
  const LocalMemory({
    required this.id,
    required this.localPhotoId,
    required this.caption,
    required this.occurredAt,
    required this.optedIntoBackup,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['local_photo_id'] = Variable<String>(localPhotoId);
    map['caption'] = Variable<String>(caption);
    map['occurred_at'] = Variable<DateTime>(occurredAt);
    map['opted_into_backup'] = Variable<bool>(optedIntoBackup);
    return map;
  }

  LocalMemoriesCompanion toCompanion(bool nullToAbsent) {
    return LocalMemoriesCompanion(
      id: Value(id),
      localPhotoId: Value(localPhotoId),
      caption: Value(caption),
      occurredAt: Value(occurredAt),
      optedIntoBackup: Value(optedIntoBackup),
    );
  }

  factory LocalMemory.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LocalMemory(
      id: serializer.fromJson<String>(json['id']),
      localPhotoId: serializer.fromJson<String>(json['localPhotoId']),
      caption: serializer.fromJson<String>(json['caption']),
      occurredAt: serializer.fromJson<DateTime>(json['occurredAt']),
      optedIntoBackup: serializer.fromJson<bool>(json['optedIntoBackup']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'localPhotoId': serializer.toJson<String>(localPhotoId),
      'caption': serializer.toJson<String>(caption),
      'occurredAt': serializer.toJson<DateTime>(occurredAt),
      'optedIntoBackup': serializer.toJson<bool>(optedIntoBackup),
    };
  }

  LocalMemory copyWith({
    String? id,
    String? localPhotoId,
    String? caption,
    DateTime? occurredAt,
    bool? optedIntoBackup,
  }) => LocalMemory(
    id: id ?? this.id,
    localPhotoId: localPhotoId ?? this.localPhotoId,
    caption: caption ?? this.caption,
    occurredAt: occurredAt ?? this.occurredAt,
    optedIntoBackup: optedIntoBackup ?? this.optedIntoBackup,
  );
  LocalMemory copyWithCompanion(LocalMemoriesCompanion data) {
    return LocalMemory(
      id: data.id.present ? data.id.value : this.id,
      localPhotoId: data.localPhotoId.present
          ? data.localPhotoId.value
          : this.localPhotoId,
      caption: data.caption.present ? data.caption.value : this.caption,
      occurredAt: data.occurredAt.present
          ? data.occurredAt.value
          : this.occurredAt,
      optedIntoBackup: data.optedIntoBackup.present
          ? data.optedIntoBackup.value
          : this.optedIntoBackup,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LocalMemory(')
          ..write('id: $id, ')
          ..write('localPhotoId: $localPhotoId, ')
          ..write('caption: $caption, ')
          ..write('occurredAt: $occurredAt, ')
          ..write('optedIntoBackup: $optedIntoBackup')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, localPhotoId, caption, occurredAt, optedIntoBackup);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LocalMemory &&
          other.id == this.id &&
          other.localPhotoId == this.localPhotoId &&
          other.caption == this.caption &&
          other.occurredAt == this.occurredAt &&
          other.optedIntoBackup == this.optedIntoBackup);
}

class LocalMemoriesCompanion extends UpdateCompanion<LocalMemory> {
  final Value<String> id;
  final Value<String> localPhotoId;
  final Value<String> caption;
  final Value<DateTime> occurredAt;
  final Value<bool> optedIntoBackup;
  final Value<int> rowid;
  const LocalMemoriesCompanion({
    this.id = const Value.absent(),
    this.localPhotoId = const Value.absent(),
    this.caption = const Value.absent(),
    this.occurredAt = const Value.absent(),
    this.optedIntoBackup = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  LocalMemoriesCompanion.insert({
    required String id,
    required String localPhotoId,
    required String caption,
    required DateTime occurredAt,
    this.optedIntoBackup = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       localPhotoId = Value(localPhotoId),
       caption = Value(caption),
       occurredAt = Value(occurredAt);
  static Insertable<LocalMemory> custom({
    Expression<String>? id,
    Expression<String>? localPhotoId,
    Expression<String>? caption,
    Expression<DateTime>? occurredAt,
    Expression<bool>? optedIntoBackup,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (localPhotoId != null) 'local_photo_id': localPhotoId,
      if (caption != null) 'caption': caption,
      if (occurredAt != null) 'occurred_at': occurredAt,
      if (optedIntoBackup != null) 'opted_into_backup': optedIntoBackup,
      if (rowid != null) 'rowid': rowid,
    });
  }

  LocalMemoriesCompanion copyWith({
    Value<String>? id,
    Value<String>? localPhotoId,
    Value<String>? caption,
    Value<DateTime>? occurredAt,
    Value<bool>? optedIntoBackup,
    Value<int>? rowid,
  }) {
    return LocalMemoriesCompanion(
      id: id ?? this.id,
      localPhotoId: localPhotoId ?? this.localPhotoId,
      caption: caption ?? this.caption,
      occurredAt: occurredAt ?? this.occurredAt,
      optedIntoBackup: optedIntoBackup ?? this.optedIntoBackup,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (localPhotoId.present) {
      map['local_photo_id'] = Variable<String>(localPhotoId.value);
    }
    if (caption.present) {
      map['caption'] = Variable<String>(caption.value);
    }
    if (occurredAt.present) {
      map['occurred_at'] = Variable<DateTime>(occurredAt.value);
    }
    if (optedIntoBackup.present) {
      map['opted_into_backup'] = Variable<bool>(optedIntoBackup.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LocalMemoriesCompanion(')
          ..write('id: $id, ')
          ..write('localPhotoId: $localPhotoId, ')
          ..write('caption: $caption, ')
          ..write('occurredAt: $occurredAt, ')
          ..write('optedIntoBackup: $optedIntoBackup, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$LocalDatabase extends GeneratedDatabase {
  _$LocalDatabase(QueryExecutor e) : super(e);
  $LocalDatabaseManager get managers => $LocalDatabaseManager(this);
  late final $LocalMemoriesTable localMemories = $LocalMemoriesTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [localMemories];
}

typedef $$LocalMemoriesTableCreateCompanionBuilder =
    LocalMemoriesCompanion Function({
      required String id,
      required String localPhotoId,
      required String caption,
      required DateTime occurredAt,
      Value<bool> optedIntoBackup,
      Value<int> rowid,
    });
typedef $$LocalMemoriesTableUpdateCompanionBuilder =
    LocalMemoriesCompanion Function({
      Value<String> id,
      Value<String> localPhotoId,
      Value<String> caption,
      Value<DateTime> occurredAt,
      Value<bool> optedIntoBackup,
      Value<int> rowid,
    });

class $$LocalMemoriesTableFilterComposer
    extends Composer<_$LocalDatabase, $LocalMemoriesTable> {
  $$LocalMemoriesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get localPhotoId => $composableBuilder(
    column: $table.localPhotoId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get caption => $composableBuilder(
    column: $table.caption,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get occurredAt => $composableBuilder(
    column: $table.occurredAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get optedIntoBackup => $composableBuilder(
    column: $table.optedIntoBackup,
    builder: (column) => ColumnFilters(column),
  );
}

class $$LocalMemoriesTableOrderingComposer
    extends Composer<_$LocalDatabase, $LocalMemoriesTable> {
  $$LocalMemoriesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get localPhotoId => $composableBuilder(
    column: $table.localPhotoId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get caption => $composableBuilder(
    column: $table.caption,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get occurredAt => $composableBuilder(
    column: $table.occurredAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get optedIntoBackup => $composableBuilder(
    column: $table.optedIntoBackup,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$LocalMemoriesTableAnnotationComposer
    extends Composer<_$LocalDatabase, $LocalMemoriesTable> {
  $$LocalMemoriesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get localPhotoId => $composableBuilder(
    column: $table.localPhotoId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get caption =>
      $composableBuilder(column: $table.caption, builder: (column) => column);

  GeneratedColumn<DateTime> get occurredAt => $composableBuilder(
    column: $table.occurredAt,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get optedIntoBackup => $composableBuilder(
    column: $table.optedIntoBackup,
    builder: (column) => column,
  );
}

class $$LocalMemoriesTableTableManager
    extends
        RootTableManager<
          _$LocalDatabase,
          $LocalMemoriesTable,
          LocalMemory,
          $$LocalMemoriesTableFilterComposer,
          $$LocalMemoriesTableOrderingComposer,
          $$LocalMemoriesTableAnnotationComposer,
          $$LocalMemoriesTableCreateCompanionBuilder,
          $$LocalMemoriesTableUpdateCompanionBuilder,
          (
            LocalMemory,
            BaseReferences<_$LocalDatabase, $LocalMemoriesTable, LocalMemory>,
          ),
          LocalMemory,
          PrefetchHooks Function()
        > {
  $$LocalMemoriesTableTableManager(
    _$LocalDatabase db,
    $LocalMemoriesTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LocalMemoriesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$LocalMemoriesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LocalMemoriesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> localPhotoId = const Value.absent(),
                Value<String> caption = const Value.absent(),
                Value<DateTime> occurredAt = const Value.absent(),
                Value<bool> optedIntoBackup = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => LocalMemoriesCompanion(
                id: id,
                localPhotoId: localPhotoId,
                caption: caption,
                occurredAt: occurredAt,
                optedIntoBackup: optedIntoBackup,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String localPhotoId,
                required String caption,
                required DateTime occurredAt,
                Value<bool> optedIntoBackup = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => LocalMemoriesCompanion.insert(
                id: id,
                localPhotoId: localPhotoId,
                caption: caption,
                occurredAt: occurredAt,
                optedIntoBackup: optedIntoBackup,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$LocalMemoriesTable, LocalMemory>(table),
                  BaseReferences<
                    _$LocalDatabase,
                    $LocalMemoriesTable,
                    LocalMemory
                  >(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$LocalMemoriesTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDatabase,
      $LocalMemoriesTable,
      LocalMemory,
      $$LocalMemoriesTableFilterComposer,
      $$LocalMemoriesTableOrderingComposer,
      $$LocalMemoriesTableAnnotationComposer,
      $$LocalMemoriesTableCreateCompanionBuilder,
      $$LocalMemoriesTableUpdateCompanionBuilder,
      (
        LocalMemory,
        BaseReferences<_$LocalDatabase, $LocalMemoriesTable, LocalMemory>,
      ),
      LocalMemory,
      PrefetchHooks Function()
    >;

class $LocalDatabaseManager {
  final _$LocalDatabase _db;
  $LocalDatabaseManager(this._db);
  $$LocalMemoriesTableTableManager get localMemories =>
      $$LocalMemoriesTableTableManager(_db, _db.localMemories);
}
