Feature: POST /usuarios - Registrar un nuevo usuario del sistema

Background:
  * url urlBase
  * path "/usuarios"
  #GENERAR DATA RANDOM
  * def generators = read('classpath:resources/utils/generators.js')
  * def randomNombre = generators.GenerandoDataAleatoria().nombreRandom
  * def randomEmail = generators.GenerandoDataAleatoria().emailRandom
  * def randomTelefono = generators.GenerandoDataAleatoria().telefonoRandom
  * print 'Datos aleatorios generados - Nombre:', randomNombre, 'Email:', randomEmail, 'Teléfono:', randomTelefono
  #OBTENER TOKEN
  * def result = call read('POST-usuariosLogin.feature')
  * def token = result.response.token
  * header Authorization = 'Bearer ' + token


@test4
Scenario: Validar que se puede registrar un nuevo usuario con rol ADMIN
  And request
  """
  {
    "nombre": "#(randomNombre)",
    "email": "#(randomEmail)",
    "telefono": "#(randomTelefono)",
    "password": "123456",
    "rol": "ADMIN"
  }
  """
  When method POST
  Then status 201