import CreateItemForm from "@/components/menu/CreateItemForm";
import { DayCard } from "@/components/menu/DayCard";
import Nav from "@/components/Nav";
import { useAuth } from "@/context/AuthContext";
import { baseUrl } from "@/default";
import axios from "axios";
import { useEffect, useState } from "react";

export interface SpiceOption {
  name: string;
  description: string;
}

export interface Item {
  id: number;
  name: string;
  date: string;
  description: string;
  base_price: number;
  spice_options: SpiceOption[];
}

interface GroupedItems {
  [key: string]: Item[];
}

export default function Menu() {
  const [menu, setMenu] = useState<GroupedItems>({});

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await axios.get<Item[]>(baseUrl("/item/week"));
        console.log("RESPONSE", response.data);

        const ordered = response.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

        const grouped = ordered.reduce((acc: GroupedItems, item) => {
          const dayKey = item.date;
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

  async function handleCreateItem(newItem: Omit<Item, "id">) {
    try {
      const response = await axios.post(baseUrl("/item/create"), newItem);

      const date = new Date(newItem.date);
      const dayKey = date.toISOString().split("T")[0];
      setMenu((prev) => {
        if (!prev[dayKey]) {
          return { ...prev, [dayKey]: [response.data] };
        }
        return { ...prev, [dayKey]: [...prev[dayKey], response.data] };
      });
    } catch (error) {
      console.error("Failed to create item:", error);
      alert("Failed to create item");
    }
  }

  const dayValues: { [key: string]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="container mx-auto px-4 py-12">
        {isAuthenticated && user?.is_admin && (
          <div className="mb-5">
            <CreateItemForm onSubmit={handleCreateItem} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(menu)
            .sort((a, b) => (dayValues[a[0]] > dayValues[b[0]] ? -1 : 1))
            .map(([date, items]) => (
              <DayCard key={date} items={items} date={date} />
            ))}
        </div>
      </div>
    </div>
  );
}
