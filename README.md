### graphene starter

# Tested version

- python 3.6.10
- node 12

# Installation

- Install requirement component

```
git clone ...
cd sr
pyenv install 3.6.10
pyenv virtualenv 3.6.10 graphue
pyenv local 3.6.10 graphue
pip install -r requirements.txt
```

- Migrate db

```
flask db upgrade
```

- Start backend server

```
FLASK_ENV=development python manage.py
```

- Start frontend server

```
cd src/template
yarn
yarn serve
```

- Enter site

```
http://localhost:8080/install
```

# GraphQL endpoint

```
http://localhost:5000/graphql
```

# REST endpoint

```
http://localhost:5000/rest
```

# Start dev

```
cd src
FLASK_ENV=development python manage.py
```

### Generate Graphql api documentation

```
yarn add graphdoc
graphdoc -f -e http://localhost:5000/graphql -o ./docs/schema
```

### Flask i18n with flask-babel

- Load all language variable

```
cd src
pybabel extract -F babel.cfg -o messages.pot .
```

- Create translation files

```
cd src
pybabel init -i messages.pot -d app/language -l en
```

- Update translation files

```
cd src
pybabel update -i messages.pot -d app/language
```

- All in one line

```
pybabel extract -F babel.cfg -o messages.pot . && pybabel update -i messages.pot -d app/language && pybabel compile -d app/translations
```

### AB test

```
cd apache-benchmark
ab -p post_data.txt -T application/json -H 'authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MjYyNDcyNzQsImlhdCI6MTU5NDcxMTI2OSwic3ViIjoxfQ.YGgjKzRpP4U4iwK-j5i0GAeYgzxArjZimOnKEglYYMg' -c 10 -n 100 http://localhost:5000/graphql
```
