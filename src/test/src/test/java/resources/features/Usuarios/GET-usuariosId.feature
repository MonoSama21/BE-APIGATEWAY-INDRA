Feature: GET /usuarios/{id} - Obtener detalle de un usuario por ID

Background:
  * url urlBase
  * path "/usuarios"
  * def result = call read('POST-usuariosLogin.feature')
  * def token = result.response.token
  * header Authorization = 'Bearer ' + token
  * def id = call read('POST-usuarios.feature')
  * def idUsuario = id.response.id


@test5 @detalle-usuario
Scenario: Validar que se puede obtener el detalle de un usuario existente por ID
  Given path idUsuario
  When method GET
  Then status 200
  