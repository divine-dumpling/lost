ARG base_image=l3pcv/lost-base:3.14-depupdate0
FROM $base_image

ARG LOST_VERSION

RUN mkdir /home/user
WORKDIR /home/user/lost-setup
COPY . .
ENV IS_USING_DOCKER=true
RUN /bin/bash -e setup/install.sh

WORKDIR /usr/local/src/lost/
ADD docker/lost/nginx/dev.conf /etc/nginx/sites-available/
ADD docker/lost/nginx/prod.conf /etc/nginx/sites-available/
RUN rm -r /code/build
RUN rm -r /home/user/lost-setup

ADD /docker/lost/entrypoint.sh /
ADD /docker/lost/pytest.sh /

RUN echo "__version__='${LOST_VERSION}'" > /code/src/backend/lost/__init__.py
