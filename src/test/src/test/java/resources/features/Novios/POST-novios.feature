Feature: POST /novios - Registrar un nuevo usuario (novio)

Background:
  * url urlBase
  * path "/novios"
  * call read('classpath:resources/utils/javafaker.js')
  * def data = GenerandoDataAleatoria()
  * def nombre = data.nombreRandom
  * def email = data.emailRandom
  * def telefono = data.telefonoRandom
  * print 'Nombre generado:', nombre
  * print 'Email generado:', email
  * print 'Telefono generado:', telefono


@prueba2
Scenario: Validar que se puede crear un nuevo usuario (novio)
  And request
  """
  {
    "nombre": "#(nombre)",
    "email": "#(email)",
    "telefono": "#(telefono)"
  }
  """
  When method POST
  Then status 201