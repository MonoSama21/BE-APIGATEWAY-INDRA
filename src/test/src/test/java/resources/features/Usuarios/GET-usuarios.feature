Feature: GET /usuarios - Obtener lista de usuarios con paginación

Background:
  * url urlBase
  * path "/usuarios"
  * def result = call read('POST-usuariosLogin.feature')
  * def token = result.response.token
  * header Authorization = 'Bearer ' + token

@test3
Scenario: Validar que el servicio de obtener lista de usuarios funciona correctamente con paginación
  * param pagina = 1
  * param estado = true
  * param limite = 10
  And request
  When method GET
  Then status 200