pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker build -t aiwarssoc/web-app:latest .'
      }
    }

    stage('Push') {
      steps {
        sh 'docker push aiwarssoc/web-app:latest'
      }
    }

  }
}