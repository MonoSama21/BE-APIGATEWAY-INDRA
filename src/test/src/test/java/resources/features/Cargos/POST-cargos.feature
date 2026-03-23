@SIAQR
Feature: POST /cargos - Registrar un nuevo cargo

Background:
  * url urlBase
  * path "/cargos"
  #GENERAR DATA RANDOM
  * def generators = read('classpath:resources/utils/generators.js')
  * def randomCargo = generators.GenerandoDataAleatoria().ocupacionRandom

  #OBTENER TOKEN
* def result = call read('classpath:resources/features/Usuarios/POST-usuariosLogin.feature@token-admin')
  * def token = result.response.token
  * header Authorization = 'Bearer ' + token


@test4 @crear-cargo
Scenario: Validar que se puede registrar un nuevo cargo
  And request
  """
  {
    "cargo": "#(randomCargo)",
    "descripcion": "Este es un cargo de prueba"
  }
  """
  When method POST
  Then status 201
  #GUARDAR VALORES
  * def cargoId = response.id
  * def cargoNombre = randomCargo
  * def cargoDescripcion = "Este es un cargo de prueba"
