"use server";

import { z } from "zod";
import { db } from "@/drizzle/db";
import { sql } from "drizzle-orm";

// Contact form validation schema
const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  message: z.string().min(1, { message: "Message is required" })
});

// Function to store contact submissions in the database
export async function submitContactForm(formData: FormData) {
  try {
    // Parse form data
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      message: formData.get('message') as string
    };
    
    // Validate the data
    const validatedData = ContactFormSchema.safeParse(data);
    
    if (!validatedData.success) {
      return { 
        success: false, 
        message: "Invalid form data", 
        errors: validatedData.error.flatten().fieldErrors 
      };
    }
    
    // Check if contacts table exists, if not create it
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "contacts" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "phone" TEXT,
          "message" TEXT NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
    } catch (error) {
      console.error("Error creating contacts table:", error);
      return { success: false, message: "Error creating contacts table" };
    }
    
    // Insert contact form data into database
    await db.execute(sql`
      INSERT INTO "contacts" ("name", "email", "phone", "message")
      VALUES (${data.name}, ${data.email}, ${data.phone || null}, ${data.message});
    `);
    
    // In a real-world app, you would also send an email notification here
    // using an email service like SendGrid or Resend
    
    return { 
      success: true, 
      message: "Your message has been received. We'll get back to you soon!" 
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { 
      success: false, 
      message: "An error occurred while submitting the form. Please try again." 
    };
  }
} 