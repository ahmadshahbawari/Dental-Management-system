import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';
import { MOCK_DENTISTS, MOCK_CLINICS, getTreatmentTypes, saveTreatmentTypes } from '@/lib/mockData';

const MATERIALS = ['Porcelain', 'Zirconia', 'PFM', 'Acrylic', 'Cobalt Chrome', 'Gold', 'Composite'];
const SHADES    = ['A1','A2','A3','A3.5','A4','B1','B2','B3','B4','C1','C2','C3','C4','D2','D3','D4'];

const blank = {
  caseNumber: '', patientName: '', patientAge: '', patientGender: 'Male',
  dentistId: '', clinicId: '', treatmentType: '', teethInvolved: '',
  shade: '', material: '', dateReceived: new Date().toISOString().split('T')[0],
  dueDate: '', priority: 'Normal', notes: '', specialInstructions: '',
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function NewCaseDialog({ open, onOpenChange, onCreated }: Props) {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [done, setDone]   = useState(false);

  // Editable treatment types
  const [treatmentTypes, setTreatmentTypes] = useState<string[]>(getTreatmentTypes);
  const [addTxOpen, setAddTxOpen] = useState(false);
  const [newTx, setNewTx] = useState('');

  const ch = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.caseNumber.trim()) e.caseNumber = 'Required';
      if (!form.patientName.trim()) e.patientName = 'Required';
    }
    if (step === 2) {
      if (!form.dentistId) e.dentistId = 'Select a dentist';
      if (!form.treatmentType) e.treatmentType = 'Select treatment type';
      if (!form.teethInvolved.trim()) e.teethInvolved = 'Required';
    }
    if (step === 3) {
      if (!form.dueDate) e.dueDate = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 4)); };
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setStep(1);
      setForm(blank);
      onOpenChange(false);
      onCreated?.();
    }, 1500);
  };

  const addTreatmentType = () => {
    if (!newTx.trim()) return;
    const updated = [...treatmentTypes, newTx.trim()];
    setTreatmentTypes(updated);
    saveTreatmentTypes(updated);
    setNewTx('');
    setAddTxOpen(false);
  };

  const Err = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-[10px] text-red-500 mt-0.5">{errors[field]}</p> : null;

  const selectedDentist = MOCK_DENTISTS.find(d => d.id === form.dentistId);
  const selectedClinic  = MOCK_CLINICS.find(c => c.id === form.clinicId);

  const STEPS = ['Basic Info', 'Clinical', 'Timeline', 'Details'];

  return (
    <>
      <Dialog open={open} onOpenChange={v => { if (!v) { setStep(1); setForm(blank); } onOpenChange(v); }}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle className="text-base">New Case</DialogTitle>
            <DialogDescription className="text-xs">Create a dental laboratory case — Step {step} of 4: {STEPS[step-1]}</DialogDescription>
          </DialogHeader>

          {done ? (
            <div className="py-8 text-center">
              <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-green-600">Case created successfully!</p>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="flex gap-1 mb-2">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={`flex-1 h-1 rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-muted'}`}
                  />
                ))}
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-3">
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
                    <Label className="text-xs">Age</Label>
                    <Input className="h-8 text-xs" type="number" min="1" max="120" value={form.patientAge} onChange={e => ch('patientAge', e.target.value)} placeholder="Age" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Gender</Label>
                    <Select value={form.patientGender} onValueChange={v => ch('patientGender', v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male" className="text-xs">Male</SelectItem>
                        <SelectItem value="Female" className="text-xs">Female</SelectItem>
                        <SelectItem value="Other" className="text-xs">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Dentist *</Label>
                    <Select value={form.dentistId} onValueChange={v => ch('dentistId', v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select dentist" /></SelectTrigger>
                      <SelectContent>
                        {MOCK_DENTISTS.filter(d => d.isActive).map(d => (
                          <SelectItem key={d.id} value={d.id} className="text-xs">Dr. {d.firstName} {d.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedDentist && <p className="text-[10px] text-muted-foreground">{selectedDentist.specialties.join(', ')}</p>}
                    <Err field="dentistId" />
                  </div>
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
                    {selectedClinic && <p className="text-[10px] text-muted-foreground">{selectedClinic.address}</p>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Treatment Type *</Label>
                      <button className="text-[10px] text-primary flex items-center gap-0.5" onClick={() => setAddTxOpen(true)}>
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    </div>
                    <Select value={form.treatmentType} onValueChange={v => ch('treatmentType', v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {treatmentTypes.map(t => (
                          <SelectItem key={t} value={t} className="text-xs group">
                            <div className="flex items-center justify-between w-full gap-3">
                              <span>{t}</span>
                              <button
                                className="opacity-0 group-hover:opacity-100 text-red-400"
                                onClick={e => { e.stopPropagation(); const u = treatmentTypes.filter(x => x !== t); setTreatmentTypes(u); saveTreatmentTypes(u); }}
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
                    <Input className="h-8 text-xs" value={form.teethInvolved} onChange={e => ch('teethInvolved', e.target.value)} placeholder="e.g. 12, 13" />
                    <Err field="teethInvolved" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Shade</Label>
                    <Select value={form.shade} onValueChange={v => ch('shade', v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select shade" /></SelectTrigger>
                      <SelectContent>{SHADES.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Material</Label>
                    <Select value={form.material} onValueChange={v => ch('material', v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select material" /></SelectTrigger>
                      <SelectContent>{MATERIALS.map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="grid grid-cols-2 gap-3">
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
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Case Notes</Label>
                    <Textarea className="text-xs min-h-[64px]" value={form.notes} onChange={e => ch('notes', e.target.value)} placeholder="Relevant notes…" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Special Instructions</Label>
                    <Textarea className="text-xs min-h-[48px]" value={form.specialInstructions} onChange={e => ch('specialInstructions', e.target.value)} placeholder="Instructions for technician…" />
                  </div>
                  <div className="rounded border p-3 text-xs space-y-1 bg-muted/40">
                    <p className="font-semibold mb-1">Summary</p>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-muted-foreground">Case #:</span><span>{form.caseNumber}</span>
                      <span className="text-muted-foreground">Patient:</span><span>{form.patientName}</span>
                      <span className="text-muted-foreground">Dentist:</span><span>{selectedDentist ? `Dr. ${selectedDentist.firstName} ${selectedDentist.lastName}` : '—'}</span>
                      <span className="text-muted-foreground">Clinic:</span><span>{selectedClinic?.name || '—'}</span>
                      <span className="text-muted-foreground">Treatment:</span><span>{form.treatmentType}</span>
                      <span className="text-muted-foreground">Due:</span><span>{form.dueDate}</span>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="mt-2">
                <Button variant="outline" size="sm" onClick={prev} disabled={step === 1}>Previous</Button>
                {step < 4
                  ? <Button size="sm" onClick={next}>Next</Button>
                  : <Button size="sm" onClick={handleSubmit} disabled={saving}>
                      {saving ? 'Creating…' : 'Create Case'}
                    </Button>
                }
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add treatment type sub-dialog */}
      <Dialog open={addTxOpen} onOpenChange={setAddTxOpen}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle className="text-base">Add Treatment Type</DialogTitle>
            <DialogDescription className="text-xs">Enter the name of the new treatment type.</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <Label className="text-xs">Treatment Name</Label>
            <Input className="h-8 text-xs" value={newTx} onChange={e => setNewTx(e.target.value)} placeholder="e.g. Implant Crown" onKeyDown={e => e.key === 'Enter' && addTreatmentType()} />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddTxOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={addTreatmentType} disabled={!newTx.trim()}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
