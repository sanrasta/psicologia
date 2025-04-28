import { auth } from "@clerk/nextjs/server";
import { CalendlyWidget } from "./CalendlyWidget";

export const revalidate = 0;

export default async function EventsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="p-10 bg-[#F8F9FA] min-h-screen">
        <h1 className="text-3xl font-bold text-[#4A6FA5] mb-4">Not Authenticated</h1>
        <p className="text-[#2E2E2E] mb-4">Please sign in to book a therapy session.</p>
      </div>
    );
  }

  const calendlyToken = process.env.CALENDLY_TOKEN;
  if (!calendlyToken) {
    return (
      <div className="p-10 bg-[#F8F9FA] min-h-screen">
        <h1 className="text-3xl font-bold text-[#4A6FA5] mb-4">Configuration Error</h1>
        <p className="text-[#2E2E2E] mb-4">Scheduling configuration is missing. Please contact support.</p>
      </div>
    );
  }

  const schedulingOptions = [
    {
      name: "Initial Consultation",
      description: "60-minute session to discuss your needs and determine the best therapeutic approach",
      duration: "60 minutes",
      url: `https://calendly.com/blancastella/initial-consultation?token=${calendlyToken}`
    },
    {
      name: "Individual Therapy",
      description: "50-minute session for ongoing individual therapy",
      duration: "50 minutes",
      url: `https://calendly.com/blancastella/individual-therapy?token=${calendlyToken}`
    },
    {
      name: "Couples Counseling",
      description: "75-minute session for couples therapy",
      duration: "75 minutes",
      url: `https://calendly.com/blancastella/couples-counseling?token=${calendlyToken}`
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[#4A6FA5] mb-8">Schedule Your Session</h1>
      <p className="text-center text-[#2E2E2E] mb-12 max-w-2xl mx-auto">
        Choose from our available therapy sessions below. Each session is designed to provide you with the support and guidance you need on your journey to wellness.
      </p>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {schedulingOptions.map((option) => (
          <CalendlyWidget
            key={option.name}
            name={option.name}
            description={option.description}
            duration={option.duration}
            url={option.url}
          />
        ))}
      </div>
    </div>
  );
}