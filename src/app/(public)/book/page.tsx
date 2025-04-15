import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BookPageClient from "./BookPageClient";

export default async function BookPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return <BookPageClient userId={userId} />;
} 