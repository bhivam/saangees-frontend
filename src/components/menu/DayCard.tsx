import AdminItemCard from "@/components/menu/AdminItemCard";
import ItemCard from "@/components/menu/ItemCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Item } from "@/pages/Menu";

interface DayCardProps {
  items: Item[];
  date: string;
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// TODO find out how I can make the titles sticky as I scroll
export function DayCard({ items, date }: DayCardProps) {
  const { isAuthenticated, user } = useAuth();

  const dayOfWeek = days[new Date(date).getDay()];
  const month = String(new Date(date).getMonth() + 1).padStart(2, "0");
  const dayofMonth = String(new Date(date).getDate()).padStart(2, "0");
  const MMdd = month + "/" + dayofMonth;

  return (
    <Card className="w-full relative">
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="text-xl text-gray-800">
          {dayOfWeek} - {MMdd}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {items
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) =>
              isAuthenticated && user?.is_admin ? (
                <AdminItemCard key={item.id} item={item} />
              ) : (
                <ItemCard key={item.id} item={item} />
              ),
            )}
        </div>
      </CardContent>
    </Card>
  );
}
