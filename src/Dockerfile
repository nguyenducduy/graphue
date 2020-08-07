# develop stage
FROM python:3.6 as develop-stage
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
WORKDIR /src
COPY requirements.txt ./
RUN pip install -r requirements.txt
ADD . .

# build stage
FROM python:3.6 as build-stage
WORKDIR /src
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

# Production stage
FROM python:3.6 as production-stage
EXPOSE 5000
CMD gunicorn -b 0.0.0.0:5000 --worker-class eventlet -w 3 manage:app --max-requests 10000 --timeout 5 --keep-alive 5 --log-level info -e FLASK_ENV=production