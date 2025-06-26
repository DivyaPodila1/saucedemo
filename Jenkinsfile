pipeline {
  agent any

  tools {
    nodejs "NodeJS 24.3.0" // Name must match the NodeJS tool you configured in Jenkins
  }

  stages {
    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        sh 'npx playwright test'
      }
    }
  }
}
