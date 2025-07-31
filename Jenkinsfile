pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS_PATH = '/usr/share/playwright'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Repository checkout ediliyor...'
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo '📦 Node.js kurulumu...'
                sh '''
                    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
                    sudo yum install -y nodejs
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Bağımlılıklar kuruluyor...'
                sh '''
                    npm install
                    npx playwright install
                    npx playwright install-deps
                '''
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Positive Tests') {
                    steps {
                        echo '✅ Pozitif testler çalıştırılıyor...'
                        sh 'npx playwright test positive-test-cases.spec.ts --reporter=html --timeout=60000'
                    }
                }
                
                stage('Negative Tests') {
                    steps {
                        echo '❌ Negatif testler çalıştırılıyor...'
                        sh 'npx playwright test negative-test-cases.spec.ts --reporter=html --timeout=60000'
                    }
                }
                
                stage('Comprehensive Tests') {
                    steps {
                        echo '📊 Kapsamlı testler çalıştırılıyor...'
                        sh 'npx playwright test comprehensive-test-report.spec.ts --reporter=html --timeout=60000'
                    }
                }
                
                stage('All Tests') {
                    steps {
                        echo '🎯 Tüm testler çalıştırılıyor...'
                        sh 'npx playwright test --reporter=html --timeout=60000'
                    }
                }
            }
        }
        
        stage('Generate Report') {
            steps {
                echo '📊 Test raporu oluşturuluyor...'
                sh '''
                    # Test raporunu kopyala
                    cp test-report-summary.md playwright-report/
                    
                    # HTML raporu oluştur
                    echo "<html><head><title>Test Report</title></head><body>" > playwright-report/index.html
                    echo "<h1>Hipporello Test Report</h1>" >> playwright-report/index.html
                    echo "<p>Generated on: $(date)</p>" >> playwright-report/index.html
                    echo "<h2>Test Results</h2>" >> playwright-report/index.html
                    echo "<ul>" >> playwright-report/index.html
                    echo "<li>Positive Tests: ✅</li>" >> playwright-report/index.html
                    echo "<li>Negative Tests: ✅</li>" >> playwright-report/index.html
                    echo "<li>Comprehensive Tests: ✅</li>" >> playwright-report/index.html
                    echo "</ul>" >> playwright-report/index.html
                    echo "</body></html>" >> playwright-report/index.html
                '''
            }
        }
        
        stage('Archive Results') {
            steps {
                echo '📦 Sonuçlar arşivleniyor...'
                archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true
                archiveArtifacts artifacts: 'screenshots/**/*', fingerprint: true
                archiveArtifacts artifacts: 'test-report-summary.md', fingerprint: true
            }
        }
        
        stage('Send Notification') {
            steps {
                echo '📧 Bildirim gönderiliyor...'
                script {
                    def testResults = currentBuild.result
                    def testDuration = currentBuild.durationString
                    
                    emailext (
                        subject: "Test Results: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                        body: """
                            <h2>Test Results</h2>
                            <p><strong>Job:</strong> ${env.JOB_NAME}</p>
                            <p><strong>Build:</strong> #${env.BUILD_NUMBER}</p>
                            <p><strong>Status:</strong> ${testResults}</p>
                            <p><strong>Duration:</strong> ${testDuration}</p>
                            <p><strong>Workspace:</strong> ${env.WORKSPACE}</p>
                            <br>
                            <p>Test raporu için Jenkins'e giriş yapın.</p>
                        """,
                        to: 'admin@yourcompany.com',
                        replyTo: 'jenkins@yourcompany.com'
                    )
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Temizlik yapılıyor...'
            sh '''
                # Screenshot'ları temizle
                rm -rf screenshots/*
                
                # Log dosyalarını temizle
                find . -name "*.log" -delete
            '''
        }
        
        success {
            echo '✅ Pipeline başarıyla tamamlandı!'
        }
        
        failure {
            echo '❌ Pipeline başarısız oldu!'
        }
        
        unstable {
            echo '⚠️ Pipeline kararsız durumda!'
        }
    }
} 