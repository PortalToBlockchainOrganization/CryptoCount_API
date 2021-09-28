# API
FROM node:16-buster-slim
ENV NODE_ENV=production
# Copy code from backend codebase into /backend
RUN mkdir /backend
COPY . /backend
RUN cd /backend npm install

EXPOSE 80

#CMD ["ls", "/backend"]

CMD ["node", "/backend/main.js", "-p", "80"]
