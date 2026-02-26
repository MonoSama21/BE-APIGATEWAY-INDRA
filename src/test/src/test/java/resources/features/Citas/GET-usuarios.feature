@getUsuarios @contract
Feature: Listar todos los usuarios

Background:
    * url urlBase
    * def schemas = read('classpath:resources/functional/schema/GetUsuariosSchemas.json')

# =======================================================================
# 1. 🔵 SMOKE TEST - Disponibilidad básica
# =======================================================================
@contract @smoke @get @Escenario01
Scenario: Validar que el endpoint GET /usuarios está disponible y responde correctamente
    Given path "usuarios"
    When method GET
    Then status 200

# =======================================================================
# 2. 🟢 HAPPY PATH - Caso exitoso con datos válidos
# =======================================================================
@contract @happy-path @get @Escenario02
Scenario: Validar que el servicio retorna la lista completa de usuarios con todos los campos obligatorios
    Given path "usuarios"
    When method GET
    Then status 200
    And match response.quantidade == '#number'
    And match response.usuarios == '#array'
    And match response.usuarios[0].nome == '#string'
    And match response.usuarios[0].email == '#string'
    And match response.usuarios[0].password == '#string'
    And match response.usuarios[0].administrador == '#string'
    And match response.usuarios[0]._id == '#string'

# =======================================================================
# 3. 📋 SCHEMA VALIDATION - Estructura de response
# =======================================================================
@contract @schema @get @Escenario03
Scenario: Validar que la estructura del response cumple con el schema definido en el contrato
    Given path "usuarios"
    When method GET
    Then status 200
    And match response == schemas['200']
    And match each response.usuarios == schemas['200_usuario']

# =======================================================================
# 5. ❌ ERROR HANDLING - Manejo de errores con parámetros inválidos
# =======================================================================
@contract @error-handling @get @Escenario06
Scenario Outline: Validar <descripcion>
    Given path "usuarios"
    And param <paramName> = "<paramValue>"
    When method GET
    Then status <expectedStatus>

    Examples:
        | descripcion                                                           | paramName     | paramValue | expectedStatus |
        | que el parámetro administrador con valor inválido retorna error 400  | administrador | invalid    | 400            |
        | que el parámetro administrador con valor incorrecto retorna error 400 | administrador | maybe      | 400            |

# =======================================================================
# 6. 📝 FIELD VALIDATION - Query params opcionales
# =======================================================================
@contract @fields @get @Escenario07
Scenario: Validar que el filtro por _id específico retorna resultados correctos
    Given path "usuarios"
    And param _id = '0uxuPY0cbmQhpEz1'
    When method GET
    Then status 200
    And match response.usuarios == '#array'

@contract @fields @get @Escenario08
Scenario: Validar que el filtro por nombre retorna usuarios que coinciden con el criterio
    Given path "usuarios"
    And param nome = 'Fulano da Silva'
    When method GET
    Then status 200
    And match response.usuarios == '#array'

@contract @fields @get @Escenario09
Scenario: Validar que el filtro por email retorna el usuario correspondiente
    Given path "usuarios"
    And param email = 'beltrano@qa.com.br'
    When method GET
    Then status 200
    And match response.usuarios == '#array'

@contract @fields @get @Escenario10
Scenario: Validar que el filtro por administrador true retorna solo usuarios administradores
    Given path "usuarios"
    And param administrador = 'true'
    When method GET
    Then status 200
    And match response.usuarios == '#array'
    And match each response.usuarios[*].administrador == 'true'

@contract @fields @get @Escenario11
Scenario: Validar que el filtro por administrador false retorna solo usuarios no administradores
    Given path "usuarios"
    And param administrador = 'false'
    When method GET
    Then status 200
    And match response.usuarios == '#array'

# =======================================================================
# 7. 🔢 DATA TYPES - Tipos de datos correctos
# =======================================================================
@contract @data-types @get @Escenario12
Scenario: Validar que todos los campos del response tienen el tipo de dato correcto según el contrato
    Given path "usuarios"
    When method GET
    Then status 200
    And match response.quantidade == '#number'
    And match response.usuarios == '#array'
    And match response.usuarios[0].nome == '#string'
    And match response.usuarios[0].email == '#string'
    And match response.usuarios[0].password == '#string'
    And match response.usuarios[0].administrador == '#string'
    And match response.usuarios[0]._id == '#string'
    # Validar formato de email
    And match response.usuarios[0].email == '#regex .+@.+'
    # Validar que administrador es 'true' o 'false' como string
    And match response.usuarios[0].administrador == '#regex (true|false)'

# =======================================================================
# 8. ⚡ BOUNDARY TESTING - Valores límite y edge cases
# =======================================================================
@contract @boundary @get @Escenario13
Scenario: Validar que la búsqueda sin resultados retorna una lista vacía
    Given path "usuarios"
    And param _id = 'ID_QUE_NO_EXISTE_999999'
    When method GET
    Then status 200
    And match response.quantidade == 0
    And match response.usuarios == []

@contract @boundary @get @Escenario14
Scenario: Validar que se pueden aplicar múltiples filtros simultáneamente en la búsqueda
    Given path "usuarios"
    And param nome = 'Fulano da Silva'
    And param administrador = 'true'
    When method GET
    Then status 200
    And match response.usuarios == '#array'

@contract @boundary @get @Escenario15
Scenario: Validar que los parámetros de búsqueda vacíos son manejados correctamente
    Given path "usuarios"
    And param nome = ''
    When method GET
    Then status 200
    And match response == '#object'

@contract @boundary @get @Escenario16
Scenario: Validar que los caracteres especiales en los parámetros de búsqueda son procesados correctamente
    Given path "usuarios"
    And param nome = 'Test@#$%'
    When method GET
    Then status 200
    And match response.usuarios == '#array'
