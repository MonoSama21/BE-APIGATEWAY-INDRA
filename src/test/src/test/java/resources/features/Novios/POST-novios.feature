Feature: Crear novios

Scenario: Crear un nuevo novio
  Given url 'http://localhost:6500/novios'
  And request 
  """
  { "nombre": "Juan", "apellido": "Perez", "email": "juan.perez@example.com" }
    """
    When method post
    Then status 201