"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatEventDescription } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight, Video, MapPin } from "lucide-react";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";

interface EventCardProps {
  id: string;
  isActive: boolean;
  name: string;
  durationInMinutes: number;
  description: string | null;
  clerkUserId: string;
  locationType?: string;
}

export default function EventCard({
  id,
  isActive,
  name,
  durationInMinutes,
  description,
  clerkUserId,
  locationType = "in-person",
}: EventCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const navigateToBooking = () => {
    setIsLoading(true);
    router.push(`/book/${clerkUserId}/${id}`);
  };

  // Set fallback for missing locationType to prevent errors
  const actualLocationType = locationType || "in-person";

  // Set glow color based on event type
  const glowColor = actualLocationType === "virtual" 
    ? "155, 93, 229" // purple for virtual (#9B5DE5)
    : "241, 91, 181";  // pink for in-person (#F15BB5)

  return (
    <>
      {isLoading && <Loading />}
      <motion.div
        whileHover={{ 
          y: -8,
          boxShadow: `0 10px 30px -5px rgba(${glowColor}, 0.5)`,
          scale: 1.02
        }}
        transition={{ duration: 0.3 }}
        style={{
          "--glow-color": `rgba(${glowColor}, 0.7)`,
          "--glow-color-light": `rgba(${glowColor}, 0.4)`
        } as React.CSSProperties}
        onClick={navigateToBooking}
        className="cursor-pointer"
      >
        <Card className={cn(
          "flex flex-col h-full transform transition-all duration-300 bg-white border-[#9B5DE5]/10 group",
          !isActive && "opacity-70"
        )}>
          <CardHeader className={cn("bg-gradient-to-r from-white to-[#F8F0FF] rounded-t-lg transition-all duration-300", 
            actualLocationType === "virtual" 
              ? "group-hover:from-[#9B5DE5]/30 group-hover:to-[#9B5DE5]/20" 
              : "group-hover:from-[#F15BB5]/30 group-hover:to-[#F15BB5]/20", 
            !isActive && "opacity-50"
          )}>
            <CardTitle className="flex items-center text-xl text-[#2E2E2E]">
              <span className={cn(
                "transition-colors duration-300 mr-2", 
                actualLocationType === "virtual" ? "text-[#9B5DE5] group-hover:text-[#9B5DE5]/80" : "text-[#F15BB5] group-hover:text-[#F15BB5]/80"
              )}>•</span> 
              {name}
            </CardTitle>
            <CardDescription className="flex items-center mt-2 text-[#2E2E2E]/70">
              <Clock className={cn(
                "mr-2 h-4 w-4 transition-colors duration-300", 
                actualLocationType === "virtual" ? "text-[#9B5DE5] group-hover:text-[#9B5DE5]/80" : "text-[#F15BB5] group-hover:text-[#F15BB5]/80"
              )} />
              {formatEventDescription(durationInMinutes)}
              
              {actualLocationType === "virtual" ? (
                <span className="ml-4 flex items-center">
                  <Video className="mr-1 h-4 w-4 text-[#9B5DE5] group-hover:text-[#9B5DE5]/80 transition-colors duration-300" />
                  <span className="text-[#9B5DE5] group-hover:text-[#9B5DE5]/80 transition-colors duration-300">Virtual</span>
                </span>
              ) : (
                <span className="ml-4 flex items-center">
                  <MapPin className="mr-1 h-4 w-4 text-[#F15BB5] group-hover:text-[#F15BB5]/80 transition-colors duration-300" />
                  <span className="text-[#F15BB5] group-hover:text-[#F15BB5]/80 transition-colors duration-300">In-Person</span>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          
          {description != null && (
            <CardContent className={cn("py-4 flex-grow", !isActive && "opacity-50")}>
              <p className="text-[#2E2E2E]/80">{description}</p>
            </CardContent>
          )}
          
          <CardFooter className="flex justify-center mt-auto p-4">
            <Button 
              size="lg"
              className={cn(
                "font-medium px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 group shadow-md w-full justify-center",
                actualLocationType === "virtual"
                  ? "bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] hover:from-[#F15BB5] hover:to-[#9B5DE5] text-white"
                  : "bg-gradient-to-r from-[#F15BB5] to-[#9B5DE5] hover:from-[#9B5DE5] hover:to-[#F15BB5] text-white"
              )}
            >
              Book Now
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
} 