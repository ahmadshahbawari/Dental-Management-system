import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Construction className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              This module is currently under development as part of our phased implementation plan.
              The Dental Laboratory Management System is being built incrementally to ensure quality
              and proper integration.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">What's Coming:</h3>
              <ul className="list-disc pl-5 space-y-1 text-blue-700">
                <li>Complete CRUD operations with validation</li>
                <li>Real-time data synchronization</li>
                <li>Advanced search and filtering</li>
                <li>Role-based access control</li>
                <li>Export and reporting capabilities</li>
                <li>Integration with other system modules</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button disabled>Coming Soon</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
