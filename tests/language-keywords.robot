*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem

*** Keywords ***
Open Browser To App
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Page Contains Element    id:content

Close Browser
    Close All Browsers

Given the user is on the fake news detector page
    Go To    ${URL}
    Wait Until Page Contains Element    id:content

Add text into content fields
    Input Text      ${TEXTFIELD_ID}     This is a test article. It may contain fake news.
    Input Text      ${AUTHOR_ID}        Henk Anders
    Input Text      ${WEBSITE_ID}       www.nu.nl   

add another text into content fields
    Input Text      ${TEXTFIELD_ID}     This is a test article. It may contain real news.
    Input Text      ${AUTHOR_ID}        Jan Peters
    Input Text      ${WEBSITE_ID}       www.nos.nl   

Wait untill button is visible
    Wait Until Element Is Visible    ${CHECK_BUTTON}
    Click Element    ${CHECK_BUTTON}

When the user submits article file
    [Arguments]    ${filename}
    ${text}=    Get File    ${filename}
    Input Text    id:content    ${text}
    Click Element    id:analyze-button
    Sleep    2s

Then the article should be accepted and analyzed
    Wait Until Page Contains Element    id:confidence-percentage    timeout=5s
    Wait Until Page Contains Element    xpath=//*[text()='Low Risk' or text()='Medium Risk' or text()='High Risk']    timeout=5s
    ${confidence}=    Get Text    id:confidence-percentage
    Log    Confidence: ${confidence}

Then wait for history to update for first item
    Sleep    2s
    Wait Until Page Contains Element    ${FIRST_HISTORY_ITEM}
    ${history_text}    Get Text         id:history-item-1
    Log    History entry: ${history_text}

Then wait for history to update for second item
    Sleep    2s
    Wait Until Page Contains Element    ${SECOND_HISTORY_ITEM}
    ${history_text}    Get Text         id:history-item-2
    Log    History entry: ${history_text}

Clear History And Verify
    Wait Until Element Is Visible    ${CLEAR_HISTORY_BUTTON_SELECTOR}
    Click Button  ${CLEAR_HISTORY_BUTTON_SELECTOR}
    Wait Until Page Contains    ${HISTORY_EMPTY_TEXT}
    Element Should Not Be Visible    ${CLEAR_HISTORY_BUTTON_SELECTOR}
    
Select the first item in history and check contents
    Click Button   ${FIRST_HISTORY_ITEM_BUTTON}
    Wait Until Page Contains Element    ${FIRST_HISTORY_ITEM}
    ${history_text}    Get Text         id:history-item-1
    Log    History entry: ${history_text}

Then the system should reject the article due to non-English language
    Wait Until Page Contains    This article is not written in English    timeout=2s
