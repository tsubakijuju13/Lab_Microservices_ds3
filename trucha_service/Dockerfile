FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download 

COPY *.go ./

#RUN go build -o /trucha_service

EXPOSE 8088

# CMD [ "/trucha_service" ]

CMD [ "go", "run", "main.go" ]