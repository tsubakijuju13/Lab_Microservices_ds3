# Usar una imagen de Maven para construir el proyecto
FROM maven:3.8.1-jdk-11 as build

# Establecer el directorio de trabajo
WORKDIR /build

# Copiar el archivo pom.xml y los archivos de código fuente al contenedor
COPY pom.xml .
COPY src/ src/

# Construir el proyecto y crear el JAR
RUN mvn clean package

# Usar openjdk para ejecutar la aplicación
FROM openjdk:11-jre-slim

# Copiar el JAR construido desde la imagen de construcción
COPY --from=build /build/target/besoscerezas-0.0.1-SNAPSHOT.jar /app.jar

# Establecer el comando para ejecutar la aplicación
CMD ["java", "-jar", "/app.jar"]