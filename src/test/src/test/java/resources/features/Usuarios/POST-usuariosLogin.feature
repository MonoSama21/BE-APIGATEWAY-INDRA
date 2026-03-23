@SIAQR
Feature: POST /usuarios/login - Iniciar sesión y obtener token JWT

Background:
  * url urlBase
  * path "/usuarios/login"

@test1 @token-admin
Scenario: Validar que el servicio de iniciar sesión funciona correctamente para el rol ADMIN
  And request
  """
    {
    "email": "admin@gmail.com",
    "password": "123456"
    }
  """
  When method POST
  Then status 200
  * def token = response.token

@test2
Scenario: Validar que el servicio de iniciar sesión funciona correctamente para el rol PERSONAL
  And request
  """
    {
    "email": "personal@gmail.com",
    "password": "123456"
    }
  """
  When method POST
  Then status 200