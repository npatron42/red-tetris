# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: npatron <npatron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/12/16 21:47:56 by npatron           #+#    #+#              #
#    Updated: 2024/12/23 10:09:09 by npatron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #


FROM node:18-bullseye

WORKDIR /app

COPY ../package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y \
    gcc \
    musl-tools \
    postgresql-client \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["sh", "script.sh"]
