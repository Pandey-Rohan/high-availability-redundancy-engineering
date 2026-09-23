# High Availability & Redundancy Engineering Lab

A distributed systems project demonstrating **High Availability (HA)**, **Redundancy Engineering**, and **Load Balancing** using **Docker**, **NGINX**, and **Node.js**.

This project simulates a fault-tolerant web application capable of continuing service even when one of the backend servers fails.

---

# Features

- Dockerized microservice architecture
- NGINX Load Balancer
- Round Robin Load Balancing
- Multiple Node.js backend servers
- Health Check Endpoints
- Failover Simulation
- Real-time Monitoring Dashboard
- Fault Tolerance Demonstration
- High Availability Architecture
- REST APIs
- Docker Compose Deployment

---

# Technologies Used

- Node.js
- Express.js
- Docker
- Docker Compose
- NGINX
- HTML
- CSS
- JavaScript

---

# Project Architecture

```
                    Client
                      |
                      |
          +----------------------+
          |     NGINX            |
          |  Load Balancer       |
          +----------------------+
             |              |
             |              |
      +-------------+ +-------------+
      |  Server 1   | |  Server 2   |
      | Node.js API | | Node.js API |
      +-------------+ +-------------+
             |              |
             +--------------+
                    |
              Monitoring APIs
                    |
             Dashboard (HTML)
```

---

# Folder Structure

```
high-availability-demo/

│
├── server1/
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
│
├── server2/
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
│
├── nginx/
│   └── nginx.conf
│
├── dashboard/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── docker-compose.yml
│
└── README.md
```

---

# System Workflow

1. Client sends a request.
2. NGINX receives the request.
3. NGINX distributes requests using Round Robin.
4. One of the backend servers processes the request.
5. Health endpoints monitor server availability.
6. Dashboard displays server status and metrics.
7. If one server fails, traffic is automatically routed to the remaining server.

---

# Installation



cd high-availability-demo
```

---

## Build Containers

```bash
docker compose build
```

---

## Start Containers

```bash
docker compose up
```

---

## Run in Background

```bash
docker compose up -d
```

---

# Access the Application

Main Application

```
http://localhost:8080
```

Dashboard

```
http://localhost:8080/dashboard
```

Server 1

```
http://localhost:3001
```

Server 2

```
http://localhost:3002
```

---

# Health Check Endpoints

Server 1

```
http://localhost:3001/health
```

Server 2

```
http://localhost:3002/health
```

---

# Demonstrating High Availability

## Normal Operation

Both backend servers are running.

NGINX distributes incoming requests equally.

---

## Simulate Server Failure

Stop Server 2

```bash
docker stop server2
```

Refresh the application.

All requests are now handled by Server 1.

---

Restart Server 2

```bash
docker start server2
```

Traffic is automatically balanced again.

---

# Load Balancing Algorithm

Current Algorithm

- Round Robin

Supported Algorithms

- Round Robin
- Least Connections
- IP Hash
- Consistent Hashing (future enhancement)

---

# High Availability Concepts Demonstrated

- Load Balancing
- Redundancy
- Fault Tolerance
- Failover
- Health Monitoring
- Containerization
- Distributed Architecture
- Service Resilience

---

# Possible Failure Scenarios

- Backend Server Failure
- Container Crash
- Service Restart
- Network Interruption
- Load Balancer Recovery

---

# Learning Outcomes

This project demonstrates:

- High Availability Architecture
- Docker Networking
- Reverse Proxy Configuration
- Distributed Systems
- Fault Tolerant Design
- Load Balancing Strategies
- Health Monitoring
- Redundancy Engineering

---

# Future Improvements

- Active-Active Clustering
- Active-Passive Failover
- Database Replication
- Redis Session Sharing
- Prometheus Monitoring
- Grafana Dashboard
- Kubernetes Deployment
- Auto Scaling
- HTTPS with SSL
- CI/CD Pipeline
- Cloud Deployment (AWS/Azure/GCP)

---

# Author

**Rohan**

M.Sc. Cybersecurity Student

---

# License

This project is created for educational and academic purposes.