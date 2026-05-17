pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Mauricio-Santamaria/git4.git'
            }
        }

        stage('Instalar dependencias') {
            steps {
                bat 'npm install'
            }
        }

        stage('Pruebas') {
            steps {
                // Aquí puedes integrar Postman/Newman o Jest
                bat 'echo "Ejecutando pruebas..."'
            }
        }

        stage('Análisis de seguridad') {
            steps {
                bat 'npm audit --production || true'
                bat 'eslint . || true'
            }
        }

        stage('Empaquetar con Docker') {
            steps {
                bat 'docker build -t restaurante-api .'
            }
        }

        stage('Despliegue Local') {
            steps {
                bat 'docker run -d -p 3001:3001 restaurante-api'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completado exitosamente.'
        }
        failure {
            echo '❌ Error en el pipeline. Revisar logs.'
        }
    }
}
