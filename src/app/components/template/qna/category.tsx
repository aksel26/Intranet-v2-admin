"use client";

import { Badge, Checkbox } from "@mantine/core";

export const categoryTag = (category: string) => {
  switch (category) {
    case "question":
      return (
        <Badge radius={"sm"} variant="light" color="blue">
          문의
        </Badge>
      );
    case "bug":
      return (
        <Badge radius={"sm"} variant="light" color="orange">
          버그
        </Badge>
      );
    default:
      "proposal";
      return (
        <Badge radius={"sm"} variant="light" color="grape">
          제안
        </Badge>
      );
  }
};

export const replyStatusTag = (status: string | undefined) => {
  switch (status) {
    case "Y":
      return (
        <Badge radius={"sm"} variant="light" color="teal">
          완료
        </Badge>
      );
    case "N":
      return (
        <Badge radius={"sm"} variant="light" color="gray">
          미완료
        </Badge>
      );
  }
};
