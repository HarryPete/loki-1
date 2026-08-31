"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  GraduationCap,
  BookOpen,
  Users,
  MessageSquare,
  Briefcase,
  ClipboardList,
  FileText,
  Group,
  ScreenShare,
  PersonStanding,
  FileQuestion,
  Paperclip
} from "lucide-react";

const routes = [
  { id: 1, title: "Batches", route: "/admin/batches", icon: Group, roles: ["admin"] },
  { id: 2, title: "Courses", route: "/admin/courses", icon: BookOpen, roles: ["admin"] },
  { id: 3, title: "Display", route: "/admin/display", icon: ScreenShare, roles: ["admin"] },
  { id: 4, title: "Enrollments", route: "/admin/enrollments", icon: ClipboardList, roles: ["admin"] },
  { id: 5, title: "Forum", route: "/forum", icon: MessageSquare, roles: ["admin", "maintainer"] },
  { id: 6, title: "Graduates", route: "/admin/graduates", icon: GraduationCap, roles: ["admin"] },
  { id: 7, title: "Jobs Listing", route: "/jobs", icon: Briefcase, roles: ["admin", "maintainer", "user"] },
  { id: 8, title: "Post Job", route: "/admin/postJob", icon: PersonStanding, roles: ["admin", "maintainer"] },
  { id: 9, title: "Mock Tests", route: "/admin/mock-tests", icon: FileText, roles: ["admin"] },
  { id: 10, title: "Profiles", route: "/admin/profiles", icon: Users, roles: ["admin"] },
  { id: 11, title: "Articles", route: "/admin/articles", icon: Paperclip, roles: ["admin", "maintainer"] }
];

const Dashboard = () => {
  const { data, status } = useSession();
  const role = data?.user?.role;

  if (status === "loading") {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const visibleRoutes = routes.filter((r) => r.roles.includes(role));

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 p-6">
      {visibleRoutes.map((data) => {
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
              <Card className="p-6 bg-neutral-50 backdrop-blur-lg shadow-lg rounded-2xl text-center transition-all duration-300 hover:bg-yellow-400 flex flex-col items-center gap-3">
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