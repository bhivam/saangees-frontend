import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { Item } from "@/pages/Menu";
import { useState } from "react";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { isAuthenticated } = useAuth();
  const [selectedSpice, setSelectedSpice] = useState(
    item.spice_options[0]?.name,
  );

  const handleOrder = () => {
    alert(`Ordered! (Not implemented)`);
  };

  const getPrice = () => {
    return item.base_price.toFixed(2);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
            <span className="font-semibold text-lg text-orange-600">
              ${getPrice()}
            </span>
          </div>

          {isAuthenticated && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Spice Level
                  </label>
                  <Select
                    value={selectedSpice}
                    onValueChange={setSelectedSpice}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {item.spice_options.map((spice) => (
                        <SelectItem
                          key={spice.name}
                          value={spice.name}
                          title={spice.description}
                        >
                          {spice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleOrder}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Add to Order
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
