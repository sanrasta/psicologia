"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MessageSquare, User, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

export default function ContactsPageClient() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contacts");
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast({
          title: "Error",
          description: "Failed to load contacts. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C4033]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#5C4033]">Contact Form Submissions</h1>
      
      {contacts.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">No contact form submissions yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <CardHeader className="bg-[#FAF3E0]/50 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-[#5C4033] mr-2" />
                    <CardTitle className="text-xl text-[#5C4033]">{contact.name}</CardTitle>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(contact.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <CardDescription className="flex items-center">
                    <Mail className="h-4 w-4 text-[#5C4033] mr-1" />
                    <a href={`mailto:${contact.email}`} className="text-[#5C4033] hover:underline">
                      {contact.email}
                    </a>
                  </CardDescription>
                  
                  {contact.phone && (
                    <CardDescription className="flex items-center">
                      <Phone className="h-4 w-4 text-[#5C4033] mr-1" />
                      <a href={`tel:${contact.phone}`} className="text-[#5C4033] hover:underline">
                        {contact.phone}
                      </a>
                    </CardDescription>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-[#5C4033] mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm mb-1 text-[#2E2E2E]">Message:</h3>
                    <p className="text-[#2E2E2E]/80 whitespace-pre-line">{contact.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 