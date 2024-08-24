def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]
pipeline {
    agent any
    environment {
        CF_CREDENTIALS_ID = 'jenkins-cf'
        CF_API = 'https://api.cf.us10-001.hana.ondemand.com'
        CF_ORG = '493b7923trial_493b7923trial'
        CF_SPACE = 'my-new-espace'
        APP_NAME = 'Myapp'
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
                    dockerImage = docker.build("${DOCKER_HUB_REPO}:latest")
                }
            }
        }

        

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS}") {
                        dockerImage.push('latest')
                    }
                }
            }
        }

        

        stage('Deploy to Cloud Foundry') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${CF_CREDENTIALS_ID}", usernameVariable: 'CF_USERNAME', passwordVariable: 'CF_PASSWORD')]) {
                        sh """
                            
                            export CF_DOCKER_PASSWORD=${CF_PASSWORD}
                            cf api ${CF_API}
                            cf auth ${CF_USERNAME} ${CF_PASSWORD}
                            cf target -o ${CF_ORG} -s ${CF_SPACE}
                            cf push ${APP_NAME} --docker-image ${DOCKER_HUB_REPO}:latest --docker-username ${CF_USERNAME}
                        """
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
