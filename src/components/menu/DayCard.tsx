import ItemCard from "@/components/menu/ItemCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item } from "@/pages/Menu";

interface DayCardProps {
  items: Item[];
  day: string;
}

export function DayCard({ items, day }: DayCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="text-xl text-gray-800">{day}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
