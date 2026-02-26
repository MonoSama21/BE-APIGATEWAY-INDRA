@getUsuarioById @contract
Feature: Buscar usuario por ID

Background:
    * url urlBase
    * def schemas = read('classpath:resources/functional/schema/GetUsuariosSchemas.json')
    * def result = call read('POST-usuario.feature@crearUsuario')
    * def userId = result.id

# =======================================================================
# 1. 🔵 SMOKE TEST - Disponibilidad básica
# =======================================================================
@contract @smoke @get @Escenario01
Scenario: Validar que el endpoint GET /usuarios/{_id} está disponible y responde correctamente
    Given path "usuarios", userId
    When method GET
    Then status 200

# =======================================================================
# 2. 🟢 HAPPY PATH - Caso exitoso con ID válido
# =======================================================================
@contract @happy-path @get @Escenario02
Scenario: Validar que la búsqueda por ID retorna los datos completos del usuario
    Given path "usuarios", userId
    When method GET
    Then status 200
    And match response.nome == '#string'
    And match response.email == '#string'
    And match response.password == '#string'
    And match response.administrador == '#string'
    And match response._id == userId

# =======================================================================
# 3. 📋 SCHEMA VALIDATION - Estructura de response
# =======================================================================
@contract @schema @get @Escenario03
Scenario: Validar que la estructura del response cumple con el schema definido en el contrato
    Given path "usuarios", userId
    When method GET
    Then status 200
    And match response == schemas['200_usuario_by_id']

@contract @schema @get @Escenario04
Scenario: Validar que el response contiene todos los campos obligatorios del usuario
    Given path "usuarios", userId
    When method GET
    Then status 200
    And match response == 
    """
    {
      nome: '#string',
      email: '#string',
      password: '#string',
      administrador: '#string',
      _id: '#string'
    }
    """

# =======================================================================
# 5. ❌ ERROR HANDLING - Manejo de errores
# =======================================================================
@contract @error-handling @get @Escenario06
Scenario: Validar que la búsqueda con ID inexistente retorna error 400
    Given path "usuarios", 'ID_999999'
    When method GET
    Then status 400
    And match response == schemas['400_usuario_nao_encontrado']

@contract @error-handling @get @Escenario07
Scenario Outline: Validar <descripcion>
    Given path "usuarios", '<userId>'
    When method GET
    Then status <expectedStatus>

    Examples:
        | descripcion                                                      | userId              | expectedStatus |
        | que un ID con formato inválido retorna error 400                 | abc123xyz           | 400            |
        | que un ID con caracteres especiales retorna error 400            | @#$%&*              | 400            |

# =======================================================================
# 6. 📝 FIELD VALIDATION - Campos obligatorios
# =======================================================================
@contract @fields @get @Escenario08
Scenario: Validar que todos los campos obligatorios están presentes en la respuesta
    Given path "usuarios", userId
    When method GET
    Then status 200
    And match response.nome == '#present'
    And match response.email == '#present'
    And match response.password == '#present'
    And match response.administrador == '#present'
    And match response._id == '#present'

@contract @fields @get @Escenario09
Scenario: Validar que el _id del response coincide con el _id solicitado
    Given path "usuarios", userId
    When method GET
    Then status 200
    And match response._id == userId

# =======================================================================
# 7. 🔢 DATA TYPES - Tipos de datos correctos
# =======================================================================
@contract @data-types @get @Escenario10
Scenario: Validar que todos los campos tienen el tipo de dato correcto según el contrato
    Given path "usuarios", userId
    When method GET
    Then status 200
    And match response.nome == '#string'
    And match response.email == '#string'
    And match response.password == '#string'
    And match response.administrador == '#string'
    And match response._id == '#string'
    # Validar formato de email
    And match response.email == '#regex .+@.+'
    # Validar que administrador es 'true' o 'false' como string
    And match response.administrador == '#regex (true|false)'

@contract @data-types @get @Escenario11
Scenario: Validar que el campo _id es un string alfanumérico válido
    Given path "usuarios", userId
    When method GET
    Then status 200
    And match response._id == '#string'
    And match response._id == '#notnull'
    And assert response._id.length > 0

# =======================================================================
# 8. ⚡ BOUNDARY TESTING - Valores límite y edge cases
# =======================================================================

@contract @boundary @get @Escenario15
Scenario: Validar que espacios en el ID son rechazados
    Given path "usuarios", 'id con espacios'
    When method GET
    Then status 400

@contract @boundary @get @Escenario16
Scenario: Validar que el usuario encontrado mantiene la consistencia de datos
    Given path "usuarios", userId
    When method GET
    Then status 200
    # Verificar que el email tiene formato válido
    And match response.email == '#regex .+@.+'
    # Verificar que el _id no está vacío
    And assert response._id.length > 0
    # Verificar que el nombre no está vacío
    And assert response.nome.length > 0
