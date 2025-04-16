*** Settings ***
Documentation     Language detection feature tests
Library           SeleniumLibrary
Resource          language-keywords.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser

*** Variables ***
${URL}            http://localhost:5173/
${BROWSER}        Chrome

*** Test Cases ***
Feature: Language detection and enforcement

  Scenario: Submit an English (American) article
    Given the user is on the fake news detector page
    When the user submits article file "articles/american_article.txt"
    Then the article should be accepted and analyzed

  Scenario: Submit a Dutch article
    Given the user is on the fake news detector page
    When the user submits article file "articles/dutch_article.txt"
    Then the system should reject the article due to non-English language

  Scenario: Submit an English article with Spanish words
    Given the user is on the fake news detector page
    When the user submits article file "articles/spanglish_article.txt"
    Then the system should reject the article due to non-English language

  Scenario: Submit an article with English and Dutch mixed
    Given the user is on the fake news detector page
    When the user submits article file "articles/mixed_language_article.txt"
    Then the system should reject the article due to non-English language
