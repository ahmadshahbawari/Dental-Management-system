import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Search, Package, Plus, AlertTriangle, TrendingDown, TrendingUp, MoreVertical, CheckCircle } from 'lucide-react';

interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  currentStock: number;
  minLevel: number;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  cost?: number;
}

const initialItems: InventoryItem[] = [
  { id: '1', code: 'MAT-001', name: 'Zirconia Block', category: 'Dental Materials', currentStock: 15, minLevel: 10, unit: 'Pcs', status: 'In Stock', cost: 45 },
  { id: '2', code: 'MAT-002', name: 'PFM Bonding Agent', category: 'Dental Materials', currentStock: 2, minLevel: 10, unit: 'Bottles', status: 'Low Stock', cost: 28 },
  { id: '3', code: 'SUP-001', name: 'Porcelain Powder', category: 'Laboratory Supplies', currentStock: 8, minLevel: 5, unit: 'Kg', status: 'In Stock', cost: 75 },
  { id: '4', code: 'CON-001', name: 'Mixing Tips', category: 'Consumables', currentStock: 0, minLevel: 50, unit: 'Pcs', status: 'Out of Stock', cost: 2 },
  { id: '5', code: 'MAT-003', name: 'Acrylic Resin', category: 'Dental Materials', currentStock: 12, minLevel: 8, unit: 'Kg', status: 'In Stock', cost: 55 },
];

const defaultForm = { code: '', name: '', category: 'Dental Materials', currentStock: '', minLevel: '', unit: 'Pcs', cost: '' };

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [addItemOpen, setAddItemOpen] = useState(false);
  const [receiveStockOpen, setReceiveStockOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [form, setForm] = useState(defaultForm);
  const [receiveForm, setReceiveForm] = useState({ itemCode: '', quantity: '', notes: '' });
  const [adjustForm, setAdjustForm] = useState({ itemCode: '', newQuantity: '', reason: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 2500); };

  const getStatus = (current: number, min: number): InventoryItem['status'] => {
    if (current === 0) return 'Out of Stock';
    if (current < min) return 'Low Stock';
    return 'In Stock';
  };

  const filteredItems = items.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    const matchTab =
      activeTab === 'all' ||
      (activeTab === 'low' && (item.status === 'Low Stock' || item.status === 'Out of Stock')) ||
      (activeTab === 'materials' && item.category === 'Dental Materials') ||
      (activeTab === 'consumables' && item.category === 'Consumables');
    return matchSearch && matchTab;
  });

  const handleAddItem = () => {
    if (!form.name || !form.code) return;
    const current = parseInt(form.currentStock) || 0;
    const min = parseInt(form.minLevel) || 0;
    const newItem: InventoryItem = {
      id: String(items.length + 1), code: form.code, name: form.name,
      category: form.category, currentStock: current, minLevel: min,
      unit: form.unit, cost: parseFloat(form.cost) || 0,
      status: getStatus(current, min),
    };
    setItems([newItem, ...items]);
    setForm(defaultForm);
    setAddItemOpen(false);
    showSuccess('Item added successfully!');
  };

  const handleReceiveStock = () => {
    if (!receiveForm.itemCode || !receiveForm.quantity) return;
    const qty = parseInt(receiveForm.quantity);
    setItems(items.map(item => {
      if (item.code === receiveForm.itemCode) {
        const newQty = item.currentStock + qty;
        return { ...item, currentStock: newQty, status: getStatus(newQty, item.minLevel) };
      }
      return item;
    }));
    setReceiveForm({ itemCode: '', quantity: '', notes: '' });
    setReceiveStockOpen(false);
    showSuccess(`Stock received: +${qty} units`);
  };

  const handleAdjust = () => {
    if (!adjustForm.itemCode || adjustForm.newQuantity === '') return;
    const newQty = parseInt(adjustForm.newQuantity);
    setItems(items.map(item => {
      if (item.code === adjustForm.itemCode) {
        return { ...item, currentStock: newQty, status: getStatus(newQty, item.minLevel) };
      }
      return item;
    }));
    setAdjustForm({ itemCode: '', newQuantity: '', reason: '' });
    setAdjustOpen(false);
    showSuccess('Stock adjusted successfully!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock': return <Badge className="bg-green-500 text-white">In Stock</Badge>;
      case 'Low Stock': return <Badge className="bg-amber-500 text-white">Low Stock</Badge>;
      case 'Out of Stock': return <Badge className="bg-red-500 text-white">Out of Stock</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />{successMsg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage materials, supplies, and stock levels</p>
        </div>
        <Button onClick={() => setAddItemOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Track and manage all inventory items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search inventory items..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Items ({items.length})</TabsTrigger>
                  <TabsTrigger value="low">Low Stock ({items.filter(i => i.status !== 'In Stock').length})</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="consumables">Consumables</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Min Level</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length === 0 && (
                        <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No items found</TableCell></TableRow>
                      )}
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.code}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span>{item.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className={item.currentStock < item.minLevel ? 'text-red-600 font-bold' : ''}>{item.currentStock}</TableCell>
                          <TableCell>{item.minLevel}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedItem(item)}>View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setReceiveForm({ itemCode: item.code, quantity: '', notes: '' }); setReceiveStockOpen(true); }}>
                                  Receive Stock
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setAdjustForm({ itemCode: item.code, newQuantity: String(item.currentStock), reason: '' }); setAdjustOpen(true); }}>
                                  Adjust Stock
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Low Stock Alerts</CardTitle><CardDescription>Items requiring attention</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {items.filter(i => i.status !== 'In Stock').map(item => (
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-md ${item.status === 'Out of Stock' ? 'bg-red-50 dark:bg-red-950/20' : 'bg-amber-50 dark:bg-amber-950/20'}`}>
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`h-5 w-5 ${item.status === 'Out of Stock' ? 'text-red-500' : 'text-amber-500'}`} />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Current: {item.currentStock} | Min: {item.minLevel}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === 'Out of Stock' ? 'destructive' : 'secondary'}>{item.status}</Badge>
                  </div>
                ))}
                {items.filter(i => i.status !== 'In Stock').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No stock alerts</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Recent Stock Movements</CardTitle><CardDescription>Latest inventory transactions</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><TrendingDown className="h-4 w-4 text-red-500" /><div><p className="text-sm">Porcelain Powder - Used</p><p className="text-xs text-muted-foreground">-5 units</p></div></div>
                  <span className="text-sm">Today</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><TrendingUp className="h-4 w-4 text-green-500" /><div><p className="text-sm">Zirconia Block - Received</p><p className="text-xs text-muted-foreground">+10 units</p></div></div>
                  <span className="text-sm">Yesterday</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Inventory Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><p className="text-sm font-medium">Total Items</p><p className="text-2xl font-bold">{items.length}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium">Total Value</p><p className="text-2xl font-bold text-green-500">${items.reduce((s, i) => s + i.currentStock * (i.cost || 0), 0).toLocaleString()}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium">Low Stock</p><p className="text-2xl font-bold text-amber-500">{items.filter(i => i.status === 'Low Stock').length}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium">Out of Stock</p><p className="text-2xl font-bold text-red-500">{items.filter(i => i.status === 'Out of Stock').length}</p></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setAddItemOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />Add New Item
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setReceiveStockOpen(true)}>
                <TrendingUp className="mr-2 h-4 w-4" />Receive Stock
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setAdjustOpen(true)}>
                <Package className="mr-2 h-4 w-4" />Stock Adjustment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Add New Inventory Item</DialogTitle><DialogDescription>Fields marked * are required.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Item Code *</Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="MAT-001" /></div>
              <div className="space-y-2"><Label>Item Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Item name" /></div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dental Materials">Dental Materials</SelectItem>
                    <SelectItem value="Laboratory Supplies">Laboratory Supplies</SelectItem>
                    <SelectItem value="Consumables">Consumables</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={form.unit} onValueChange={v => setForm({ ...form, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pcs">Pieces</SelectItem>
                    <SelectItem value="Kg">Kilograms</SelectItem>
                    <SelectItem value="Bottles">Bottles</SelectItem>
                    <SelectItem value="Boxes">Boxes</SelectItem>
                    <SelectItem value="Liters">Liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Current Stock</Label><Input type="number" min="0" value={form.currentStock} onChange={e => setForm({ ...form, currentStock: e.target.value })} placeholder="0" /></div>
              <div className="space-y-2"><Label>Minimum Level</Label><Input type="number" min="0" value={form.minLevel} onChange={e => setForm({ ...form, minLevel: e.target.value })} placeholder="5" /></div>
              <div className="space-y-2 col-span-2"><Label>Unit Cost ($)</Label><Input type="number" min="0" step="0.01" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="0.00" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddItemOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem} disabled={!form.name || !form.code}><Plus className="mr-2 h-4 w-4" />Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Stock Dialog */}
      <Dialog open={receiveStockOpen} onOpenChange={setReceiveStockOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader><DialogTitle>Receive Stock</DialogTitle><DialogDescription>Add received stock to inventory</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Item *</Label>
              <Select value={receiveForm.itemCode} onValueChange={v => setReceiveForm({ ...receiveForm, itemCode: v })}>
                <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                <SelectContent>{items.map(i => <SelectItem key={i.id} value={i.code}>{i.code} — {i.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Quantity Received *</Label><Input type="number" min="1" value={receiveForm.quantity} onChange={e => setReceiveForm({ ...receiveForm, quantity: e.target.value })} placeholder="Enter quantity" /></div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={receiveForm.notes} onChange={e => setReceiveForm({ ...receiveForm, notes: e.target.value })} placeholder="Supplier, batch number, etc." rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiveStockOpen(false)}>Cancel</Button>
            <Button onClick={handleReceiveStock} disabled={!receiveForm.itemCode || !receiveForm.quantity}><TrendingUp className="mr-2 h-4 w-4" />Receive Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Adjustment Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader><DialogTitle>Stock Adjustment</DialogTitle><DialogDescription>Correct stock levels after count or correction</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Item *</Label>
              <Select value={adjustForm.itemCode} onValueChange={v => {
                const item = items.find(i => i.code === v);
                setAdjustForm({ ...adjustForm, itemCode: v, newQuantity: item ? String(item.currentStock) : '' });
              }}>
                <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                <SelectContent>{items.map(i => <SelectItem key={i.id} value={i.code}>{i.code} — {i.name} (Current: {i.currentStock})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>New Quantity *</Label><Input type="number" min="0" value={adjustForm.newQuantity} onChange={e => setAdjustForm({ ...adjustForm, newQuantity: e.target.value })} placeholder="New stock level" /></div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select value={adjustForm.reason} onValueChange={v => setAdjustForm({ ...adjustForm, reason: v })}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Physical Count</SelectItem>
                  <SelectItem value="damaged">Damaged/Expired</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="correction">Data Correction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>Cancel</Button>
            <Button onClick={handleAdjust} disabled={!adjustForm.itemCode || adjustForm.newQuantity === ''}>Apply Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[400px]">
          {selectedItem && (
            <>
              <DialogHeader><DialogTitle>{selectedItem.name}</DialogTitle><DialogDescription>{selectedItem.code}</DialogDescription></DialogHeader>
              <div className="py-4 grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Category:</span><p className="font-medium">{selectedItem.category}</p></div>
                <div><span className="text-muted-foreground">Unit:</span><p className="font-medium">{selectedItem.unit}</p></div>
                <div><span className="text-muted-foreground">Current Stock:</span><p className={`font-bold ${selectedItem.currentStock < selectedItem.minLevel ? 'text-red-600' : 'text-green-600'}`}>{selectedItem.currentStock}</p></div>
                <div><span className="text-muted-foreground">Min Level:</span><p className="font-medium">{selectedItem.minLevel}</p></div>
                <div><span className="text-muted-foreground">Unit Cost:</span><p className="font-medium">${selectedItem.cost}</p></div>
                <div><span className="text-muted-foreground">Total Value:</span><p className="font-medium">${(selectedItem.currentStock * (selectedItem.cost || 0)).toFixed(2)}</p></div>
                <div className="col-span-2"><span className="text-muted-foreground">Status:</span>{getStatusBadge(selectedItem.status)}</div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedItem(null)}>Close</Button>
                <Button onClick={() => { setReceiveForm({ itemCode: selectedItem.code, quantity: '', notes: '' }); setSelectedItem(null); setReceiveStockOpen(true); }}>
                  <TrendingUp className="mr-2 h-4 w-4" />Receive Stock
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
