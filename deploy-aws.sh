#!/bin/bash

# AWS Deployment Script
# Bu script AWS'de Jenkins ve test ortamını kurar

echo "🚀 AWS Deployment Başlıyor..."

# AWS CLI kurulumu kontrolü
if ! command -v aws &> /dev/null; then
    echo "📦 AWS CLI kuruluyor..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
fi

# EC2 instance oluşturma
echo "🖥️ EC2 instance oluşturuluyor..."

# Security Group oluşturma
aws ec2 create-security-group \
    --group-name jenkins-sg \
    --description "Jenkins Security Group"

# Security Group kuralları
aws ec2 authorize-security-group-ingress \
    --group-name jenkins-sg \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-name jenkins-sg \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-name jenkins-sg \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-name jenkins-sg \
    --protocol tcp \
    --port 8080 \
    --cidr 0.0.0.0/0

# Key Pair oluşturma
aws ec2 create-key-pair \
    --key-name jenkins-key \
    --query 'KeyMaterial' \
    --output text > jenkins-key.pem

chmod 400 jenkins-key.pem

# EC2 instance oluşturma
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --count 1 \
    --instance-type t3.medium \
    --key-name jenkins-key \
    --security-groups jenkins-sg \
    --user-data file://aws-setup.sh \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "🖥️ Instance ID: $INSTANCE_ID"

# Instance'ın hazır olmasını bekleme
echo "⏳ Instance hazırlanıyor..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

# Public IP alma
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo "🌐 Public IP: $PUBLIC_IP"

# SSH ile bağlanma ve Docker kurulumu
echo "🔧 Docker kuruluyor..."
ssh -i jenkins-key.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP << 'EOF'
    # Docker kurulumu
    sudo yum update -y
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -a -G docker ec2-user
    
    # Docker Compose kurulumu
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Test dosyalarını kopyalama
    mkdir -p /home/ec2-user/test-automation
    cd /home/ec2-user/test-automation
EOF

# Dosyaları kopyalama
echo "📁 Dosyalar kopyalanıyor..."
scp -i jenkins-key.pem -r . ec2-user@$PUBLIC_IP:/home/ec2-user/test-automation/

# Docker Compose ile servisleri başlatma
echo "🚀 Servisler başlatılıyor..."
ssh -i jenkins-key.pem ec2-user@$PUBLIC_IP << 'EOF'
    cd /home/ec2-user/test-automation
    sudo docker-compose up -d
    
    # Jenkins hazır olmasını bekleme
    echo "⏳ Jenkins başlatılıyor..."
    sleep 60
    
    # Jenkins admin password'unu alma
    echo "🔑 Jenkins Admin Password:"
    sudo docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
EOF

echo "✅ AWS Deployment tamamlandı!"
echo "🌐 Jenkins URL: http://$PUBLIC_IP:8080"
echo "📊 Test Reports: http://$PUBLIC_IP/playwright-report"
echo "🔑 Jenkins Admin Password yukarıda gösterildi" 