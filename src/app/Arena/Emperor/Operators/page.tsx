
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, PlusCircle, Search, Edit, Trash2, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createOperator, updateOperator, deleteOperator } from '@/app/actions';

type Operator = {
  id: string;
  UID: string;
  UserName: string;
  SuperAdmin: 'Yes' | 'No';
  Attributes: string;
  Remarks: string;
};

const createOperatorSchema = z.object({
  email: z.string().email('A valid email is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  UserName: z.string().min(2, 'Username is required.'),
  SuperAdmin: z.enum(['Yes', 'No']),
  Attributes: z.string().optional(),
  Remarks: z.string().optional(),
});

const updateOperatorSchema = z.object({
  UID: z.string(),
  UserName: z.string().min(2, 'Username is required.'),
  SuperAdmin: z.enum(['Yes', 'No']),
  Attributes: z.string().optional(),
  Remarks: z.string().optional(),
});


function CreateOperatorForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof createOperatorSchema>>({
    resolver: zodResolver(createOperatorSchema),
    defaultValues: {
      email: '',
      password: '',
      UserName: '',
      SuperAdmin: 'No',
      Attributes: '',
      Remarks: '',
    },
  });

  async function onSubmit(values: z.infer<typeof createOperatorSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createOperator(values);

      if (result.success) {
        toast({
          title: 'Operator Created',
          description: `Successfully created operator ${values.UserName}.`,
        });
        setOpen(false);
        form.reset();
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }

    } catch (error: any) {
      console.error('Operator Creation Error:', error);
      toast({
        title: 'Creation Failed',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="operator@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="UserName" render={({ field }) => (<FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="e.g., admin_jane" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="SuperAdmin" render={({ field }) => (<FormItem><FormLabel>Super Admin</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Is this a super admin?" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="Attributes" render={({ field }) => (<FormItem><FormLabel>Attributes (comma-separated)</FormLabel><FormControl><Input placeholder="e.g., reports,billing" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="Remarks" render={({ field }) => (<FormItem><FormLabel>Remarks</FormLabel><FormControl><Input placeholder="Optional notes" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Operator</Button></DialogFooter>
      </form>
    </Form>
  );
}

function EditOperatorForm({ operator, setOpen }: { operator: Operator; setOpen: (open: boolean) => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof updateOperatorSchema>>({
        resolver: zodResolver(updateOperatorSchema),
        defaultValues: {
            UID: operator.UID,
            UserName: operator.UserName,
            SuperAdmin: operator.SuperAdmin,
            Attributes: operator.Attributes || '',
            Remarks: operator.Remarks || '',
        },
    });

    async function onSubmit(values: z.infer<typeof updateOperatorSchema>) {
        setIsSubmitting(true);
        try {
            const result = await updateOperator(values);
            if (result.success) {
                toast({
                    title: 'Operator Updated',
                    description: `Successfully updated operator ${values.UserName}.`,
                });
                setOpen(false);
            } else {
                throw new Error(result.error || 'An unknown error occurred.');
            }
        } catch (error: any) {
            toast({
                title: 'Update Failed',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField control={form.control} name="UserName" render={({ field }) => (<FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="e.g., admin_jane" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="SuperAdmin" render={({ field }) => (<FormItem><FormLabel>Super Admin</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Is this a super admin?" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="Attributes" render={({ field }) => (<FormItem><FormLabel>Attributes (comma-separated)</FormLabel><FormControl><Input placeholder="e.g., reports,billing" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="Remarks" render={({ field }) => (<FormItem><FormLabel>Remarks</FormLabel><FormControl><Input placeholder="Optional notes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Update Operator</Button></DialogFooter>
            </form>
        </Form>
    );
}

export default function OperatorsPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user, isSuperAdmin, isUserLoading, isOperatorLoading } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

  const operatorsQuery = useMemoFirebase(() => {
    if (!firestore || !isSuperAdmin) return null;
    return collection(firestore, 'operators');
  }, [firestore, isSuperAdmin]);

  const { data: operators, isLoading, error } = useCollection<Operator>(operatorsQuery);
  
  useEffect(() => {
    if (isUserLoading || isOperatorLoading) return;
    
    if (!user || !isSuperAdmin) {
        router.replace('/Arena/Emperor/Login');
    }
  }, [user, isUserLoading, isOperatorLoading, isSuperAdmin, router]);
  
  useEffect(() => {
    if (error) {
        toast({
            title: "Permission Error",
            description: "You do not have permission to view operators. Please contact an administrator if you believe this is a mistake.",
            variant: "destructive",
            duration: 10000,
        });
    }
  }, [error, toast]);

  const filteredOperators = useMemo(() => {
    if (!operators) return [];
    return operators.filter(op =>
      op.UserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (op.Attributes && op.Attributes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      op.UID.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [operators, searchQuery]);

  const handleDelete = async (uid: string, username: string) => {
      try {
        const result = await deleteOperator(uid);
        if (result.success) {
            toast({
                title: "Operator Deleted",
                description: `Successfully deleted operator ${username}.`
            });
        } else {
            throw new Error(result.error || "An unknown error occurred.");
        }
      } catch (error: any) {
          toast({
              title: "Deletion Failed",
              description: error.message,
              variant: "destructive",
          });
      }
  };
  
  if (isUserLoading || isOperatorLoading) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }

  if (!isSuperAdmin) {
     return (
       <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
            <Ban className="w-24 h-24 text-destructive mb-4" />
            <h1 className="text-4xl font-headline text-destructive">Access Restricted</h1>
            <p className="text-xl text-muted-foreground mt-2">Only Super Admins can access this page.</p>
             <Button onClick={() => router.push('/Arena/Home')} className="mt-8">Go to Arena Home</Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-headline text-primary">Operator Management</h1>
            <p className="text-muted-foreground">Manage system administrators and operators.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Operator
        </Button>
      </header>

      <div className="mb-6 relative w-full max-w-md">
          <Input 
            placeholder="Search by username, attribute, or UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Super Admin</TableHead>
              <TableHead>Attributes</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>UID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
            ) : error ? (
                <TableRow><TableCell colSpan={6} className="text-center h-24 text-destructive font-semibold">Permission Denied: Could not load operators.</TableCell></TableRow>
            ) : filteredOperators.length > 0 ? (
              filteredOperators.map((op) => (
                <TableRow key={op.id}>
                  <TableCell className="font-medium">{op.UserName}</TableCell>
                  <TableCell>{op.SuperAdmin}</TableCell>
                  <TableCell className="text-muted-foreground">{op.Attributes || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">{op.Remarks || '-'}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{op.UID}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                       <Button variant="outline" size="icon" onClick={() => setEditingOperator(op)}><Edit className="h-4 w-4" /><span className="sr-only">Edit</span></Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /><span className="sr-only">Delete</span></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the operator account for <strong className="font-bold">{op.UserName}</strong> and remove their data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(op.UID, op.UserName)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center h-24">No operators found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogContent><DialogHeader><DialogTitle>Create New Operator</DialogTitle><DialogDescription>This will create a new user in Firebase Authentication and a corresponding document in the Operators collection.</DialogDescription></DialogHeader><CreateOperatorForm setOpen={setCreateOpen} /></DialogContent>
       </Dialog>

       <Dialog open={!!editingOperator} onOpenChange={(isOpen) => !isOpen && setEditingOperator(null)}>
        <DialogContent>
            <DialogHeader><DialogTitle>Edit Operator</DialogTitle><DialogDescription>Modify the details for {editingOperator?.UserName}.</DialogDescription></DialogHeader>
            {editingOperator && <EditOperatorForm operator={editingOperator} setOpen={(isOpen) => !isOpen && setEditingOperator(null)} />}
        </DialogContent>
       </Dialog>
    </div>
  );
}
