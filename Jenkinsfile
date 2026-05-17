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


        stage('Despliegue Local') {
            steps {
                bat 'http://localhost:3001/'
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
