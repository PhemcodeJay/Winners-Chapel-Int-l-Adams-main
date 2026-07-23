import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface NotificationRecipient {
  email: string;
  name?: string;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventDescription?: string;
}

export function useNotificationTemplates() {
  return useQuery<any[]>({
    queryKey: ["/api/notification-templates"],
  });
}

export function useSendNotification() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: {
      template: any;
      recipients: NotificationRecipient[];
      customSubject?: string;
      customBody?: string;
    }) => {
      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send notifications");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/notification-log"] });
      const sent = data.results.filter((r: any) => r.success).length;
      const failed = data.results.filter((r: any) => !r.success).length;
      toast({
        title: "Notifications sent",
        description: `${sent} sent successfully${failed ? `, ${failed} failed` : ""}`,
      });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });
}

export function useNotificationLog() {
  return useQuery<any[]>({
    queryKey: ["/api/notification-log"],
  });
}

export function useBankAccounts() {
  return useQuery<any[]>({
    queryKey: ["/api/bank-accounts"],
  });
}

export function useCreateBankAccount() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/bank-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add bank account");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bank-accounts"] });
      toast({ title: "Success", description: "Bank account added" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });
}

export function useDeleteBankAccount() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/bank-accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete bank account");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bank-accounts"] });
      toast({ title: "Success", description: "Bank account removed" });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });
}