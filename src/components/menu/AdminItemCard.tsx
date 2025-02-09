import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { baseUrl } from "@/default";
import { Item, SpiceOption } from "@/pages/Menu";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface AdminItemCardProps {
  item: Item;
}

export default function AdminItemCard({ item }: AdminItemCardProps) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [basePrice, setBasePrice] = useState(item.base_price.toString());
  const [spiceOptions, setSpiceOptions] = useState<SpiceOption[]>(
    item.spice_options,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const updatedItem: Item = {
        ...item,
        name,
        description,
        base_price: parseFloat(basePrice),
        spice_options: spiceOptions,
      };

      await axios.put(baseUrl("/item/update"), updatedItem);
    } catch (error) {
      console.error("Failed to update item:", error);
      alert("Failed to update item");
    } finally {
      setIsUpdating(false);
    }
  };

  const addSpiceOption = () => {
    setSpiceOptions([...spiceOptions, { name: "", description: "" }]);
  };

  const updateSpiceOption = (
    index: number,
    field: keyof SpiceOption,
    value: string,
  ) => {
    const newOptions = [...spiceOptions];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value,
    };
    setSpiceOptions(newOptions);
  };

  const removeSpiceOption = (index: number) => {
    setSpiceOptions(spiceOptions.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${item.id}`}>Name</Label>
              <Input
                id={`name-${item.id}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Item name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${item.id}`}>Description</Label>
              <Textarea
                id={`description-${item.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Item description"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`price-${item.id}`}>Base Price ($)</Label>
              <Input
                id={`price-${item.id}`}
                type="number"
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="Base price"
              />
            </div>

            {/* Spice Options */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Spice Options</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSpiceOption}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Spice Level
                </Button>
              </div>
              {spiceOptions.map((option, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    value={option.name}
                    onChange={(e) =>
                      updateSpiceOption(index, "name", e.target.value)
                    }
                    placeholder="Spice level name"
                    className="w-40"
                  />
                  <Input
                    value={option.description}
                    onChange={(e) =>
                      updateSpiceOption(index, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSpiceOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              onClick={handleUpdate}
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Item"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
