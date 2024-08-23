def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]
pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'jenkins-dockerhub' 
        DOCKER_HUB_REPO = 'mariamyam/myapp' 
        SONARQUBE_URL = 'http://localhost:9000'
    }
    tools {
	    nodejs "nodejs18.19"
    }

    stages{
        stage('Fetch code') {
          steps{
              git branch: 'main', url:'https://github.com/Mariamyammoun/myapp-pfa.git'
          }  
        }
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test'){
            steps {
                sh 'npm test'
            }

        }

        stage('Checkstyle Analysis'){
            steps {
                sh 'npm run lint'
            }
        }

        
        stage('SonarQube analysis') {
          steps {
            script {
                scannerHome = tool 'sonar-scanner'
            }
            withSonarQubeEnv('sonar') {
               sh "${scannerHome}/bin/sonar-scanner"
            }   
              
          }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_HUB_REPO}:$BUILD_NUMBER", "./Docker-files/app/multistage/")
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }
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
