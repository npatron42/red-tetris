# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: npatron <npatron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/24 14:30:21 by npatron           #+#    #+#              #
#    Updated: 2025/09/12 15:50:54 by npatron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
# ENTRYPOINT npm run build && npm run preview -- --port 5173