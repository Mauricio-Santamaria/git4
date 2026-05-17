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

        stage('Levantar servidor') {
            steps {
                // Ejecuta tu API en segundo plano
                bat 'start /B node server.js'
                // Espera unos segundos para que arranque
                bat 'ping -n 5 127.0.0.1 > nul'
            }
        }

        stage('Pruebas Postman reales') ) {
            steps {
                // Aquí puedes integrar Postman/Newman o Jest
                bat 'echo "Ejecutando pruebas..."'
            }
        }


        stage('Análisis de seguridad') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    bat 'npm audit --production'
                }
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    bat 'npm run lint'
                }
            }
        }

        stage('Validación de despliegue') {
            steps {
                // Verifica que el endpoint responda
                powershell 'Invoke-WebRequest http://localhost:3001/api/menu'
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
