def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]
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

    tools {
        maven "MAVEN3"
        jdk "OracleJDK17"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Mariamyammoun/myapp-pfa.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean install -DskipTests'
            }
        }

        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Checkstyle Analysis') {
            steps {
                sh 'mvn checkstyle:checkstyle'
            }
        }

        stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'sonar6.1'
            }
            steps {
                    withSonarQubeEnv('sonar') {
                        sh """
                        sonar-scanner \
                            -Dsonar.projectKey=Myapp \
                            -Dsonar.projectName=Myapp \
                            -Dsonar.projectVersion=1.0 \
                            -Dsonar.sources=src \
                            -Dsonar.host.url=${SONARQUBE_URL} \
                            -Dsonar.login=${SONARQUBE_TOKEN}
                        """
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
                    sh "cf push ${CF_APP_NAME} --docker-image ${DOCKER_REPO}/myapp-image:latest"
                }
            }
        }
    }

    post {
       always {
            echo 'Slack Notifications.'
            slackSend channel: '#jenkinscicd',
                color: COLOR_MAP[currentBuild.currentResult],
                message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n More info at: ${env.BUILD_URL}"
        }
    }
}

