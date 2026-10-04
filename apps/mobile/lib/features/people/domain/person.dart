class Person {
  const Person({required this.id, required this.displayName});
  final String id;
  final String displayName;
}

abstract interface class PeopleRepository {
  Future<List<Person>> listPeople();
  Future<void> savePerson(Person person);
  Future<void> deletePerson(String id);
}
