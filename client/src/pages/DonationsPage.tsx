import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Donation, Member, InsertDonation, BankAccount } from "@shared/schema";
import { api } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDonationSchema } from "@shared/schema";
import { Plus, Search, Landmark, Receipt, Banknote, Copy, Check, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useBankAccounts, useCreateBankAccount, useDeleteBankAccount } from "@/hooks/use-notifications";

export default function DonationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data: donations = [], isLoading: loadingDonations } = useQuery<Donation[]>({
    queryKey: [api.donations.list.path],
  });

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: [api.members.list.path],
  });

  const { data: bankAccounts = [] } = useBankAccounts();
  const createBankAccount = useCreateBankAccount();
  const deleteBankAccount = useDeleteBankAccount();

  const mutation = useMutation({
    mutationFn: async (data: InsertDonation) => {
      const res = await fetch(api.donations.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to record donation");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.donations.list.path] });
      toast({ title: "Success", description: "Donation recorded successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const form = useForm<InsertDonation>({
    resolver: zodResolver(insertDonationSchema),
    defaultValues: {
      amount: 0,
      type: "tithe",
      date: new Date().toISOString().split("T")[0],
      memberId: null,
      donorName: "",
      notes: "",
    },
  });

  const bankForm = useForm({
    defaultValues: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      bankCode: "",
      currency: "NGN",
      notes: "",
    },
  });

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  const filteredDonations = donations.filter(d => 
    d.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function copyToClipboard(text: string, id: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({ title: "Copied!", description: "Account number copied to clipboard" });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to copy" });
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Finances" 
        description="Manage church donations, tithes, and offerings"
      >
        <div className="flex gap-2">
          <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Banknote className="mr-2 h-4 w-4" />
                Bank Accounts
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Church Bank Accounts</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {bankAccounts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No bank accounts added yet.
                  </p>
                )}
                {bankAccounts.map((account: BankAccount) => (
                  <Card key={account.id} className="relative">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{account.bankName}</h4>
                          <p className="text-sm text-muted-foreground">{account.accountName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                              {account.accountNumber}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => copyToClipboard(account.accountNumber, account.id)}
                            >
                              {copiedId === account.id ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {account.bankCode && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Sort Code: {account.bankCode}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteBankAccount.mutate(account.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <form onSubmit={bankForm.handleSubmit((data) => {
                  createBankAccount.mutate(data, {
                    onSuccess: () => {
                      bankForm.reset();
                    },
                  });
                })} className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm">Add Bank Account</h4>
                  <Input {...bankForm.register("bankName")} placeholder="Bank Name (e.g. GTBank)" required />
                  <Input {...bankForm.register("accountName")} placeholder="Account Name" required />
                  <Input {...bankForm.register("accountNumber")} placeholder="Account Number" required />
                  <Input {...bankForm.register("bankCode")} placeholder="Sort Code (Optional)" />
                  <Button type="submit" className="w-full" size="sm">
                    Add Account
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-donation">
                <Plus className="mr-2 h-4 w-4" />
                Record Donation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Donation</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="memberId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member (Optional)</FormLabel>
                        <Select 
                          onValueChange={(v) => field.onChange(v === "none" ? null : parseInt(v))} 
                          value={field.value?.toString() || "none"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Non-member / Guest</SelectItem>
                            {members.map(m => (
                              <SelectItem key={m.id} value={m.id.toString()}>
                                {m.firstName} {m.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!form.watch("memberId") && (
                    <FormField
                      control={form.control}
                      name="donorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Donor Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Guest Name" value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (Cents)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} value={field.value || 0} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tithe">Tithe</SelectItem>
                              <SelectItem value="offering">Offering</SelectItem>
                              <SelectItem value="pledge">Pledge</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                              <SelectItem value="welfare">Welfare</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Record Donation"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      {/* Bank Giving Info */}
      {bankAccounts.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Bank Transfer Giving
            </CardTitle>
            <CardDescription>
              Make your tithes and offerings via bank transfer to any of the accounts below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bankAccounts.map((account: BankAccount) => (
                <Card key={account.id} className="bg-white">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Landmark className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">{account.bankName}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Account Name:</p>
                    <p className="font-medium text-sm mb-2">{account.accountName}</p>
                    <p className="text-xs text-muted-foreground mb-1">Account Number:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono font-bold text-lg">
                        {account.accountNumber}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => copyToClipboard(account.accountNumber, account.id)}
                      >
                        {copiedId === account.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {account.bankCode && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Sort Code: {account.bankCode}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalDonations / 100).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime recorded donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">Total records</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Donation History</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.map((donation) => {
                const member = members.find(m => m.id === donation.memberId);
                return (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.date ? format(new Date(donation.date), "MMM d, yyyy") : "N/A"}</TableCell>
                    <TableCell>
                      {member ? `${member.firstName} ${member.lastName}` : donation.donorName || "Anonymous"}
                    </TableCell>
                    <TableCell className="capitalize">{donation.type}</TableCell>
                    <TableCell className="text-right font-medium">${(donation.amount / 100).toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
              {filteredDonations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    No donations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}