# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum* ./
RUN go mod download

# Copy source code
COPY main.go .
COPY go.mod .

# Build the application
RUN go build -o /app/backend ./main.go

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app

COPY --from=builder /app/backend .

# Cloud Run expects the server to listen on the port specified by PORT env var
ENV PORT=8080

EXPOSE 8080

CMD ["./backend"]
