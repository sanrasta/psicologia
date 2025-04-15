"use client";

import { InlineWidget } from "react-calendly";

interface CalendlyWidgetProps {
  name: string;
  description: string;
  duration: string;
  url: string;
}

export function CalendlyWidget({ name, description, duration, url }: CalendlyWidgetProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-[#5C4033] mb-2">{name}</h3>
      <p className="text-[#2E2E2E] mb-4">{description}</p>
      <p className="text-sm text-[#2E2E2E]/70 mb-4">Duration: {duration}</p>
      <div className="h-[600px]">
        <InlineWidget
          url={url}
          styles={{
            height: "100%",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
} 