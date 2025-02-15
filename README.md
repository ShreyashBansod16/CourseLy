# CourseLy

CourseLy is a web platform designed to provide users with access to a variety of courses and resources. 
Users can upload their own content, view others content and connect with content owners for any queries.

Web-Link: [CourseLy](https://course-ly.vercel.app/)

## Features

- **Browse Courses and Resources**: Explore a wide range of educational materials.
- **Upload Content**: Share your own courses and resources with the community.
- **Contact Owners**: Reach out to content creators for questions or collaborations.

## Technology Stack

- **Framework**: Next.js with TypeScript
- **Backend**: Supabase
- **Authentication**: NextAuth
- **Email Service**: Resend
- **UI Components**: shadcn

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Abusha-Ansari/CourseLy.git
   cd CourseLy
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory and add the following variables:

   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   RESEND_API_KEY=your_env_variable
   NEXT_PUBLIC_SUPABASE_URL=your_env_variable
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_env_variable
   NEXTAUTH_SECRET=your_env_variable
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_env_variable
   GOOGLE_CLIENT_ID=your_env_variable
   GOOGLE_CLIENT_SECRET=your_env_variable
   NEXT_PUBLIC_CLOUDINARY_URL=your_env_variable
   ```

   Replace `your_*` placeholders with your actual Supabase, NextAuth, and Resend credentials.

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

   The application should now be running on `http://localhost:3000`.

## Usage

- **Viewing Content**: Navigate through the platform to browse available courses and resources.
- **Uploading Content**: Sign in to upload your own materials.
- **Contacting Owners**: Use the provided contact options to reach out to content owners.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License.

---

For more information or assistance, please refer to the project's repository or contact the maintainers.
