"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Users,
  MessageSquare,
  Briefcase,
  ClipboardList,
  FileText,
} from "lucide-react";

const routes = [
  { id: 1, title: "Batches", route: "/admin/batches", icon: Users },
  { id: 2, title: "Courses", route: "/admin/courses", icon: BookOpen },
  { id: 3, title: "Enrollments", route: "/admin/enrollments", icon: ClipboardList },
  { id: 4, title: "Forum", route: "/forum", icon: MessageSquare },
  { id: 5, title: "Graduates", route: "/admin/graduates", icon: GraduationCap },
  { id: 6, title: "Job Portal", route: "/admin/job-portal", icon: Briefcase },
  { id: 7, title: "Mock Tests", route: "/admin/mock-tests", icon: FileText },
];

const Dashboard = () => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 p-6">
      {routes.map((data) => {
        const Icon = data.icon;
        return (
          <Link href={data.route} key={data.id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl text-center transition-all duration-300 hover:bg-white/20 flex flex-col items-center gap-3">
                <Icon className="h-6 w-6 text-black/80" />
                <span className="md:text-sm text-xs">{data.title}</span>
              </Card>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

export default Dashboard;
