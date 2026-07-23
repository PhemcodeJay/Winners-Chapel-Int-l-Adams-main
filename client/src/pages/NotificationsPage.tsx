import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, History, Clock, CheckCircle, XCircle } from "lucide-react";
import { useMembers } from "@/hooks/use-members";
import { useEvents } from "@/hooks/use-events";
import { useNotificationTemplates, useSendNotification, useNotificationLog } from "@/hooks/use-notifications";
import { format } from "date-fns";

const predefinedTemplates = [
  {
    id: "event_reminder",
    name: "Event Reminder",
    subject: "Reminder: {{event_title}}",
    description: "Send event reminders to members",
  },
  {
    id: "birthday",
    name: "Birthday Greeting",
    subject: "Happy Birthday {{name}}!",
    description: "Send birthday wishes to members",
  },
  {
    id: "announcement",
    name: "General Announcement",
    subject: "{{subject_line}}",
    description: "Send a custom announcement to members",
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedTemplate, setSelectedTemplate] = useState("announcement");
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const { data: members = [] } = useMembers();
  const { data: events = [] } = useEvents();
  const { data: templates = [] } = useNotificationTemplates();
  const { data: log = [] } = useNotificationLog();
  const sendMutation = useSendNotification();

  const template = predefinedTemplates.find(t => t.id === selectedTemplate);

  function getRecipients() {
    if (recipientType === "all") {
      return members
        .filter(m => m.email)
        .map(m => ({
          email: m.email!,
          name: `${m.firstName} ${m.lastName}`,
        }));
    }
    if (recipientType === "member" && selectedMemberId) {
      const member = members.find(m => m.id === parseInt(selectedMemberId));
      if (member?.email) {
        return [{
          email: member.email,
          name: `${member.firstName} ${member.lastName}`,
        }];
      }
    }
    return [];
  }

  async function handleSend() {
    const recipients = getRecipients();
    if (recipients.length === 0) {
      return;
    }

    sendMutation.mutate({
      template: { subject: customSubject || template?.subject || "", body: customBody || "" },
      recipients,
      customSubject: customSubject || undefined,
      customBody: customBody || undefined,
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notifications"
        description="Send email notifications to church members"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="compose">
            <Send className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Email Notification</CardTitle>
              <CardDescription>
                Choose a template and send emails to church members. Members must have email addresses saved in their profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedTemplates.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {template && (
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder={template?.subject || "Email subject"}
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use placeholders: {'{{name}}'}, {'{{event_title}}'}, {'{{event_date}}'}
                </p>
              </div>

              {/* Body */}
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Write your message here..."
                  className="min-h-[200px]"
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Supports HTML for formatting. Use {'{{name}}'} for member name, {'{{church_name}}'} for church name.
                </p>
              </div>

              {/* Recipients */}
              <div className="space-y-2">
                <Label>Recipients</Label>
                <Select value={recipientType} onValueChange={setRecipientType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members with Email</SelectItem>
                    <SelectItem value="member">Specific Member</SelectItem>
                  </SelectContent>
                </Select>

                {recipientType === "member" && (
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members
                        .filter(m => m.email)
                        .map(m => (
                          <SelectItem key={m.id} value={m.id.toString()}>
                            {m.firstName} {m.lastName} ({m.email})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Button
                onClick={handleSend}
                disabled={sendMutation.isPending || getRecipients().length === 0}
                className="w-full"
              >
                {sendMutation.isPending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send to {getRecipients().length} recipient{getRecipients().length !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>View sent emails and their delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {log.map((entry: any) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-sm">
                        {entry.createdAt ? format(new Date(entry.createdAt), "MMM d, h:mm a") : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{entry.recipientName || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{entry.recipientEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{entry.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {entry.status === "sent" ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-green-600 text-sm">Sent</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-red-600 text-sm" title={entry.error || ""}>Failed</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {log.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        No notifications sent yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}