@putUsuarioById @contract
Feature: Editar usuario por ID

Background:
    * url urlBase
    * def schemas = read('classpath:resources/functional/schema/GetUsuariosSchemas.json')
    * def result = call read('POST-usuario.feature@crearUsuario')
    * def userId = result.id
    * def requestExitoso = read("classpath:resources/functional/request/Usuarios/requestActualizarUsuario.json")
    * def randomEmail = 'yrvin+' + java.util.UUID.randomUUID() + '@gmail.com'

# =======================================================================
# 1. 🔵 SMOKE TEST - Disponibilidad básica
# =======================================================================
@contract @smoke @put @Escenario01
Scenario: Validar que el endpoint PUT /usuarios/{_id} está disponible y acepta requests
    * set requestExitoso.email = randomEmail
    Given path "usuarios", userId
    And request requestExitoso
    When method PUT
    Then status 200

# =======================================================================
# 2. 🟢 HAPPY PATH - Caso exitoso con datos válidos
# =======================================================================
@contract @happy-path @put @Escenario02
Scenario: Validar que se puede actualizar un usuario existente con datos válidos
    * set requestExitoso.email = randomEmail
    * set requestExitoso.nome = 'Usuario Actualizado'
    Given path "usuarios", userId
    And request requestExitoso
    When method PUT
    Then status 200
    And match response == schemas['200_put_alterado']
    And match response.message == 'Registro alterado com sucesso'

@contract @happy-path @put @Escenario03
Scenario: Validar que se crea un nuevo usuario cuando el ID no existe
    * def idInexistente = 'ID_QUE_NO_EXISTE_999999'
    * set requestExitoso.email = randomEmail
    Given path "usuarios", idInexistente
    And request requestExitoso
    When method PUT
    Then status 201
    And match response == schemas['201_put']
    And match response.message == 'Cadastro realizado com sucesso'
    And match response._id == '#string'
    And match response._id == '#notnull'

# =======================================================================
# 3. 📋 SCHEMA VALIDATION - Estructura de request y response
# =======================================================================
@contract @schema @put @Escenario04
Scenario: Validar que la estructura del response cumple con el schema para actualización exitosa
    * set requestExitoso.email = randomEmail
    Given path "usuarios", userId
    And request requestExitoso
    When method PUT
    Then status 200
    And match response == schemas['200_put']

@contract @schema @put @Escenario05
Scenario: Validar que el request body contiene todos los campos requeridos según el contrato
    * set requestExitoso.email = randomEmail
    * def requestValidacion = 
    """
    {
      "nome": "#string",
      "email": "#string",
      "password": "#string",
      "administrador": "#string"
    }
    """
    Given path "usuarios", userId
    And request requestExitoso
    When method PUT
    Then status 200
    And match requestExitoso == requestValidacion

# =======================================================================
# 4. 🔑 HEADERS VALIDATION - Headers obligatorios
# =======================================================================


# =======================================================================
# 5. ❌ ERROR HANDLING - Manejo de errores
# =======================================================================
@contract @error-handling @put @Escenario07
Scenario: Validar que el sistema rechaza la actualización con email duplicado
    * set requestExitoso.email = 'fulano@qa.com'
    Given path "usuarios", userId
    And request requestExitoso
    When method PUT
    Then status 400
    And match response == schemas['400_email_duplicado']
    And match response.message == 'Este email já está sendo usado'

@contract @error-handling @put @Escenario08
Scenario Outline: Validar <descripcion>
    * def requestData = <request>
    Given path "usuarios", userId
    And request requestData
    When method PUT
    Then status 400

Examples:
    | descripcion                                                      | request                                                                                                      | 
    | que la actualización sin datos retorna error 400                | {}                                                                                                           | 
    | que la actualización con nombre vacío retorna error 400        | { "nome": "", "email": "test@test.com", "password": "test123", "administrador": "true" }                    | 
    | que la actualización con email vacío retorna error 400         | { "nome": "Test User", "email": "", "password": "test123", "administrador": "true" }                        |
    | que la actualización sin campos obligatorios retorna error 400  | { "nome": "Test User", "email": "test@test.com" }                                                           | 

# =======================================================================
# 6. 📝 FIELD VALIDATION - Campos obligatorios vs opcionales
# =======================================================================
@contract @fields @put @Escenario09
Scenario: Validar que todos los campos obligatorios son requeridos para actualizar un usuario
    * set requestExitoso.email = randomEmail
    Given path "usuarios", userId
    And request requestExitoso
    When method PUT
    Then status 200
    And match response.message == '#present'

@contract @fields @put @Escenario10
Scenario: Validar que el campo administrador acepta valores 'true' y 'false' como string
    * set requestExitoso.email = randomEmail
    * set requestExitoso.administrador = 'true'
    Given path "usuarios", userId
    And request requestExitoso
    When method PUT
    Then status 200
    And match response.message == 'Registro alterado com sucesso'

# =======================================================================
# 7. 🔢 DATA TYPES - Tipos de datos correctos
# =======================================================================
@contract @data-types @put @Escenario11
Scenario Outline: Validar <descripcion>
    * def requestData = <request>
    * set requestData.email = randomEmail
    Given path "usuarios", userId
    And request requestData
    When method PUT
    Then status <expectedStatus>

    Examples:
        | descripcion                                                          | request                                                                                 | expectedStatus |
        | que nombre con tipo number es rechazado                             | { "nome": 123, "email": "test@test.com", "password": "test", "administrador": "true" }   | 400            |
        | que password con tipo number es rechazado                           | { "nome": "Test", "email": "test@test.com", "password": 123, "administrador": "true" }   | 400            |

# =======================================================================
# 8. ⚡ BOUNDARY TESTING - Valores límite y edge cases
# =======================================================================
@contract @boundary @put @Escenario13
Scenario: Validar que se puede actualizar un usuario con nombre mínimo de un carácter
    * def requestNombreMinimo = 
    """
    {
      "nome": "A",
      "email": "#(randomEmail)",
      "password": "test",
      "administrador": "true"
    }
    """
    Given path "usuarios", userId
    And request requestNombreMinimo
    When method PUT
    Then status 200


@contract @boundary @put @Escenario15
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
    Given path "usuarios", userId
    And request requestEspeciales
    When method PUT
    Then status 200

@contract @boundary @put @Escenario16
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
    Given path "usuarios", userId
    And request requestAdminInvalido
    When method PUT
    Then status 400
    And match response.administrador == "administrador deve ser 'true' ou 'false'"
