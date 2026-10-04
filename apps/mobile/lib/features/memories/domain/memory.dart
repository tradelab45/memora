class Memory {
  const Memory({
    required this.id,
    required this.localPhotoId,
    required this.personIds,
    required this.occurredAt,
    required this.caption,
  });
  final String id;
  final String localPhotoId;
  final List<String> personIds;
  final DateTime occurredAt;
  final String caption;
}

abstract interface class MemoryRepository {
  Future<List<Memory>> listMemories();
  Future<void> saveMemory(Memory memory);
  Future<void> deleteMemory(String id);
}
