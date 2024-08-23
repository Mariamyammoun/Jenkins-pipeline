pipeline {
    agent any
    environment {
        SONARQUBE_URL = 'http://localhost:9000'
        SONARQUBE_TOKEN = 'squ_9f58b2325f6cb0fc81a5678fa9436cfba0048fa8'
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

        stage('Sonar Analysis') {
            environment {
                scannerHome = tool 'sonar6.1'
            }
            steps {
               withSonarQubeEnv('sonar') {

                        sh 'sonar-scanner -Dsonar.projectKey=Myapp -Dsonar.projectName=Myapp -Dsonar.projectVersion=1.0 -Dsonar.sources=src -Dsonar.host.url=${SONARQUBE_URL} -Dsonar.login=${SONARQUBE_TOKEN}'
                    }
                }
            }
    }
}
