pipeline {
  agent any

  environment {
    PATH = "/usr/bin:$PATH" // Ensures Jenkins uses system node
  }

  stages {
    stage('Install Deps') {
      steps {
        sh 'npm install'
        sh 'npx playwright install'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npx playwright test'
      }
    }
  }
}
