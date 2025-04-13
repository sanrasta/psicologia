"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Basic Obedience",
      description: "Master essential commands and build a strong foundation for your dog's training journey.",
      price: "$199",
      duration: "6 weeks",
      image: "/doggy.png",
      features: [
        "Sit, Stay, Come commands",
        "Leash walking basics",
        "Socialization techniques",
        "Basic problem-solving"
      ]
    },
    {
      id: 2,
      title: "Advanced Training",
      description: "Take your dog's skills to the next level with complex commands and advanced techniques.",
      price: "$299",
      duration: "8 weeks",
      image: "/doggy.png",
      features: [
        "Off-leash training",
        "Advanced commands",
        "Behavior modification",
        "Competition preparation"
      ]
    },
    {
      id: 3,
      title: "Puppy Training",
      description: "Start your puppy off right with essential socialization and basic training skills.",
      price: "$149",
      duration: "4 weeks",
      image: "/doggy.png",
      features: [
        "Puppy socialization",
        "House training",
        "Basic commands",
        "Bite inhibition"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F0FF] to-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#2E2E2E]">
            Our <span className="text-[#9B5DE5]">Training Courses</span>
          </h1>
          <p className="text-xl text-[#2E2E2E]/80 max-w-2xl mx-auto">
            Choose the perfect training program for your dog's needs and start your journey to a better-behaved companion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-[#2E2E2E]">{course.title}</h3>
                  <span className="text-[#9B5DE5] font-bold">{course.price}</span>
                </div>
                <p className="text-[#2E2E2E]/70 mb-4">{course.description}</p>
                <div className="mb-6">
                  <h4 className="font-semibold text-[#2E2E2E] mb-2">Course Features:</h4>
                  <ul className="space-y-2">
                    {course.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-[#2E2E2E]/70">
                        <span className="text-[#9B5DE5] mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#2E2E2E]/60">{course.duration}</span>
                  <Button className="bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] hover:from-[#F15BB5] hover:to-[#9B5DE5] text-white">
                    Enroll Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 