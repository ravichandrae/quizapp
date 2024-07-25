# Use an official OpenJDK runtime as a parent image
FROM openjdk:19-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy the Gradle wrapper and project files
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
COPY src ./src

# Ensure the gradlew script has Unix line endings and set executable permissions
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew

# Add a volume to store logs
VOLUME /tmp

# Build the application
RUN ./gradlew build

# Run the jar file
CMD ["java", "-jar", "build/libs/quiz-0.0.1-SNAPSHOT.jar"]

# Expose the port the app runs on
EXPOSE 8080
