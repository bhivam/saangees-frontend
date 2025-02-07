import { DayCard } from "@/components/menu/DayCard";
import Nav from "@/components/Nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/default";
import axios from "axios";
import { useEffect, useState } from "react";

interface SizeOption {
  name: string;
  price_modifier: number;
}

interface SpiceOption {
  name: string;
  description: string;
}

export interface Item {
  id: number;
  name: string;
  date: string; // Will be received as ISO string from API
  description: string;
  base_price: number;
  size_options: SizeOption[];
  spice_options: SpiceOption[];
}

interface GroupedItems {
  [key: string]: Item[];
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

export default function RestaurantPage() {
  const [menu, setMenu] = useState<GroupedItems>({});

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await axios.get<Item[]>(baseUrl("/item/week"));
        console.log(response.data)

        // Group items by date
        const grouped = response.data.reduce((acc: GroupedItems, item) => {
          const date = new Date(item.date);
          const dayKey = date.toISOString().split("T")[0];

          if (!acc[dayKey]) {
            acc[dayKey] = [];
          }
          acc[dayKey].push(item);
          return acc;
        }, {});

        setMenu(grouped);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    }
    fetchMenu();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Nav />
      {/* Menu Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(menu).map(([date, items]) =>
            DayCard({ items, day: days[new Date(date).getDay()] }),
          )}
        </div>
      </div>
    </div>
  );
}
