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
}
