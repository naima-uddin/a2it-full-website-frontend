"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ChevronRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import { getSectionsByPage } from "@/lib/serviceContent/registry";

export default function ServiceContentListPage() {
  const { isAdmin, isModerator } = useAuth();
  const groups = getSectionsByPage();

  if (!isAdmin && !isModerator) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">Access Denied. Admin or Moderator only.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/dashboard/services"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0066ff] mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Edit Page Content
          </h1>
          <p className="text-slate-600">
            Edit the text &amp; images inside each service page. The design stays
            exactly the same — only the content changes.
          </p>
        </motion.div>

        {Object.keys(groups).length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            No editable sections registered yet.
          </div>
        )}

        {Object.entries(groups).map(([page, sections]) => (
          <div key={page}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">
              {page}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {sections.map((section) => (
                <Link
                  key={section.key}
                  href={`/dashboard/services/content/${section.key}`}
                  className="group flex items-center justify-between bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-[#0066ff] hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0066ff]/10 text-[#0066ff]">
                      <FileText className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {section.label}
                      </div>
                      <div className="text-xs text-slate-400">
                        {section.route}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#0066ff] transition" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
