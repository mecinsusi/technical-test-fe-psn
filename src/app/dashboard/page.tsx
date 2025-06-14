import Header from "@/components/header";
import { TableComponent } from "@/components/table";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default function DashboardPage() {
  const user = cookies().get("session_user")?.value;
  if (!user) redirect("/login");

  return (
    <div>
      <Header />
      <TableComponent />
    </div>
  );
}
