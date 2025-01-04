"use client";
import { Group, ThemeIcon, Title } from "@mantine/core";
import React from "react";
import IconArrowRight from "/public/icons/arrow-right.svg";

function BreadScrumb({ level }: any) {
  return (
    <Group align="center">
      {level.map((item: any, index: number, arr: any) => (
        <Group align="center" gap={"xs"} key={index}>
          <Title
            key={index}
            order={4}
            fw={arr.length !== index + 1 ? 500 : 600}
            c={arr.length !== index + 1 ? "dimmed" : "black"}
          >
            {item.title}
          </Title>
          {arr.length !== index + 1 ? (
            <ThemeIcon color="gray" variant="transparent">
              <IconArrowRight />
            </ThemeIcon>
          ) : null}
        </Group>
      ))}
    </Group>
  );
}

export default BreadScrumb;
