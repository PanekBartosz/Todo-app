# TaskFlow - Modern Todo Application

TaskFlow is an intuitive task management application designed with simplicity and efficiency in mind. The app allows you to easily organize daily tasks with an elegant and modern user interface.

🚀 **Live Demo:** [https://todo-app-iota-indol.vercel.app/](https://todo-app-iota-indol.vercel.app/)

## Features

- ✨ Intuitive user interface
- 🔐 Google authentication
- ✅ Create, edit, and delete tasks
- 📅 Task deadline management
- 🌓 Responsive design
- ⚡ Real-time synchronization

## Tech Stack

- **Frontend:**

  - Next.js 15.2.0
  - React 19
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui

- **Backend & Database:**

  - Supabase (Auth, Database)
  - PostgreSQL

- **Hosting & Deployment:**
  - Vercel
  - GitHub

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/PanekBartosz/Todo-app.git
cd Todo-app
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Create `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Deployment

The application is automatically deployed to Vercel with each push to the `master` branch.

## License

MIT

## Author

Bartosz Panek
