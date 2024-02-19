# Node.js TypeScript Mongoose Application(Course Review System)

This is a sample Node.js application written in TypeScript and using Mongoose for MongoDB integration.With user authentication

## Requirements

Before you run locally, ensure that you must have the following requirements:

- Node.js installed
- npm package manager installed
- MongoDB installed and running locally
- typescript installed

## Getting Started

1. **First clone the repository:**

   ```bash
   git clone https://github.com/Porgramming-Hero-web-course/l2b2a4-course-review-with-auth-roy-Pritom
   cd change the directory
2. **Install Dependencies:**

   ```bash
   npm install
3. **Configuration(.env):**

   ```bash
   Create a .env file in the root of your project
   DATABASE_URL=Mongodb Uri(username,password)
   PORT=server_port
   Access_secret=your jwt access secret
   BCRYPT_SALT_ROUNDS
   PORT
4. **Build the typescript code:**

   ```bash
   npm run build
5. **Run Application(production):**

   ```bash
   npm run start:prod
5. **Run Application(development):**

   ```bash
   npm run start:dev
6. **See code problems(eslint):**

   ```bash
   npm run lint
8. **Api end point:**

   ```bash
   Create a Course
   Endpoint: /api/courses
   put appropriate json data

   Get Paginated and Filtered Courses.
   Endpoint: /api/courses

   Create a Category
   Endpoint: /api/categories

   Get All Categories
   Endpoint: /api/categories

   Create a Review
   Endpoint: /api/reviews

   Update a Course (Partial Update with Dynamic Update)
   Endpoint: /api/courses/:courseId

   Get Course by ID with Reviews
   Endpoint: /api/courses/:courseId/reviews
   
   Get the Best Course Based on Average Review (Rating)
   Endpoint: /api/course/best
   
9. **Live link (vercel):**

   Live link: https://assignment-4-opal.vercel.app

   documentation link: https://documenter.getpostman.com/view/29216767/2s9YkuYJEh
   
   


  