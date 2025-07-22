import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Leaf, 
  MapPin, 
  ClipboardCheck, 
  Tag, 
  FileText, 
  Plus, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Commodities", href: "/commodities", icon: Leaf },
  { name: "Regional Compliance", href: "/regional", icon: MapPin },
  { name: "Inspections", href: "/inspections", icon: ClipboardCheck },
  { name: "Export Certifications", href: "/certifications", icon: Tag },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Data Entry", href: "/data-entry", icon: Plus },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <nav className="p-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                      isActive
                        ? "text-lacra-blue bg-blue-50"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
