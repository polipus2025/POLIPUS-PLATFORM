import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, FileText, Tag, CalendarPlus } from "lucide-react";
import { Link } from "wouter";

export default function QuickActions() {
  const actions = [
    {
      title: "New Inspection",
      icon: ClipboardCheck,
      href: "/data-entry?type=inspection",
      color: "hover:border-lacra-blue hover:bg-blue-50"
    },
    {
      title: "Generate Report",
      icon: FileText,
      href: "/reports",
      color: "hover:border-lacra-green hover:bg-green-50"
    },
    {
      title: "Issue Tag",
      icon: Tag,
      href: "/data-entry?type=certification",
      color: "hover:border-warning hover:bg-orange-50"
    },
    {
      title: "Schedule Inspection",
      icon: CalendarPlus,
      href: "/inspections",
      color: "hover:border-purple-500 hover:bg-purple-50"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className={`flex flex-col items-center p-4 h-auto border-2 border-dashed ${action.color} transition-colors w-full`}
              >
                <action.icon className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">{action.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
