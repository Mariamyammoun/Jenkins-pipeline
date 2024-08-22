pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'jenkins-dockerhub'
        CF_CREDENTIALS_ID = 'jenkins-cf'
        SONARQUBE_URL = 'http://localhost:9000'
        SONARQUBE_TOKEN = 'squ_9f58b2325f6cb0fc81a5678fa9436cfba0048fa8'
        DOCKER_REPO = 'mariamyam/images'
        CF_APP_NAME = 'Myapp'
        CF_APP_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Mariamyammoun/myapp-pfa.git'
            }
        }

        stage('Build and Test') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        sh "sonar-scanner -Dsonar.projectKey=Myapp -Dsonar.projectName=Myapp -Dsonar.projectVersion=1.0 -Dsonar.sources=src -Dsonar.host.url=${SONARQUBE_URL} -Dsonar.login=${SONARQUBE_TOKEN}"
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("myapp-image")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        docker.image('myapp-image').push('latest')
                    }
                }
            }
        }

        stage('Deploy to Cloud Foundry') {
            steps {
                script {
                    sh 'cf login -a https://api.cf.us10-001.hana.ondemand.com -u mariamyammoun@gmail.com -p Mariam1234$'
                    sh "cf push ${CF_APP_NAME} -o ${DOCKER_REPO}/myapp-image:latest -p . -b docker"
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
