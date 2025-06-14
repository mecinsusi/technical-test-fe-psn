import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); //first open the page redirect to login page
}
