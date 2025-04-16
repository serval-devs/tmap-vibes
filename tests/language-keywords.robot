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

Then the system should reject the article due to non-English language
    Wait Until Page Contains    This article is not written in English    timeout=2s
