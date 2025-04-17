# TMAP2025Mar
Capgemini TMAP training march 2025



Run app.py file 
$env:FLASK_APP = "app.py"
$env:FLASK_ENV = "development"
flask run
$env:FLASK_ENV = "production"    # $env:FLASK_ENV = "testing"

Unit test test_app.py

python test_app.py
coverage run test_app.py
coverage report -m
coverage html # open htmlcov/index.html
