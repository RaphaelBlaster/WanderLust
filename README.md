# WanderLust

A full-stack accommodation listing platform built with **Node.js**, **Express**, **MongoDB**, and **EJS**. The application demonstrates secure authentication, image management, geolocation, and review workflows within a server-rendered MVC architecture.

## Overview

WanderLust is a marketplace-style web application where users can discover accommodations, publish their own listings, upload property images, and share reviews.

The project focuses on implementing production-oriented backend concepts such as authentication, authorization, validation, session management, cloud-based media storage, and database relationships while maintaining a clean and modular architecture.

## Features

* User registration and authentication
* Create, update, and delete accommodation listings
* Image uploads using Cloudinary
* Location geocoding with interactive maps
* Reviews and ratings
* Search across listings
* Ownership-based authorization
* Server-side validation using Joi
* Flash messages and custom error handling
* MVC project architecture

## Tech Stack

| Category       | Technologies                         |
| -------------- | ------------------------------------ |
| Backend        | Node.js, Express                     |
| Frontend       | EJS, Bootstrap                       |
| Database       | MongoDB Atlas, Mongoose              |
| Authentication | Passport.js, passport-local-mongoose |
| File Storage   | Cloudinary, Multer                   |
| Maps           | Leaflet, OpenStreetMap Nominatim     |
| Validation     | Joi                                  |
| Session Store  | connect-mongo                        |

## Project Structure

```text
.
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── utils/
├── middleware.js
├── schema.js
└── app.js
```

The application follows the **Model–View–Controller (MVC)** design pattern to separate business logic, routing, and presentation layers.

## Getting Started

### Clone the repository

```bash
git clone https://github.com/<your-username>/wanderlust.git
cd wanderlust
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root.

```env
ATLASDB_URL=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
SECRET=
```

### Seed the database

```bash
node init/index.js
```

### Start the application

```bash
node app.js
```

The application will be available at:

```text
http://localhost:8080
```

## Core Functionality

* Secure user authentication and session management
* CRUD operations for listings
* Cloud-hosted image uploads
* Automatic location geocoding
* Review and rating system
* Authorization based on resource ownership
* Request validation and centralized error handling

## Future Enhancements

* Booking and reservation workflow
* Wishlist functionality
* Pagination and advanced filtering
* User profiles
* Email verification
* Automated testing
* Docker support

## License

This project is available under the MIT License.
