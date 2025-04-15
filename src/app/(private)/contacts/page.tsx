import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ContactsPageClient from "./ContactsPageClient";

export default async function ContactsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return <ContactsPageClient />;
} 