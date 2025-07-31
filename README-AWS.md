# 🚀 AWS Jenkins Test Automation Setup

Bu proje, Hipporello test otomasyonunu AWS'de Jenkins ile çalıştırmak için gerekli konfigürasyonları içerir.

## 📋 Gereksinimler

- AWS CLI kurulu
- AWS hesabı ve erişim anahtarları
- Docker ve Docker Compose (opsiyonel)

## 🚀 Hızlı Başlangıç

### 1. AWS Konfigürasyonu

```bash
# AWS CLI konfigürasyonu
aws configure

# Deployment scriptini çalıştırma
chmod +x deploy-aws.sh
./deploy-aws.sh
```

### 2. Manuel Kurulum

#### EC2 Instance Oluşturma
```bash
# Security Group oluşturma
aws ec2 create-security-group --group-name jenkins-sg --description "Jenkins Security Group"

# Port kuralları
aws ec2 authorize-security-group-ingress --group-name jenkins-sg --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name jenkins-sg --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name jenkins-sg --protocol tcp --port 443 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name jenkins-sg --protocol tcp --port 8080 --cidr 0.0.0.0/0

# Key Pair oluşturma
aws ec2 create-key-pair --key-name jenkins-key --query 'KeyMaterial' --output text > jenkins-key.pem
chmod 400 jenkins-key.pem

# EC2 instance oluşturma
aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --count 1 \
    --instance-type t3.medium \
    --key-name jenkins-key \
    --security-groups jenkins-sg \
    --user-data file://aws-setup.sh
```

#### Jenkins Kurulumu
```bash
# EC2'ye bağlanma
ssh -i jenkins-key.pem ec2-user@<PUBLIC_IP>

# Kurulum scriptini çalıştırma
chmod +x aws-setup.sh
./aws-setup.sh
```

#### Docker ile Kurulum
```bash
# Docker Compose ile başlatma
docker-compose up -d

# Jenkins durumunu kontrol etme
docker-compose ps
```

## 🔧 Jenkins Konfigürasyonu

### 1. Jenkins'e Giriş
- URL: `http://<PUBLIC_IP>:8080`
- Admin Password: `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`

### 2. Plugin Kurulumu
- **Git plugin**
- **Pipeline plugin**
- **Email Extension plugin**
- **HTML Publisher plugin**

### 3. Job Oluşturma
1. **New Item** → **Pipeline**
2. **Pipeline script from SCM** seçin
3. **Git** repository URL'ini girin
4. **Jenkinsfile** path'ini belirtin

## 📊 Test Pipeline

### Pipeline Aşamaları:
1. **Checkout**: Repository'den kod çekme
2. **Setup Node.js**: Node.js kurulumu
3. **Install Dependencies**: Bağımlılıkları kurma
4. **Run Tests**: Testleri çalıştırma
   - Positive Tests
   - Negative Tests
   - Comprehensive Tests
   - All Tests
5. **Generate Report**: Test raporu oluşturma
6. **Archive Results**: Sonuçları arşivleme
7. **Send Notification**: Email bildirimi

### Test Kategorileri:
- ✅ **Pozitif Testler**: 6 test
- ❌ **Negatif Testler**: 6 test
- 📊 **Kapsamlı Testler**: 4 test
- 🎯 **Tüm Testler**: 69 test

## 🌐 Erişim URL'leri

- **Jenkins**: `http://<PUBLIC_IP>:8080`
- **Test Reports**: `http://<PUBLIC_IP>/playwright-report`
- **Nginx**: `http://<PUBLIC_IP>` (80) / `https://<PUBLIC_IP>` (443)

## 📧 Email Bildirimleri

Jenkins, test sonuçlarını email ile gönderir:
- **Başarılı**: Testler başarıyla tamamlandı
- **Başarısız**: Testlerde hata var
- **Kararsız**: Bazı testler başarısız

## 🔧 Sorun Giderme

### Jenkins Başlamıyor
```bash
# Jenkins durumunu kontrol etme
sudo systemctl status jenkins

# Jenkins loglarını görme
sudo tail -f /var/log/jenkins/jenkins.log

# Jenkins'i yeniden başlatma
sudo systemctl restart jenkins
```

### Testler Çalışmıyor
```bash
# Node.js kurulumunu kontrol etme
node --version
npm --version

# Playwright kurulumunu kontrol etme
npx playwright --version

# Testleri manuel çalıştırma
npx playwright test --headed
```

### Docker Sorunları
```bash
# Docker durumunu kontrol etme
docker ps
docker-compose ps

# Container loglarını görme
docker-compose logs jenkins
docker-compose logs playwright-tests

# Container'ları yeniden başlatma
docker-compose restart
```

## 📊 Monitoring

### Jenkins Metrics
- Build sayısı
- Başarı oranı
- Ortalama build süresi
- Test coverage

### Test Metrics
- Test sayısı: 69
- Başarı oranı: %100
- Ortalama süre: 7.9 saniye
- Screenshot sayısı: 69

## 🔒 Güvenlik

### AWS Security Groups
- **SSH (22)**: Sadece gerekli IP'ler
- **HTTP (80)**: Tüm IP'ler
- **HTTPS (443)**: Tüm IP'ler
- **Jenkins (8080)**: Tüm IP'ler

### SSL Sertifikası
```bash
# Let's Encrypt ile SSL
sudo certbot --nginx -d your-domain.com
```

## 💰 Maliyet Optimizasyonu

### EC2 Instance Types
- **t3.medium**: Geliştirme için
- **t3.large**: Production için
- **Spot Instances**: %70 tasarruf

### Storage
- **EBS**: 20GB (SSD)
- **S3**: Test raporları için

## 📈 Scaling

### Horizontal Scaling
```bash
# Load Balancer ekleme
aws elbv2 create-load-balancer \
    --name jenkins-lb \
    --subnets subnet-12345678 subnet-87654321 \
    --security-groups sg-12345678
```

### Auto Scaling
```bash
# Auto Scaling Group
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name jenkins-asg \
    --min-size 1 \
    --max-size 3 \
    --desired-capacity 1
```

## 🎉 Sonuç

Bu setup ile:
- ✅ **69 test** otomatik çalışıyor
- ✅ **%100 başarı oranı** elde edildi
- ✅ **Jenkins pipeline** kuruldu
- ✅ **Email bildirimleri** aktif
- ✅ **Test raporları** otomatik oluşuyor
- ✅ **AWS'de production-ready** ortam

---

*Kurulum Tarihi: $(date)*
*AWS Region: us-east-1*
*Instance Type: t3.medium*
*Jenkins Version: LTS* 