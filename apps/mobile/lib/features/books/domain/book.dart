enum BookKind { monthly, person, trip, annual, custom }

class MemoryBook {
  const MemoryBook({
    required this.id,
    required this.title,
    required this.kind,
    required this.memoryIds,
  });
  final String id;
  final String title;
  final BookKind kind;
  final List<String> memoryIds;
}

abstract interface class BookRepository {
  Future<List<MemoryBook>> listBooks();
  Future<MemoryBook> createBook(List<String> memoryIds, BookKind kind);
}
