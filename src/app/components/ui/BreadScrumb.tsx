"use client";
import { Anchor, Group, ThemeIcon, Title } from "@mantine/core";
import React from "react";
import IconArrowRight from "/public/icons/arrow-right.svg";
import Link from "next/link";

function BreadScrumb({ level }: any) {
  return (
    <Group align="center">
      {level.map((item: any, index: number, arr: any) => (
        <Group align="center" gap={"xs"} key={index}>
          <Anchor
            component={Link}
            href={item.href}
            key={index}
            // order={4}
            fz={"h4"}
            fw={arr.length !== index + 1 ? 500 : 600}
            c={arr.length !== index + 1 ? "dimmed" : "black"}
          >
            {item.title}
          </Anchor>
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
