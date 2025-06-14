"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  //Handle logout and remove comments from browser storage
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("comments");
    router.replace("/login");
  };

  return (
    <nav className="fixed-top navbar navbar-expand-lg navbar-light bg-gray-400 py-3 px-2">
      <div className="container-fluid font-sans">
        <Link
          href="/"
          className="navbar-brand text-gray-700 font-bold tracking-wide"
        >
          MyApp
        </Link>

        <div className="d-flex align-items-center ms-auto position-relative">
          <button
            className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
            type="button"
            id="profileDropdown"
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
          >
            <span>My Profile</span>
          </button>

          {dropdownOpen && (
            <ul
              className="dropdown-menu dropdown-menu-end show mt-2"
              aria-labelledby="profileDropdown"
              style={{ position: "absolute", top: "100%", right: 0 }}
            >
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
