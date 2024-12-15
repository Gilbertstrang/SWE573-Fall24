# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Spring Boot JAR file
COPY target/whatsthis-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the Spring Boot app listens on
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "app.jar"]
