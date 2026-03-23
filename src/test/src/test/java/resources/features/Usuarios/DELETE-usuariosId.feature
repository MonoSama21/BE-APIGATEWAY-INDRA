@SIAQR
Feature: DELETE /usuarios/{id} - Eliminar un usuario por ID

Background:
  * url urlBase
  * path "/usuarios"
  * def result = call read('POST-usuariosLogin.feature')
  * def token = result.response.token
  * header Authorization = 'Bearer ' + token
  * def id = call read('POST-usuarios.feature')
  * def idUsuario = id.response.id


@test5 @eliminar-usuario
Scenario: Validar que se puede eliminar un usuario existente por ID
  Given path idUsuario
  When method DELETE
  Then status 200
  