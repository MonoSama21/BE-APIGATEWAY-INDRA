@postUsuarios @contract
Feature: Registrar un nuevo usuario

Background:
    * url urlBase
    * def schemas = read('classpath:resources/functional/schema/PostUsuarioSchemas.json')
    * def requestExitoso = read("classpath:resources/functional/request/Usuarios/requestCrearUsuario.json")
    * def randomEmail = 'yrvin+' + java.util.UUID.randomUUID() + '@gmail.com'

# =======================================================================
# 1. 🔵 SMOKE TEST - Disponibilidad básica
# =======================================================================
@contract @smoke @post @Escenario01 @crearUsuario
Scenario: Validar que el endpoint POST /usuarios está disponible y acepta requests
    * set requestExitoso.email = randomEmail
    Given path "usuarios"
    And request requestExitoso
    When method POST
    Then status 201
    * def id = response._id

# =======================================================================
# 2. 🟢 HAPPY PATH - Caso exitoso con datos válidos
# =======================================================================
@contract @happy-path @post @Escenario02
Scenario: Validar que se puede crear un usuario con todos los datos válidos y obligatorios
    * set requestExitoso.email = randomEmail
    Given path "usuarios"
    And request requestExitoso
    When method POST
    Then status 201
    And match response.message == 'Cadastro realizado com sucesso'
    And match response._id == '#string'
    And match response._id == '#notnull'

# =======================================================================
# 3. 📋 SCHEMA VALIDATION - Estructura de request y response
# =======================================================================
@contract @schema @post @Escenario03
Scenario: Validar que la estructura del response cumple con el schema definido para creación exitosa de usuario
    * set requestExitoso.email = randomEmail
    Given path "usuarios"
    And request requestExitoso
    When method POST
    Then status 201
    And match response == schemas['201']

# =======================================================================
# 5. ❌ ERROR HANDLING - Manejo de errores
# =======================================================================
@contract @error-handling @post @Escenario06
Scenario: Validar que el sistema rechaza el registro con email duplicado
    * set requestExitoso.email = 'fulano@qa.com'
    Given path "usuarios"
    And request requestExitoso
    When method POST
    Then status 400
    And match response == schemas['400_email_duplicado']
    And match response.message == 'Este email já está sendo usado'

@contract @error-handling @post @Escenario07
Scenario Outline: Validar <descripcion>
    * def requestData = <request>
    Given path "usuarios"
    And request requestData
    When method POST
    Then status 400

    Examples:
        | descripcion                                                      | request                                                                                                    |
        | que el registro sin datos retorna error 400                     | {}                                                                                                          | 
        | que el registro con nombre vacío retorna error 400              | { "nome": "", "email": "test@test.com", "password": "test123", "administrador": "true" }                    | 
        | que el registro con email vacío retorna error 400               | { "nome": "Test User", "email": "", "password": "test123", "administrador": "true" }                        |
        | que el registro sin campos obligatorios retorna error 400       | { "nome": "Test User", "email": "test@test.com" }                                                           | 

# =======================================================================
# 6. 📝 FIELD VALIDATION - Campos obligatorios vs opcionales
# =======================================================================
@contract @fields @post @Escenario08
Scenario: Validar que todos los campos obligatorios son requeridos para crear un usuario
    * set requestExitoso.email = randomEmail
    Given path "usuarios"
    And request requestExitoso
    When method POST
    Then status 201
    # Verificar que se creó con todos los campos
    And match response._id == '#present'
    And match response.message == '#present'

@contract @fields @post @Escenario09
Scenario: Validar que el campo administrador acepta valores 'true' y 'false' como string
    * set requestExitoso.email = randomEmail
    * set requestExitoso.administrador = 'false'
    Given path "usuarios"
    And request requestExitoso
    When method POST
    Then status 201
    And match response._id == '#string'

# =======================================================================
# 7. 🔢 DATA TYPES - Tipos de datos correctos
# =======================================================================
@contract @data-types @post @Escenario10
Scenario Outline: Validar <descripcion>
    * def requestData = <request>
    Given path "usuarios"
    And request requestData
    When method POST
    Then status <expectedStatus>

Examples:
    | descripcion                                                          | request                                                                                   | expectedStatus |
    | que nombre con tipo number es rechazado                             | { "nome": 123, "email": "test@test.com", "password": "test", "administrador": "true" }   | 400            |
    | que email con tipo number es rechazado                              | { "nome": "Test", "email": 123, "password": "test", "administrador": "true" }            | 400            |
    | que password con tipo number es rechazado                           | { "nome": "Test", "email": "test@test.com", "password": 123, "administrador": "true" }   | 400            |

# =======================================================================
# 8. ⚡ BOUNDARY TESTING - Valores límite y edge cases
# =======================================================================
@contract @boundary @post @Escenario12
Scenario: Validar que se puede crear un usuario con nombre mínimo de un carácter
    * def requestNombreMinimo = 
    """
    {
      "nome": "A",
      "email": "#(randomEmail)",
      "password": "test",
      "administrador": "true"
    }
    """
    Given path "usuarios"
    And request requestNombreMinimo
    When method POST
    Then status 201

@contract @boundary @post @Escenario15
Scenario: Validar que caracteres especiales en campos son manejados correctamente
    * def requestEspeciales = 
    """
    {
      "nome": "Test@#$%&*",
      "email": "#(randomEmail)",
      "password": "P@ssw0rd!#$",
      "administrador": "true"
    }
    """
    Given path "usuarios"
    And request requestEspeciales
    When method POST
    Then status 201

@contract @boundary @post @Escenario16
Scenario: Validar que el valor del campo administrador solo acepta 'true' o 'false'
    * def requestAdminInvalido = 
    """
    {
      "nome": "Test User",
      "email": "#(randomEmail)",
      "password": "test123",
      "administrador": "maybe"
    }
    """
    Given path "usuarios"
    And request requestAdminInvalido
    When method POST
    Then status 400
    And match response.administrador =="administrador deve ser 'true' ou 'false'"
