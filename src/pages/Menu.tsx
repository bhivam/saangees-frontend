import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

// Define types for the menu item and API response
interface MenuItem {
  id: number;
  name: string;
  date: string; // ISO string format
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const mockData: MenuItem[] = [
  { id: 1, name: "Daal", date: "2025-01-22T00:00:00Z" },
  { id: 2, name: "Paneer", date: "2025-01-22T00:00:00Z" },
  { id: 3, name: "Biryani", date: "2025-01-23T00:00:00Z" },
  { id: 4, name: "Butter Chicken", date: "2025-01-23T00:00:00Z" },
  { id: 5, name: "Aloo Gobi", date: "2025-01-24T00:00:00Z" },
  { id: 6, name: "Roti", date: "2025-01-24T00:00:00Z" },
  { id: 7, name: "Chole Bhature", date: "2025-01-25T00:00:00Z" },
];

export default function Menu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Simulate API call with mock data
        const response = { data: mockData };
        setMenu(response.data);
      } catch (err) {
        setError("Failed to fetch menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const getMenuByDay = (dayIndex: number): MenuItem[] => {
    return menu.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.getDay() === dayIndex;
    });
  };

  if (loading)
    return (
      <Text fontSize="xl" textAlign="center">
        Loading...
      </Text>
    );
  if (error)
    return (
      <Text fontSize="xl" textAlign="center" color="red.500">
        {error}
      </Text>
    );

  return (
    <Container maxW="container.lg" py={6}>
      <Heading as="h1" size="xl" textAlign="center" mb={8} color="#F98128">
        Weekly Menu
      </Heading>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {daysOfWeek.map((day, index) => {
          const dayMenu = getMenuByDay(index);
          if (dayMenu.length === 0) return null;

          return (
            <Box
              key={day}
              bg="white"
              borderRadius="lg"
              p={6}
              shadow="md"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Heading as="h2" size="md" mb={4} color="gray.800">
                {day}
              </Heading>
              <VStack spacing={4} align="stretch">
                {dayMenu.map((item) => (
                  <Box
                    key={item.id}
                    bg="#F9F9F9"
                    borderRadius="md"
                    p={4}
                    borderWidth="1px"
                    borderColor="gray.300"
                    position="relative"
                  >
                    <Heading as="h3" size="sm" mb={2} color="gray.700">
                      {item.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                    <Text mt={2} fontSize="sm" color="gray.600">
                      Delicious and healthy meal.
                    </Text>
                    <Text mt={2} fontWeight="bold" color="gray.800">
                      $9.99
                    </Text>
                    <Button
                      size="sm"
                      position="absolute"
                      top={2}
                      right={2}
                      bg="#6CD0D0"
                      color="white"
                      _hover={{ bg: "#58b8b8" }}
                      borderRadius="full"
                      p={2}
                      shadow="sm"
                    >
                      <FiPlus size={16} />
                    </Button>
                  </Box>
                ))}
              </VStack>
            </Box>
          );
        })}
      </Grid>
    </Container>
  );
}
