// Selected-person matching only. Never identify strangers.
abstract interface class LocalRecognizer {
  Future<void> enrollPerson(String personId, List<String> localPhotoIds);
  Future<List<String>> matchSelectedPeople(String localPhotoId);
  Future<void> deletePersonTemplates(String personId);
}
// Implement with a device-only encrypted vault. No network or sync serializer.
