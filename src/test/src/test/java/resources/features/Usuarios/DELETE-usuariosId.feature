@deleteUsuarioById @contract
Feature: Excluir usuário por ID

Background:
    * url urlBase
    * def schemas = read('classpath:resources/functional/schema/GetUsuariosSchemas.json')
    * def result = call read('POST-usuario.feature@crearUsuario')
    * def userId = result.id

# =======================================================================
# 1. 🔵 SMOKE TEST - Disponibilidad básica
# =======================================================================
@contract @smoke @delete @Escenario01
Scenario: Validar que el endpoint DELETE /usuarios/{_id} está disponible y responde correctamente
    Given path "usuarios", userId
    When method DELETE
    Then status 200

# =======================================================================
# 2. 🟢 HAPPY PATH - Caso exitoso con ID válido
# =======================================================================
@contract @happy-path @delete @Escenario02
Scenario: Validar que se puede eliminar un usuario existente correctamente
    Given path "usuarios", userId
    When method DELETE
    Then status 200
    And match response == schemas['200_delete']
    And match response.message == 'Registro excluído com sucesso'

# =======================================================================
# 3. 📋 SCHEMA VALIDATION - Estructura de response
# =======================================================================
@contract @schema @delete @Escenario03
Scenario: Validar que la estructura del response cumple con el schema para eliminación exitosa
    Given path "usuarios", userId
    When method DELETE
    Then status 200
    And match response == 
    """
    {
      message: '#string'
    }
    """

@contract @schema @delete @Escenario04
Scenario: Validar que el response tiene el formato correcto cuando no hay registro para eliminar
    * def idInexistente = 'ID_INEXISTENTE_999999'
    Given path "usuarios", idInexistente
    When method DELETE
    Then status 200
    And match response.message == 'Nenhum registro excluído'

# =======================================================================
# 6. 📝 FIELD VALIDATION - Campos en response
# =======================================================================
@contract @fields @delete @Escenario08
Scenario: Validar que el campo message está presente en la respuesta exitosa
    Given path "usuarios", userId
    When method DELETE
    Then status 200
    And match response.message == '#present'
    And match response.message == '#notnull'

@contract @fields @delete @Escenario09
Scenario: Validar que el mensaje de eliminación exitosa es el esperado
    Given path "usuarios", userId
    When method DELETE
    Then status 200
    And match response.message contains 'excluído'

# =======================================================================
# 7. 🔢 DATA TYPES - Tipos de datos correctos
# =======================================================================
@contract @data-types @delete @Escenario10
Scenario: Validar que el campo message es de tipo string
    Given path "usuarios", userId
    When method DELETE
    Then status 200
    And match response.message == '#string'
    And assert typeof response.message == 'string'

# =======================================================================
# 8. ⚡ BOUNDARY TESTING - Valores límite y edge cases
# =======================================================================
@contract @boundary @delete @Escenario12
Scenario: Validar que intentar eliminar el mismo usuario dos veces retorna mensaje correcto
    Given path "usuarios", userId
    When method DELETE
    Then status 200
    And match response.message == 'Registro excluído com sucesso'
    # Segundo intento debería retornar nenhum registro
    Given path "usuarios", userId
    When method DELETE
    Then status 200
    And match response.message == 'Nenhum registro excluído'

@contract @boundary @delete @Escenario13
Scenario: Validar que un ID de longitud mínima es procesado correctamente
    Given path "usuarios", '1'
    When method DELETE
    Then status 200
    And match response.message == 'Nenhum registro excluído'

@contract @boundary @delete @Escenario14
Scenario: Validar que un ID de longitud máxima es procesado correctamente
    * def idLargo = 'A'.repeat(100)
    Given path "usuarios", idLargo
    When method DELETE
    Then status 200
    And match response.message == 'Nenhum registro excluído'

@contract @boundary @delete @Escenario15
Scenario: Validar que un ID numérico es manejado correctamente
    Given path "usuarios", '123456'
    When method DELETE
    Then status 200
    And match response.message == 'Nenhum registro excluído'