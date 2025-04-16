*** Settings ***
Documentation     Test suite to check article analysis functionality
Library           SeleniumLibrary

*** Variables ***
${URL}            http://localhost:5173/
${BROWSER}        Chrome
${TEXTFIELD_ID}   id:content
${CHECK_BUTTON}   id:analyze-button
${FAKE_CONFIDENCE_SELECTOR}   id:confidence-percentage
${RISK_LABEL}    xpath=//*[text()='Low Risk' or text()='Medium Risk' or text()='High Risk']
${HISTORY_MATCH}    id:history-first-item

*** Test Cases ***
Check Article Text Can Be Submitted and Analyzed
    [Documentation]    Test that user can enter text, analyze, see results, and history gets updated.
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

    Wait Until Page Contains Element    ${TEXTFIELD_ID}
    Input Text    ${TEXTFIELD_ID}    This is a test article. It may contain fake news.

    Wait Until Element Is Visible    ${CHECK_BUTTON}
    Click Element    ${CHECK_BUTTON}

    Wait Until Page Contains Element    ${FAKE_CONFIDENCE_SELECTOR}    timeout=10s
    Element Should Be Visible           ${FAKE_CONFIDENCE_SELECTOR}
    ${confidence}    Get Text           ${FAKE_CONFIDENCE_SELECTOR}
    Log    Fake News Confidence: ${confidence}

    # Verify Risk Label is visible (Low, Medium, or High Risk)
    Wait Until Element Is Visible    ${RISK_LABEL}
    ${risk_label}    Get Text    ${RISK_LABEL}
    Should Contain Any    ${risk_label}    Low Risk    Medium Risk    High Risk

    # Wait for history to update
    Sleep    2s
    Wait Until Page Contains Element    ${HISTORY_ITEM}
    ${history_text}    Get Text         id:history-first-item
    Log    History entry: ${history_text}

    Close Browser
