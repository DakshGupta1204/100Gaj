# Builders API Documentation

This document outlines the structure and usage of the Builders API for the 100Gaj application.

## Model Structure

The Builder model contains the following fields:

- `title`: Name of the builder company
- `image`: URL to the builder's cover image
- `logo`: URL to the builder's logo
- `projects`: Total number of projects
- `description`: Short description of the builder
- `established`: Year the builder was established
- `headquarters`: City where the builder's headquarters is located
- `specialization`: Builder's specialization areas
- `rating`: Overall rating (0-5)
- `completed`: Number of completed projects
- `ongoing`: Number of ongoing projects
- `about`: Detailed description
- `projects_list`: Array of projects with:
  - `name`: Project name
  - `location`: Project location
  - `status`: "Completed" or "Ongoing"
  - `type`: Project type (e.g., "Luxury", "Affordable")
- `reviews`: Array of customer reviews with:
  - `user`: Reviewer's name
  - `rating`: Review rating (0-5)
  - `date`: Review date
  - `text`: Review content
- `contact`: Object containing contact information:
  - `email`: Contact email
  - `phone`: Contact phone
  - `website`: Website URL
  - `address`: Physical address

## API Endpoints

### Get All Builders

```
GET /api/builders
```

Returns a list of all builders with basic information.

Query parameters:
- `search`: Optional search term to filter builders by title, description, or specialization

Example response:
```json
{
  "builders": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "DLF Limited",
      "image": "/image3.webp",
      "logo": "/dwarka.jpeg",
      "projects": 48,
      "description": "Leading real estate developer...",
      "established": "1946",
      "headquarters": "New Delhi",
      "specialization": "Luxury Residential, Commercial, Townships",
      "rating": 4.5,
      "completed": 42,
      "ongoing": 6
    },
    // More builders...
  ]
}
```

### Get Builder by ID

```
GET /api/builders/{id}
```

Returns detailed information about a specific builder.

Example response:
```json
{
  "builder": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "DLF Limited",
    "image": "/image3.webp",
    "logo": "/dwarka.jpeg",
    "projects": 48,
    "description": "Leading real estate developer...",
    "established": "1946",
    "headquarters": "New Delhi",
    "specialization": "Luxury Residential, Commercial, Townships",
    "rating": 4.5,
    "completed": 42,
    "ongoing": 6,
    "about": "DLF Limited is India's largest publicly listed real estate company...",
    "projects_list": [
      {
        "name": "DLF Camellias",
        "location": "Gurgaon",
        "status": "Completed",
        "type": "Ultra Luxury"
      },
      // More projects...
    ],
    "reviews": [
      {
        "user": "Rahul Singh",
        "rating": 4.8,
        "date": "2023-05-10",
        "text": "Extremely satisfied with the quality..."
      },
      // More reviews...
    ],
    "contact": {
      "email": "info@dlf.com",
      "phone": "+91-11-42102030",
      "website": "www.dlf.com",
      "address": "DLF Tower, New Delhi"
    }
  }
}
```

### Add Review to Builder

```
POST /api/builders/{id}
```

Adds a new review to a builder and recalculates the average rating.

Request body:
```json
{
  "user": "John Doe",
  "rating": 4.5,
  "text": "Great builder with excellent quality."
}
```

Example response:
```json
{
  "message": "Review added successfully",
  "builder": {
    // Updated builder with the new review
  }
}
```

## Seeding the Database

To populate the database with sample builder data, run the following command:

```
node scripts/seed-builders.js
```

This script will:
1. Connect to your MongoDB database using the URI specified in `.env.local`
2. Clear any existing builder data
3. Insert sample builder data
4. Display a success message when complete

## Frontend Integration

The builders data is integrated into two main pages:

1. **Builders List Page** (`/builders`): Displays all builders with search functionality and favorites support
2. **Builder Detail Page** (`/builders/[id]`): Displays detailed information about a selected builder, including projects, reviews, and contact information

Both pages include functionality for adding/removing builders from favorites and submitting reviews. 