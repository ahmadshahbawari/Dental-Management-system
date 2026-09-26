import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle } from 'lucide-react';
import { MOCK_DENTISTS, MOCK_CLINICS, getTreatmentTypes, saveTreatmentTypes } from '@/lib/mockData';

const MATERIALS = ['Porcelain', 'Zirconia', 'PFM', 'Acrylic', 'Cobalt Chrome', 'Gold', 'Composite'];
const SHADES    = ['A1','A2','A3','A3.5','A4','B1','B2','B3','B4','C1','C2','C3','C4','D2','D3','D4'];

export default function NewCaseWizard() {
  const navigate  = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Editable treatment types
  const [treatmentTypes, setTreatmentTypes] = useState<string[]>(getTreatmentTypes);
  const [addTreatmentOpen, setAddTreatmentOpen] = useState(false);
  const [newTreatment, setNewTreatment] = useState('');

  const [form, setForm] = useState({
    caseNumber:    '',
    patientName:   '',
    patientAge:    '',
    patientGender: 'Male',
    dentistId:     '',
    clinicId:      '',
    treatmentType: '',
    teethInvolved: '',
    shade:         '',
    material:      '',
    dateReceived:  new Date().toISOString().split('T')[0],
    dueDate:       '',
    priority:      'Normal',
    notes:         '',
    specialInstructions: '',
  });

  const ch = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.caseNumber.trim())  e.caseNumber  = 'Required';
      if (!form.patientName.trim()) e.patientName = 'Required';
      if (!form.patientAge.trim() || isNaN(Number(form.patientAge))) e.patientAge = 'Valid age required';
    }
    if (step === 2) {
      if (!form.dentistId)          e.dentistId     = 'Select a dentist';
      if (!form.treatmentType)      e.treatmentType = 'Select treatment type';
      if (!form.teethInvolved.trim()) e.teethInvolved = 'Required';
    }
    if (step === 3) {
      if (!form.dueDate) e.dueDate = 'Required';
      else if (new Date(form.dueDate) < new Date(form.dateReceived)) e.dueDate = 'Must be after date received';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 4)); };
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    navigate('/cases');
  };

  const addTreatmentType = () => {
    if (!newTreatment.trim()) return;
    const updated = [...treatmentTypes, newTreatment.trim()];
    setTreatmentTypes(updated);
    saveTreatmentTypes(updated);
    setNewTreatment('');
    setAddTreatmentOpen(false);
  };

  const removeTreatmentType = (t: string) => {
    const updated = treatmentTypes.filter(x => x !== t);
    setTreatmentTypes(updated);
    saveTreatmentTypes(updated);
    if (form.treatmentType === t) ch('treatmentType', '');
  };

  const selectedDentist = MOCK_DENTISTS.find(d => d.id === form.dentistId);
  const selectedClinic  = MOCK_CLINICS.find(c => c.id === form.clinicId);

  const Err = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-[11px] text-red-500 mt-0.5">{errors[field]}</p> : null;

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/cases')}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-bold">New Case</h1>
          <p className="text-xs text-muted-foreground">Create a new dental laboratory case</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-2">
            {[1,2,3,4].map(n => (
              <div key={n} className="flex items-center gap-2 flex-1">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold
                  ${n === step ? 'bg-primary text-primary-foreground'
                    : n < step  ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'}`}>
                  {n < step ? <CheckCircle className="h-4 w-4" /> : n}
                </div>
                <div className="hidden sm:block flex-1">
                  <p className="text-[11px] font-medium">
                    {['Basic Info', 'Clinical', 'Timeline', 'Details'][n-1]}
                  </p>
                </div>
                {n < 4 && <div className="h-px flex-1 bg-border" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1 */}
      {step === 1 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Basic Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Case Number *</Label>
              <Input className="h-8 text-xs" value={form.caseNumber} onChange={e => ch('caseNumber', e.target.value)} placeholder="CAS-2024-001" />
              <Err field="caseNumber" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Patient Name *</Label>
              <Input className="h-8 text-xs" value={form.patientName} onChange={e => ch('patientName', e.target.value)} placeholder="Full name" />
              <Err field="patientName" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Patient Age *</Label>
              <Input className="h-8 text-xs" type="number" min="1" max="120" value={form.patientAge} onChange={e => ch('patientAge', e.target.value)} placeholder="Age" />
              <Err field="patientAge" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Gender</Label>
              <Select value={form.patientGender} onValueChange={v => ch('patientGender', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male"   className="text-xs">Male</SelectItem>
                  <SelectItem value="Female" className="text-xs">Female</SelectItem>
                  <SelectItem value="Other"  className="text-xs">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Clinical Information</CardTitle>
            <CardDescription className="text-xs">Select dentist and clinic from existing records</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {/* Dentist dropdown */}
            <div className="space-y-1">
              <Label className="text-xs">Dentist *</Label>
              <Select value={form.dentistId} onValueChange={v => ch('dentistId', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select dentist" /></SelectTrigger>
                <SelectContent>
                  {MOCK_DENTISTS.filter(d => d.isActive).map(d => (
                    <SelectItem key={d.id} value={d.id} className="text-xs">
                      Dr. {d.firstName} {d.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDentist && (
                <p className="text-[10px] text-muted-foreground">License: {selectedDentist.licenseNumber} · {selectedDentist.specialties.join(', ')}</p>
              )}
              <Err field="dentistId" />
            </div>

            {/* Clinic dropdown */}
            <div className="space-y-1">
              <Label className="text-xs">Clinic</Label>
              <Select value={form.clinicId} onValueChange={v => ch('clinicId', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select clinic" /></SelectTrigger>
                <SelectContent>
                  {MOCK_CLINICS.filter(c => c.isActive).map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedClinic && (
                <p className="text-[10px] text-muted-foreground">{selectedClinic.address}</p>
              )}
            </div>

            {/* Treatment type — editable list */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Treatment Type *</Label>
                <button className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                  onClick={() => setAddTreatmentOpen(true)}>
                  <Plus className="h-3 w-3" /> Add type
                </button>
              </div>
              <Select value={form.treatmentType} onValueChange={v => ch('treatmentType', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {treatmentTypes.map(t => (
                    <SelectItem key={t} value={t} className="text-xs group">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{t}</span>
                        <button
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                          onClick={e => { e.stopPropagation(); removeTreatmentType(t); }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Err field="treatmentType" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Teeth Involved *</Label>
              <Input className="h-8 text-xs" value={form.teethInvolved} onChange={e => ch('teethInvolved', e.target.value)} placeholder="e.g. 12, 13, 14" />
              <Err field="teethInvolved" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Shade</Label>
              <Select value={form.shade} onValueChange={v => ch('shade', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select shade" /></SelectTrigger>
                <SelectContent>
                  {SHADES.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Material</Label>
              <Select value={form.material} onValueChange={v => ch('material', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select material" /></SelectTrigger>
                <SelectContent>
                  {MATERIALS.map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Timeline & Priority</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Date Received</Label>
              <Input className="h-8 text-xs" type="date" value={form.dateReceived} onChange={e => ch('dateReceived', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Due Date *</Label>
              <Input className="h-8 text-xs" type="date" value={form.dueDate} min={form.dateReceived} onChange={e => ch('dueDate', e.target.value)} />
              <Err field="dueDate" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Priority</Label>
              <Select value={form.priority} onValueChange={v => ch('priority', v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Low','Normal','High','Urgent'].map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Additional Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Case Notes</Label>
              <Textarea className="text-xs min-h-[72px]" value={form.notes} onChange={e => ch('notes', e.target.value)} placeholder="Relevant notes…" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Special Instructions</Label>
              <Textarea className="text-xs min-h-[56px]" value={form.specialInstructions} onChange={e => ch('specialInstructions', e.target.value)} placeholder="Instructions for technician…" />
            </div>

            {/* Summary */}
            <div className="rounded-md border p-3 text-xs space-y-1 bg-muted/40">
              <p className="font-medium text-sm mb-1">Summary</p>
              <div className="grid grid-cols-2 gap-1">
                <div><span className="text-muted-foreground">Case #: </span>{form.caseNumber}</div>
                <div><span className="text-muted-foreground">Patient: </span>{form.patientName}</div>
                <div><span className="text-muted-foreground">Dentist: </span>{selectedDentist ? `Dr. ${selectedDentist.firstName} ${selectedDentist.lastName}` : '—'}</div>
                <div><span className="text-muted-foreground">Clinic: </span>{selectedClinic?.name || '—'}</div>
                <div><span className="text-muted-foreground">Treatment: </span>{form.treatmentType}</div>
                <div><span className="text-muted-foreground">Due: </span>{form.dueDate}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2 border-t">
        <Button variant="outline" size="sm" onClick={prev} disabled={step === 1}>Previous</Button>
        {step < 4
          ? <Button size="sm" onClick={next}>Next Step</Button>
          : <Button size="sm" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Creating…' : <><Save className="mr-1.5 h-3.5 w-3.5" />Create Case</>}
            </Button>
        }
      </div>

      {/* Add Treatment Type Dialog */}
      <Dialog open={addTreatmentOpen} onOpenChange={setAddTreatmentOpen}>
        <DialogContent className="sm:max-w-[340px]">
          <DialogHeader>
            <DialogTitle className="text-base">Add Treatment Type</DialogTitle>
            <DialogDescription className="text-xs">Add a new treatment type to the list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-xs">Treatment Name</Label>
            <Input className="h-8 text-xs" value={newTreatment} onChange={e => setNewTreatment(e.target.value)} placeholder="e.g. Implant Crown" onKeyDown={e => e.key === 'Enter' && addTreatmentType()} />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddTreatmentOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={addTreatmentType} disabled={!newTreatment.trim()}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
