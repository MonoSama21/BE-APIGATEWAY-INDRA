@SIAQR
Feature: PUT /usuarios/password - Cambiar contraseña del usuario autenticado

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

  * path "/login"
  * print "ID del usuario autenticado:", idUsuario
  * print "Email del usuario autenticado:", guardarEmail
  * print "Password del usuario autenticado:", guardarPassword

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


@test6 @cambiar-password
Scenario: Hola
    * remove header Authorization
    * header Authorization = 'Bearer ' + nuevoToken
    * remove path
    * path "usuarios/password"
    And request
    """
    {
        "passwordActual": "123456",
        "passwordNueva": "yrvin123"
    }
    """
    When method PUT
    Then status 200
    
