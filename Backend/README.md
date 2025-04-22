# TMAP2025Mar
Capgemini TMAP training march 2025

# Running the Backend Controller (app.py)

# Setup

# Python venv activation
    venv\Scripts\activate.bat

# Activate the environment:
    $env:FLASK_APP = "app.py"
    $env:FLASK_ENV = "development"

# Run the Flask application:
    flask run

# For production or testing environments, set the environment variable accordingly:
    $env:FLASK_ENV = "production"   
    $env:FLASK_ENV = "testing"
    python  app.py

# Running Unit Tests (test_app.py)

# Execute the unit tests:
    python test_app.py
# Generate a coverage report:
    coverage run test_app.py
    coverage report -m
# Generate an HTML coverage report and open it:
    coverage html # open htmlcov/index.html
