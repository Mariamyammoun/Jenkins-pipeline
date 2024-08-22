pipeline {
    agent any
    tools {
	    maven "MAVEN3"
	    jdk "OracleJDK8"
	}

    stages{
        stage('Fetch code') {
          steps{
              git branch: 'main', url:'https://github.com/Mariamyammoun/myapp-pfa.git'
          }  
        }
    }
}
