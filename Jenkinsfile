def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]
pipeline {
    agent any
    environment {
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
