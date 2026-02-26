function GenerandoDataAleatoria() {
  var Faker = Java.type('com.github.javafaker.Faker');
  var faker = new Faker();
  return {
    nombreRandom: faker.name().fullName(),
    emailRandom: faker.internet().emailAddress(),
    telefonoRandom: faker.phoneNumber().cellPhone()
  };
}

module.exports = GenerandoDataAleatoria();

