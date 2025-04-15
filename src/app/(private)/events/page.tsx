import { auth } from "@clerk/nextjs/server";
import { CalendlyWidget } from "./CalendlyWidget";

export const revalidate = 0;

export default async function EventsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="p-10 bg-[#FAF3E0] min-h-screen">
        <h1 className="text-3xl font-bold text-[#5C4033] mb-4">Not Authenticated</h1>
        <p className="text-[#2E2E2E] mb-4">Please sign in to book a training session.</p>
      </div>
    );
  }

  const calendlyToken = process.env.CALENDLY_TOKEN;
  if (!calendlyToken) {
    return (
      <div className="p-10 bg-[#FAF3E0] min-h-screen">
        <h1 className="text-3xl font-bold text-[#5C4033] mb-4">Configuration Error</h1>
        <p className="text-[#2E2E2E] mb-4">Calendly configuration is missing. Please contact support.</p>
      </div>
    );
  }

  const schedulingOptions = [
    {
      name: "Advanced Training",
      description: "90-minute session for advanced commands and complex behaviors",
      duration: "90 minutes",
      url: `https://calendly.com/thrivingspace/advance-training?token=${calendlyToken}`
    }
  ];

  return (
    <div className="container mx-auto  px-2">
     
      
      <div className="max-w-2xl mx-auto">
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