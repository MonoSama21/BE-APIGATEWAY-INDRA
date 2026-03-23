@SIAQR
Feature: PUT /usuarios/datos - Actualizar datos del usuario autenticado

Background:
  * url urlBase
  * path "/usuarios"
  * def result = call read('POST-usuariosLogin.feature')
  * def token = result.response.token
  * header Authorization = 'Bearer ' + token
  * def resultUsuario = call read('POST-usuarios.feature')
  * def idUsuario = resultUsuario.usuarioId
  * def guardarEmail = resultUsuario.usuarioEmail
  * def guardarPassword = resultUsuario.usuarioPassword
  * def generators = read('classpath:resources/utils/generators.js')
  * def randomNombre = generators.GenerandoDataAleatoria().nombreRandom
  * def randomEmail = generators.GenerandoDataAleatoria().emailRandom
  * def randomTelefono = generators.GenerandoDataAleatoria().telefonoRandom
  * path "/login"

  And request
  """
    {
    "email": "#(guardarEmail)",
    "password": "#(guardarPassword)"
    }
  """
  When method POST
  Then status 200
  * def nuevoToken = response.token


@test6 @actualizar-datos
Scenario: Validar que el servicio de actualizar datos del usuario autenticado funciona correctamente
    * remove header Authorization
    * header Authorization = 'Bearer ' + nuevoToken
    * remove path
    * path "usuarios/datos"
    And request
    """
    {
        "nombre": "#(randomNombre)",
        "email": "#(randomEmail)",
        "telefono": "#(randomTelefono)"
    }
    """
    When method PUT
    Then status 200
    
