# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: npatron <npatron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/12/16 21:47:56 by npatron           #+#    #+#              #
#    Updated: 2026/04/28 16:49:14 by npatron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:18-bullseye AS webapp-builder

WORKDIR /webapp

COPY webapp/package*.json ./
RUN npm install

COPY webapp/ ./
RUN npm run build

FROM node:18-bullseye

WORKDIR /app

COPY server/package*.json ./
RUN npm install

RUN apt-get update && apt-get install -y \
    gcc \
    musl-tools \
    postgresql-client \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

COPY server/ ./


COPY --from=webapp-builder /webapp/dist /client-dist

ENV CLIENT_DIST=/client-dist

CMD ["sh", "script.sh"]
