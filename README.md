# Dental Laboratory Management System (DLMS)

A modern, production-ready dental laboratory management system built with React, TypeScript, and modern web technologies.

## Features

- **Role-based access control** with 7 user roles
- **Complete patient, dentist, and clinic management**
- **Dashboard** with role-filtered widgets
- **Responsive design** optimized for tablet and desktop
- **Dark mode** support
- **Type-safe** with TypeScript strict mode
- **Modern UI** with shadcn/ui components

## User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full system access |
| Manager | Business operations |
| Receptionist | Visit and case management |
| Technician | Production board access |
| QC | Quality control inspections |
| Accountant | Financial operations |
| Storekeeper | Inventory management |

## Tech Stack

- **Frontend**: React 18, TypeScript 5, Vite 5
- **Routing**: React Router v6
- **State Management**: Zustand + TanStack Query
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library
- **Build**: Vite + TypeScript

## Project Structure

```
src/
├── app/                  # App shell and routing
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, TopBar)
│   └── ui/             # Base UI components (Button, Card, etc.)
├── features/           # Feature modules
│   ├── auth/          # Authentication system
│   ├── dashboard/     # Dashboard with role-based widgets
│   ├── patients/      # Patient management
│   ├── dentists/      # Dentist management
│   └── clinics/       # Clinic management
├── lib/               # Utilities and API configuration
├── types/             # TypeScript type definitions
└── styles/            # Global styles and Tailwind config
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Development

### Authentication
The system uses JWT-based authentication with mock data for demonstration. Default credentials:
- **Username**: receptionist
- **Password**: password

### API Integration
The frontend is configured to connect to a REST API at `/api/v1`. Update `VITE_API_BASE_URL` in `.env` to point to your backend.

### Building Modules
The system follows a phased implementation approach. Currently completed modules:
1. ✅ Project setup and core architecture
2. ✅ Authentication and routing
3. ✅ Dashboard and layout
4. ✅ Patients, Dentists, Clinics management

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## License

MIT