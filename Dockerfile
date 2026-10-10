# ==========================================
# Multi-Stage Dockerfile for SmartAmbulance Backend
# Optimized for Render.com deployment
# ==========================================

# 1. Build Stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:resolve -B

# Copy source code and build production jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# 2. Runtime Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create unprivileged application user
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy built artifact
COPY --from=build /app/target/SmartAmbulanceBackend-0.0.1-SNAPSHOT.jar app.jar

# Render injects $PORT dynamically; default is 8080
ENV PORT=8080
EXPOSE 8080

# Run JVM with container memory awareness
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
