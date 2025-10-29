'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
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
import { Loader2, PlusCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { appConfig } from '@/app/config';
import { createOperator } from '@/app/actions';

type Operator = {
  id: string;
  UserName: string;
  SuperAdmin: 'Yes' | 'No';
  Attributes: string;
  Remarks: string;
};

const operatorSchema = z.object({
  email: z.string().email('A valid email is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  UserName: z.string().min(2, 'Username is required.'),
  SuperAdmin: z.enum(['Yes', 'No']),
  Attributes: z.string().optional(),
  Remarks: z.string().optional(),
});

function CreateOperatorForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof operatorSchema>>({
    resolver: zodResolver(operatorSchema),
    defaultValues: {
      email: '',
      password: '',
      UserName: '',
      SuperAdmin: 'No',
      Attributes: '',
      Remarks: '',
    },
  });

  async function onSubmit(values: z.infer<typeof operatorSchema>) {
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="operator@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="UserName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl><Input placeholder="e.g., admin_jane" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="SuperAdmin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Super Admin</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Is this a super admin?" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Attributes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attributes (comma-separated)</FormLabel>
              <FormControl><Input placeholder="e.g., reports,billing" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl><Input placeholder="Optional notes" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Operator
            </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function OperatorsPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (appConfig.maintenance) {
      router.push('/Arena/Home');
    }
  }, [router]);
  
  const operatorsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'operators');
  }, [firestore]);

  const { data: operators, isLoading } = useCollection<Operator>(operatorsQuery);

  const filteredOperators = useMemo(() => {
    if (!operators) return [];
    return operators.filter(op =>
      op.UserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.Attributes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [operators, searchQuery]);

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredOperators.length > 0 ? (
              filteredOperators.map((op) => (
                <TableRow key={op.id}>
                  <TableCell className="font-medium">{op.UserName}</TableCell>
                  <TableCell>{op.SuperAdmin}</TableCell>
                  <TableCell className="text-muted-foreground">{op.Attributes || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">{op.Remarks || '-'}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{op.id}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">No operators found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Operator</DialogTitle>
                    <DialogDescription>
                        This will create a new user in Firebase Authentication and a corresponding document in the Operators collection.
                    </DialogDescription>
                </DialogHeader>
                <CreateOperatorForm setOpen={setCreateOpen} />
            </DialogContent>
       </Dialog>
    </div>
  );
}
