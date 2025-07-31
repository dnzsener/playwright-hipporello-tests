#!/bin/bash

# AWS EC2 Instance Kurulum Scripti
# Bu script EC2 instance'ını kurar ve Jenkins'i yükler

echo "🚀 AWS EC2 Instance Kurulumu Başlıyor..."

# Sistem güncellemesi
echo "📦 Sistem güncelleniyor..."
sudo yum update -y

# Java kurulumu (Jenkins için gerekli)
echo "☕ Java kuruluyor..."
sudo yum install -y java-11-openjdk-devel

# Node.js kurulumu (Playwright için)
echo "📦 Node.js kuruluyor..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Git kurulumu
echo "📦 Git kuruluyor..."
sudo yum install -y git

# Jenkins repository ekleme
echo "🔧 Jenkins repository ekleniyor..."
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key

# Jenkins kurulumu
echo "🔧 Jenkins kuruluyor..."
sudo yum install -y jenkins

# Jenkins servisini başlatma
echo "🚀 Jenkins servisi başlatılıyor..."
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Firewall ayarları
echo "🔥 Firewall ayarları yapılıyor..."
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload

# Jenkins durumunu kontrol etme
echo "📊 Jenkins durumu kontrol ediliyor..."
sudo systemctl status jenkins

# Jenkins admin password'unu alma
echo "🔑 Jenkins admin password:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

echo "✅ AWS EC2 Instance kurulumu tamamlandı!"
echo "🌐 Jenkins URL: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080" 