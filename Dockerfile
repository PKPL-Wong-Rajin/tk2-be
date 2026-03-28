# Pull the AWS Lambda Web Adapter
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 AS aws-lambda-adapter

# Use the official Bun Alpine image
FROM oven/bun:alpine

# Copy the adapter into Bun container
COPY --from=aws-lambda-adapter /lambda-adapter /opt/extensions/lambda-adapter

# Set the working directory inside the container
WORKDIR /var/task

# Copy package files first to leverage Docker layer caching
COPY package.json bun.lockb ./

# Install dependencies (production only)
RUN bun install --production --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Set the port for the Lambda Web Adapter
ENV PORT=8080
EXPOSE 8080

CMD ["bun", "run", "dev"]