import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Item, SpiceOption } from "@/pages/Menu";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

interface CreateItemFormProps {
  onSubmit: (newItem: Omit<Item, "id">) => Promise<void>;
}

export default function CreateItemForm({ onSubmit }: CreateItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [spiceOptions, setSpiceOptions] = useState<SpiceOption[]>([
    { name: "Mild", description: "Not spicy at all" },
    { name: "Regular", description: "Standard spice level" },
    { name: "Spicy", description: "Adding some real heat!" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    try {
      setIsSubmitting(true);
      const newItem = {
        name,
        description,
        base_price: parseFloat(basePrice),
        date: date.toISOString(),
        spice_options: spiceOptions,
      };
      await onSubmit(newItem);

      // Reset form
      setName("");
      setDescription("");
      setBasePrice("");
      setDate(undefined);
      setSpiceOptions([
        { name: "Mild", description: "Not spicy at all" },
        { name: "Regular", description: "Standard spice level" },
        { name: "Spicy", description: "Adding some real heat!" },
      ]);
    } catch (error) {
      console.error("Failed to create item:", error);
      alert("Failed to create item");
    } finally {
      setIsSubmitting(false);
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
      <CardHeader>
        <CardTitle>Create New Menu Item</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name"
            />
          </div>
          <div className="space-y-2">
            <Label>Base Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="Base price"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Item description"
              className="h-20"
            />
          </div>
        </div>

        {/* Options Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Calendar */}
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="border rounded-lg p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="mx-auto"
              />
            </div>
          </div>

          {/* Spice Options */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Spice Options</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addSpiceOption}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {spiceOptions.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={option.name}
                    onChange={(e) =>
                      updateSpiceOption(index, "name", e.target.value)
                    }
                    placeholder="Level"
                    className="w-24 shrink-0"
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
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={
            isSubmitting || !name || !description || !basePrice || !date
          }
        >
          {isSubmitting ? "Creating..." : "Create Item"}
        </Button>
      </CardContent>
    </Card>
  );
}
