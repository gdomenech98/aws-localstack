FROM node:20-bullseye-slim

# Set build-time arguments
ARG NEXT_PUBLIC_SERVER_URL
# Set environment variables for the build stage
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

WORKDIR /app
COPY ./frontend .

RUN yarn
RUN yarn web:prod

ENTRYPOINT yarn web:prod:serve