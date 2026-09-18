import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { createCase } from '@/lib/api';

const treatmentTypes = [
  'Crown',
  'Bridge',
  'Denture',
  'Partial Denture',
  'Implant',
  'Veneer',
  'Inlay/Onlay',
  'Orthodontic Appliance'
];

const materials = [
  'Porcelain',
  'Zirconia',
  'PFM',
  'Acrylic',
  'Cobalt Chrome',
  'Gold',
  'Composite'
];

const shadeOptions = [
  'A1', 'A2', 'A3', 'A3.5', 'A4',
  'B1', 'B2', 'B3', 'B4',
  'C1', 'C2', 'C3', 'C4',
  'D2', 'D3', 'D4'
];

export default function NewCaseWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    caseNumber: '',
    patientName: '',
    patientAge: '',
    patientGender: 'Male',
    
    // Step 2: Clinical Information
    dentistName: '',
    clinicName: '',
    treatmentType: '',
    teethInvolved: '',
    shade: '',
    material: '',
    
    // Step 3: Timeline
    dateReceived: new Date().toISOString().split('T')[0],
    dueDate: '',
    priority: 'Normal',
    
    // Step 4: Additional Details
    notes: '',
    specialInstructions: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.caseNumber.trim()) newErrors.caseNumber = 'Case number is required';
      if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
      if (!formData.patientAge.trim() || isNaN(Number(formData.patientAge))) {
        newErrors.patientAge = 'Valid age is required';
      }
    }

    if (step === 2) {
      if (!formData.dentistName.trim()) newErrors.dentistName = 'Dentist name is required';
      if (!formData.treatmentType.trim()) newErrors.treatmentType = 'Treatment type is required';
      if (!formData.teethInvolved.trim()) newErrors.teethInvolved = 'Teeth involved is required';
    }

    if (step === 3) {
      if (!formData.dueDate.trim()) newErrors.dueDate = 'Due date is required';
      if (new Date(formData.dueDate) < new Date(formData.dateReceived)) {
        newErrors.dueDate = 'Due date must be after date received';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const caseData = {
        ...formData,
        patientAge: parseInt(formData.patientAge),
        priority: formData.priority.toLowerCase(),
        status: 'pending'
      };
      
      await createCase(caseData);
      navigate('/cases');
    } catch (error) {
      console.error('Failed to create case:', error);
    } finally {
      setLoading(false);
    }
  };

  const stepComponents = [
    // Step 1: Basic Information
    <div key={1} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the basic details of the case</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caseNumber">Case Number *</Label>
              <Input
                id="caseNumber"
                value={formData.caseNumber}
                onChange={(e) => handleChange('caseNumber', e.target.value)}
                placeholder="e.g., CAS-2024-001"
                className={errors.caseNumber ? 'border-red-500' : ''}
              />
              {errors.caseNumber && <p className="text-sm text-red-500">{errors.caseNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => handleChange('patientName', e.target.value)}
                placeholder="Enter patient name"
                className={errors.patientName ? 'border-red-500' : ''}
              />
              {errors.patientName && <p className="text-sm text-red-500">{errors.patientName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientAge">Patient Age *</Label>
              <Input
                id="patientAge"
                type="number"
                min="1"
                max="120"
                value={formData.patientAge}
                onChange={(e) => handleChange('patientAge', e.target.value)}
                placeholder="Age in years"
                className={errors.patientAge ? 'border-red-500' : ''}
              />
              {errors.patientAge && <p className="text-sm text-red-500">{errors.patientAge}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientGender">Gender</Label>
              <Select value={formData.patientGender} onValueChange={(value) => handleChange('patientGender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,

    // Step 2: Clinical Information
    <div key={2} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Clinical Information</CardTitle>
          <CardDescription>Enter clinical details and specifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dentistName">Dentist Name *</Label>
              <Input
                id="dentistName"
                value={formData.dentistName}
                onChange={(e) => handleChange('dentistName', e.target.value)}
                placeholder="Enter dentist name"
                className={errors.dentistName ? 'border-red-500' : ''}
              />
              {errors.dentistName && <p className="text-sm text-red-500">{errors.dentistName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input
                id="clinicName"
                value={formData.clinicName}
                onChange={(e) => handleChange('clinicName', e.target.value)}
                placeholder="Enter clinic name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatmentType">Treatment Type *</Label>
              <Select value={formData.treatmentType} onValueChange={(value) => handleChange('treatmentType', value)}>
                <SelectTrigger className={errors.treatmentType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select treatment type" />
                </SelectTrigger>
                <SelectContent>
                  {treatmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.treatmentType && <p className="text-sm text-red-500">{errors.treatmentType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teethInvolved">Teeth Involved *</Label>
              <Input
                id="teethInvolved"
                value={formData.teethInvolved}
                onChange={(e) => handleChange('teethInvolved', e.target.value)}
                placeholder="e.g., 12, 13, 14"
                className={errors.teethInvolved ? 'border-red-500' : ''}
              />
              {errors.teethInvolved && <p className="text-sm text-red-500">{errors.teethInvolved}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shade">Shade</Label>
              <Select value={formData.shade} onValueChange={(value) => handleChange('shade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shade" />
                </SelectTrigger>
                <SelectContent>
                  {shadeOptions.map(shade => (
                    <SelectItem key={shade} value={shade}>{shade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Select value={formData.material} onValueChange={(value) => handleChange('material', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map(material => (
                    <SelectItem key={material} value={material}>{material}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,

    // Step 3: Timeline
    <div key={3} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Timeline & Priority</CardTitle>
          <CardDescription>Set dates and priority for the case</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateReceived">Date Received</Label>
              <Input
                id="dateReceived"
                type="date"
                value={formData.dateReceived}
                onChange={(e) => handleChange('dateReceived', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                min={formData.dateReceived}
                className={errors.dueDate ? 'border-red-500' : ''}
              />
              {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,

    // Step 4: Additional Details
    <div key={4} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
          <CardDescription>Add notes and special instructions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Case Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Enter any relevant case notes..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={formData.specialInstructions}
              onChange={(e) => handleChange('specialInstructions', e.target.value)}
              placeholder="Any special instructions for the technician..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/cases">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cases
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Case Wizard</h1>
            <p className="text-muted-foreground">Create a new dental laboratory case</p>
          </div>
        </div>
      </div>

      {/* Step Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  stepNum === step ? 'bg-primary text-primary-foreground' :
                  stepNum < step ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-800'
                }`}>
                  {stepNum}
                </div>
                <span className="mt-2 text-sm">
                  {stepNum === 1 && 'Basic Info'}
                  {stepNum === 2 && 'Clinical'}
                  {stepNum === 3 && 'Timeline'}
                  {stepNum === 4 && 'Details'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800"></div>
            <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300"
                 style={{ width: `${(step - 1) * 33.33}%` }}></div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      {stepComponents[step - 1]}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1 || loading}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {step < 4 ? (
            <Button onClick={nextStep}>
              Next Step
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Case
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}