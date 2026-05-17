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
                bat 'node server.js'   // Levanta tu aplicación Node.js
                bat 'curl http://localhost:3001/api/menu'
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
