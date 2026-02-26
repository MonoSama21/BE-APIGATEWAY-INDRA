Feature: GET /novios - Obtener todos los usuarios (novios)

Background:
  * url urlBase
  * path "/novios"

@prueba1
Scenario: Validar que se puede obtener los novios 
  When method GET
  Then status 200