"use client";

import { Badge } from "@mantine/core";

export const MealType = (mealType: string | undefined) => {
  switch (mealType) {
    case "lunch":
      return (
        <Badge variant="light" radius="sm">
          중식
        </Badge>
      );
    case "breakfast":
      return (
        <Badge radius={"sm"} variant="light" color="yellow">
          조식
        </Badge>
      );
    default:
      "dinner";
      return (
        <Badge radius={"sm"} variant="light" color="violet">
          석식
        </Badge>
      );
  }
};
