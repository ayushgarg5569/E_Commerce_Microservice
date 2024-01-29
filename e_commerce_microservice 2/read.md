Node.js Microservices for E-commerce System

The system is divided into three core services: Product Service, Customer Service, and Orders Service. The goal is to design and implement these services to ensure seamless interaction within a microservices ecosystem.Also API Gateway has been implemented along with the services


- Customer login,registeration and authentication
- Products inventory management ( in case of successful and cancelled orders)
- Order management
- db.js file has been created in order to provide with schema (queries have not been written in model ,only method name has been used for the purpose of understanding)
 

Scaling of the Microservice could be done by 
-Load balancing in order to distribute traffic via nginx or aws
-Database Sharding Split databases based on order volume.

