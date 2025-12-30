# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: npatron <npatron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/12/30 13:21:41 by npatron           #+#    #+#              #
#    Updated: 2025/12/30 13:22:03 by npatron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:20.18.0-alpine3.20 as builder

WORKDIR /extensions/red-tetris
COPY ./extensions/red-tetris ./
RUN npm install
RUN npm run build

WORKDIR /
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install


FROM directus/directus:11.10.2


COPY --chown=node:node ./data /directus/data
COPY --from=builder --chown=node:node /node_modules/directus-extension-group-tabs-interface /directus/node_modules/directus-extension-group-tabs-interface
COPY --from=builder --chown=node:node /extensions/red-tetris/dist /directus/extensions/red-tetris/dist
COPY --from=builder --chown=node:node /extensions/red-tetris/package.json /directus/extensions/red-tetris/package.json

