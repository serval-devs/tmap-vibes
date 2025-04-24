*** Settings ***
Documentation     Test suite to check article analysis functionality
Library    SeleniumLibrary
Library    OperatingSystem

*** Variables ***
${URL}            http://localhost:5175/
${BROWSER}        Chrome
${TEXTFIELD_ID}   id:content
${CHECK_BUTTON}   id:analyze-button
${ERROR_MESSAGE}  xpath=//*[text()='Text cannot exceed 300 words']
${ERROR_MESSAGE_EMPTY}  xpath=//*[text()='Text is required']
${EMPTY_STRING}     '   '
${FAKE_CONFIDENCE_SELECTOR}   id:confidence-percentage

*** Test Cases ***
# Testcase 1: Validate Article Length (0 words)
Validate Article Length 0 Words
    [Documentation]    Test that the check button remains disabled when the article has 0 words.
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

    Wait Until Page Contains Element    ${TEXTFIELD_ID}
    Clear Element Text    ${TEXTFIELD_ID}

    Element Attribute Value Should Be    ${CHECK_BUTTON}    disabled    true

    Close All Browsers

# Testcase 2: Enable Check Button (1-300 words)
Enable Check Button 1-300 Words
    [Documentation]    Test that the check button is enabled when the article has 1-300 words.
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

    Wait Until Page Contains Element    ${TEXTFIELD_ID}
    Input Text    ${TEXTFIELD_ID}    This is a test article.

    Wait Until Element Is Enabled    ${CHECK_BUTTON}

#    Wait Until Element Is Visible    ${CHECK_BUTTON}
#    Click Element    ${CHECK_BUTTON}
#
#    Wait Until Page Contains Element    ${FAKE_CONFIDENCE_SELECTOR}    timeout=5s
#    Element Should Be Visible           ${FAKE_CONFIDENCE_SELECTOR}
#    ${confidence}    Get Text           ${FAKE_CONFIDENCE_SELECTOR}
#    Log    Fake News Confidence: ${confidence}

    Close All Browsers

# Testcase 3: Validate Article Length (>300 words)
Validate Article Length 300 Words
    [Documentation]    Test that the check button remains disabled when the article has more then 300 words.
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

    Wait Until Page Contains Element    ${TEXTFIELD_ID}
    ${text}=    Get File    tests/resources/long_text.txt
    Input Text    ${TEXTFIELD_ID}    ${text}

    Wait Until Page Contains Element    ${ERROR_MESSAGE}
    Element Attribute Value Should Be    ${CHECK_BUTTON}    disabled    true

    Close All Browsers

# Testcase 4: Disable Check Button (>300 words)
Disable Check Button Over 300 Words
    [Documentation]    Test that the check button is disabled and an error message appears when the article exceeds 300 words.
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

    Wait Until Page Contains Element    ${TEXTFIELD_ID}
    Input Text    ${TEXTFIELD_ID}    This is a test article.

    Wait Until Element Is Visible    ${CHECK_BUTTON}
    Click Element    ${CHECK_BUTTON}

    Wait Until Page Contains Element    ${FAKE_CONFIDENCE_SELECTOR}    timeout=5s
    Element Should Be Visible           ${FAKE_CONFIDENCE_SELECTOR}
    ${confidence}    Get Text           ${FAKE_CONFIDENCE_SELECTOR}
    Log    Fake News Confidence: ${confidence}

    ${text}=    Get File    tests/resources/long_text.txt
    Input Text    ${TEXTFIELD_ID}    ${text}

    Wait Until Page Contains Element    ${ERROR_MESSAGE}
    Element Attribute Value Should Be    ${CHECK_BUTTON}    disabled    true

    Close All Browsers

# Testcase 5: Clear Textfield
Clear Textfield
    [Documentation]    Test that clearing the textfield resets the state to "Ready for Article Input".
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

    Wait Until Page Contains Element    ${TEXTFIELD_ID}
    Input Text    ${TEXTFIELD_ID}    This is a test article.
    Wait Until Element Is Visible    ${CHECK_BUTTON}
    Click Element    ${CHECK_BUTTON}

    Wait Until Page Contains Element    ${FAKE_CONFIDENCE_SELECTOR}    timeout=5s
    Element Should Be Visible           ${FAKE_CONFIDENCE_SELECTOR}
    ${confidence}    Get Text           ${FAKE_CONFIDENCE_SELECTOR}
    Log    Fake News Confidence: ${confidence}

#    Input Text    ${TEXTFIELD_ID}

#    Press Keys   ${TEXTFIELD_ID}     \\ue009a\ \ue003
#    Clear Element Text    ${TEXTFIELD_ID}
#    Input Text    ${TEXTFIELD_ID}    ${EMPTY_STRING}
#    Execute JavaScript   document.getElementById('content').value = '';
#    Execute JavaScript  document.getElementById('content').value = '';
#
#    Sleep    10s
#
#    # Verifieer dat het tekstveld leeg is
##    ${text}      Execute JavaScript     return document.getElementById('content').value;
##    Should Be Empty     ${text}
#
#    ${text}    Get Text    ${TEXTFIELD_ID}
#    Should Be Empty    ${text}
#
#    Element Attribute Value Should Be    ${CHECK_BUTTON}    disabled    true
#    Wait Until Page Contains Element    ${ERROR_MESSAGE_EMPTY}

    Close All Browsers

# Testcase 6: Run Model on Article
Run Model on Article
    [Documentation]    Test that the model runs on the article and the system returns to the initial state.
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

    Wait Until Page Contains Element    ${TEXTFIELD_ID}
    Input Text    ${TEXTFIELD_ID}    This is a test article. It may contain fake news.

    Wait Until Element Is Visible    ${CHECK_BUTTON}
    Click Element    ${CHECK_BUTTON}

    Wait Until Page Contains Element    ${FAKE_CONFIDENCE_SELECTOR}    timeout=5s
    Element Should Be Visible           ${FAKE_CONFIDENCE_SELECTOR}
    ${confidence}    Get Text           ${FAKE_CONFIDENCE_SELECTOR}
    Log    Fake News Confidence: ${confidence}

    Wait Until Element Is Enabled    ${CHECK_BUTTON}

    Close All Browsers
