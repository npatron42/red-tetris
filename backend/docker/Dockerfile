# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: npatron <npatron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/12/16 21:47:56 by npatron           #+#    #+#              #
#    Updated: 2024/12/16 21:51:58 by npatron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #


FROM node:18-bullseye

WORKDIR /app

COPY ../package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
