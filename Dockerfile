#1 use specific image
FROM node:22-alpine

# just hint (which port your application inside the container is expected to listen on)
# EXPOSE 4000

#2 working directory inside the container
WORKDIR /usr/app

#3 copy package.json + package-lock.json
COPY package*.json ./

#4 install all dependencies
RUN npm install

#5 copy all project's files into image
COPY . .

#6 build the project if you need

#7 set default command to run app
CMD ["npm", "run", "migrate:start:dev"]