FROM python:3.7.5-alpine

RUN apk update && apk add build-base python-dev py-pip jpeg-dev zlib-dev openssl-dev gcc libffi-dev postgresql-dev
ENV LIBRARY_PATH=/lib:/usr/lib

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /usr/src/app

WORKDIR /usr/src/app/taxi

RUN python manage.py collectstatic --noinput
