"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import BlogList from "@/components/dashboard/Blog/BlogList";
import BlogCreate from "@/components/dashboard/Blog/BlogCreate";
import BlogEdit from "@/components/dashboard/Blog/BlogEdit";

export default function BlogAdminClient() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("post");
  const isCreateMode =
    searchParams.get("new") === "1" || searchParams.get("action") === "create";

  if (postId) {
    return <BlogEdit postId={postId} />;
  }

  if (isCreateMode) {
    return <BlogCreate />;
  }

  return <BlogList />;
}
