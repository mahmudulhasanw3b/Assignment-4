# Enhanced User Authentication and Authorization System

## Introduction

This project is a backend system for a Course Review application. It is built using TypeScript, Express.js, and Mongoose for MongoDB. The system allows users to create, retrieve, update, and delete courses, categories, and reviews, with robust error handling and validation.

## Technology Stack

- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **ODM and Validation Library:** Mongoose for MongoDB

## Setup and Installation

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/mahmudulhasanw3b/Assignment-4.git
    ```
2. Change directory to the project folder:
    ```bash
    cd Assignment-4
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root directory and add your environment variables:
    ```dotenv
    PORT=3000
    DATABASE_URL=mongodb://localhost:27017/course-review
    BCRYPT_SALT_ROUND=your_salt_round
    JWT_ACCESS_SECRET=your_jwt_secret
    JWT_ACCESS_EXPIRES_IN=your_expires_in
    ```
5. Start the application:
    ```bash
    npm run start
    ```

## API Endpoints

### 1. Create a Course

- **Endpoint:** `/api/courses`
- **Method:** POST
- **Request Body:**
    ```json
    {
        "title": "Sample Course",
        "instructor": "Jane Doe",
        "categoryId": "123456789012345678901234",
        "price": 49.99,
        "tags": [
            {
                "name": "Programming",
                "isDeleted": false
            },
            {
                "name": "Web Development",
                "isDeleted": false
            }
        ],
        "startDate": "2023-01-15",
        "endDate": "2023-03-14",
        "language": "English",
        "provider": "Tech Academy",
        "details": {
            "level": "Intermediate",
            "description": "Detailed description of the course"
        }
    }
    ```
- **Response:**
    ```json
    {
        "success": true,
        "statusCode": 201,
        "message": "Course created successfully",
        "data": {
            "_id": "23245dsfd453242348rFcg",
            "title": "Sample Course",
            ...
        }
    }
    ```

### 2. Get Paginated and Filtered Courses

- **Endpoint:** `/api/courses`
- **Method:** GET
- **Query Parameters:**
    - `page`, `limit`, `sortBy`, `sortOrder`, `minPrice`, `maxPrice`, `tags`, `startDate`, `endDate`, `language`, `provider`, `durationInWeeks`, `level`
- **Response:**
    ```json
    {
        "success": true,
        "statusCode": 200,
        "message": "Courses retrieved successfully",
        ...
    }
    ```

### 3. Create a Category

- **Endpoint:** `/api/categories`
- **Method:** POST
- **Request Body:**
    ```json
    {
        "name": "Programming"
    }
    ```
- **Response:**
    ```json
    {
        "success": true,
        "statusCode": 201,
        "message": "Category created successfully",
        ...
    }
    ```

### 4. Get All Categories

- **Endpoint:** `/api/categories`
- **Method:** GET
- **Response:**
    ```json
    {
        "success": true,
        "statusCode": 200,
        "message": "Categories retrieved successfully",
        ...
    }
    ```

### 5. Create a Review

- **Endpoint:** `/api/reviews`
- **Method:** POST
- **Request Body:**
    ```json
    {
        "courseId": "123456789012345678901234",
        "rating": 4,
        "review": "Great course!"
    }
    ```
- **Response:**
    ```json
    {
        "success": true,
        "statusCode": 201,
        "message": "Review created successfully",
        ...
    }
    ```

### 6. Update a Course

- **Endpoint:** `/api/courses/:courseId`
- **Method:** PUT
- **Request Body:**
    ```json
    {
        "price": 59.99,
        "tags": [
            {
                "name": "Programming",
                "isDeleted": false
            },
            ...
        ],
        "details": {
            "level": "Intermediate",
            "description": "Updated description"
        }
    }
    ```
- **Response:**
    ```json
    {
        "success": true,
        "statusCode": 200,
        "message": "Course updated successfully",
        ...
    }
    ```

### 7. Get Course by ID with Reviews

- **Endpoint:** `/api/courses/:courseId/reviews`
- **Method:** GET
- **Response:**
    ```json
    {
        "success": true,
        "statusCode": 200,
        "message": "Course and Reviews retrieved successfully",
        ...
    }
    ```

### 8. Get the Best Course Based on Average Review

- **Endpoint:** `/api/course/best`
- **Method:** GET
- **Response:**
    ```json
    {
        "success": true,
        "statusCode": 200,
        "message": "Best course retrieved successfully",
        ...
    }
    ```

## Error Handling

The application implements proper error handling throughout, using a global error handling middleware to catch and handle errors, providing appropriate error responses with status codes and error messages.

### Error Response Object

- **Sample Error Response for Cast Error:**
    ```json
    {
        "success": false,
        "message": "Invalid ID",
        ...
    }
    ```
- **Sample Error Response for Validation Error:**
    ```json
    {
        "success": false,
        "message": "Validation Error",
        ...
    }
    ```

## Validation with Zod

The application uses Zod to validate incoming data for course, category, and review creation and updating operations. This ensures that the data adheres to the defined structure in the models.

## Authentication and Authorization

The system includes robust user authentication and authorization mechanisms. Only authorized users (admins) can create or update courses and categories, while users can create reviews.

### User Registration

- **Endpoint:** `/api/auth/register`
- **Method:** POST

### User Login

- **Endpoint:** `/api/auth/login`
- **Method:** POST

### Change Password

- **Endpoint:** `/api/auth/change-password`
- **Method:** POST
