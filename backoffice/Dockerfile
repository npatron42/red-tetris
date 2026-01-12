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

FROM directus/directus:11.10.2

USER root

RUN apk add --no-cache postgresql-client wget

COPY --chown=node:node ./data /directus/data
COPY --chown=node:node ./start.sh /directus/start.sh

RUN chmod +x /directus/start.sh

USER node

CMD ["/directus/start.sh"]
