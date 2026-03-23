Feature: DELETE /usuarios/{id} - Eliminar un usuario por ID

Background:
  * url urlBase
  * path "/usuarios"
  * def result = call read('POST-usuariosLogin.feature')
  * def token = result.response.token
  * header Authorization = 'Bearer ' + token


@test5 @eliminar-usuario
Scenario: Validar que se puede eliminar un usuario existente por ID
  Given path "/usuarios/1" 
  When method DELETE
  Then status 200
  