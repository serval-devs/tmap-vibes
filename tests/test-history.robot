***Settings***
Documentation    Tests for the History Sidebar feature.
Library          SeleniumLibrary

Suite Setup      Open Browser To Application
Suite Teardown   Close Browser

***Variables***
${APP_URL}                          http://localhost:5173
${BROWSER}                          Chrome                 
${HISTORY_EMPTY_TEXT}               No history yet
${HISTORY_SIDEBAR_SELECTOR}         id=history-first-item             
${CLEAR_HISTORY_BUTTON_SELECTOR}    id=clear-history-button        
${HISTORY_ITEM_SELECTOR}            id=history-first-item 
${ARTICLE_INPUT_SELECTOR}           id=content              
${ANALYZE_BUTTON_SELECTOR}          id=analyze-button              

***Keywords***
Open Browser To Application
    Open Browser    ${APP_URL}    ${BROWSER}
    Maximize Browser Window

Verify History Is Empty
    Wait Until Page Contains    ${HISTORY_EMPTY_TEXT}
    Element Should Not Be Visible    ${CLEAR_HISTORY_BUTTON_SELECTOR}

Add Article And Check History
    Input Text       ${ARTICLE_INPUT_SELECTOR}    This is a test article
    Click Button     ${ANALYZE_BUTTON_SELECTOR}
    Element Should Contain    ${HISTORY_ITEM_SELECTOR}    This is a test article...
    Element Should Be Visible    ${CLEAR_HISTORY_BUTTON_SELECTOR}

Clear History And Verify
    Wait Until Element Is Visible    ${CLEAR_HISTORY_BUTTON_SELECTOR}
    Click Button    ${CLEAR_HISTORY_BUTTON_SELECTOR}
    Verify History Is Empty

***Test Cases***
Verify Initial History State
    [Tags]    smoke
    Verify History Is Empty

Add Item And Verify History Sidebar
    [Tags]    history
    # Precondition: Ensure history is empty (or clear it)
    Run Keyword And Ignore Error    Click Button    ${CLEAR_HISTORY_BUTTON_SELECTOR} 
    Wait Until Page Does Not Contain Element    ${HISTORY_ITEM_SELECTOR}

    # Perform actions to add an item
    Add Article And Check History

Clear History
    [Tags]    history
    # Precondition: Add an item first so clear button is visible
    Add Article And Check History

    # Perform clear action
    Clear History And Verify