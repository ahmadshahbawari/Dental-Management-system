import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User, Briefcase, Activity, FileText, Clock, CheckCircle, AlertCircle, Printer } from 'lucide-react';
import { Case } from '@/types/cases';
import { getCaseById, updateCaseStatus } from '@/lib/api';
import { LoadingScreen } from '@/components/ui/loading-screen';

const statusColors = {
  pending: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
  ready_for_delivery: 'bg-green-500',
  delivered: 'bg-purple-500',
  cancelled: 'bg-red-500',
};

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      fetchCase();
    }
  }, [caseId]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const data = await getCaseById(caseId!);
      setCaseData(data);
    } catch (error) {
      console.error('Failed to fetch case:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!caseData) return;
    
    try {
      await updateCaseStatus(caseData.id, newStatus);
      setCaseData({ ...caseData, status: newStatus as 'pending' | 'in_progress' | 'ready_for_delivery' | 'delivered' | 'cancelled' });
    } catch (error) {
      console.error('Failed to update case status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusText = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white px-3 py-1 text-sm`}>
        {statusText}
      </Badge>
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Case Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested case could not be found.</p>
        <Button asChild>
          <Link to="/cases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cases
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/cases">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Briefcase className="h-8 w-8" />
              {caseData.caseNumber}
            </h1>
            <p className="text-muted-foreground">Case Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Case
          </Button>
          <Button asChild>
            <Link to={`/cases/${caseId}/edit`}>
              Edit Case
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Case Information</CardTitle>
                <div>{getStatusBadge(caseData.status)}</div>
              </div>
              <CardDescription>Complete case details and specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Patient Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Patient Name</label>
                      <p className="font-medium">{caseData.patientName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Age</label>
                      <p className="font-medium">{caseData.patientAge} years</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Gender</label>
                      <p className="font-medium">{caseData.patientGender}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Clinical Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Dentist</label>
                      <p className="font-medium">{caseData.dentistName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Clinic</label>
                      <p className="font-medium">{caseData.clinicName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Treatment Type</label>
                      <p className="font-medium">{caseData.treatmentType}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Timeline
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Date Received</label>
                      <p className="font-medium">
                        {new Date(caseData.dateReceived).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Due Date</label>
                      <p className={`font-medium ${new Date(caseData.dueDate) < new Date() ? 'text-red-500' : ''}`}>
                        {new Date(caseData.dueDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Days Remaining</label>
                      <p className="font-medium">
                        {Math.max(0, Math.ceil((new Date(caseData.dueDate).getTime() - Date.now()) / (1000 * 3600 * 24)))} days
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Activity className="mr-2 h-4 w-4" />
                    Dental Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Teeth Involved</label>
                      <p className="font-medium">{caseData.teethInvolved}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Shade</label>
                      <p className="font-medium">{caseData.shade}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Material</label>
                      <p className="font-medium">{caseData.material}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Case Notes
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{caseData.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Updates</CardTitle>
              <CardDescription>Case status workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm font-medium">Update Status:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(statusColors).map((status) => (
                    <Button
                      key={status}
                      variant={caseData.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusUpdate(status)}
                      className="capitalize"
                    >
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Add Time Entry
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Quality Check
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Add Internal Note
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">No attachments available</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Production Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Technician</p>
                    <p className="text-sm text-muted-foreground">Assigned to</p>
                  </div>
                  <Badge variant="outline">Not Assigned</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">QC Inspector</p>
                    <p className="text-sm text-muted-foreground">Quality check by</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}