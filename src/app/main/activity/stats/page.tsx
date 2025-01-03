"use client";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Input,
  Menu,
  NumberFormatter,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import Adjust from "/public/icons/adjustments-alt.svg";

function page() {
  return (
    <>
      <Title order={3} mb={"xl"}>
        복지포인트 통계
      </Title>
      <Grid>
        <Grid.Col span={2}>
          <Paper shadow="xl" radius={"lg"} p={"md"}>
            <Text fw={700} size="md" mb={"xs"}>
              기본 복지포인트 금액
            </Text>
            <NumberFormatter value={230000} thousandSeparator suffix="원" />
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper shadow="xl" radius={"lg"} p={"md"}>
            <Text fw={700} size="md" mb={"xs"}>
              이전 달 평균 초과금액{" "}
            </Text>
            <NumberFormatter value={51000} thousandSeparator suffix="원" />
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper shadow="xl" radius={"lg"} p={"md"}>
            <Text fw={700} size="md" mb={"xs"}>
              이전 달 초과금액 미정산자{" "}
            </Text>
            <Stack>
              <Skeleton h={"sm"} />
              <Skeleton h={"sm"} />
              <Skeleton h={"sm"} />
              <Skeleton h={"sm"} />
              <Skeleton h={"sm"} />
              <Skeleton h={"sm"} />
              <Skeleton h={"sm"} />
              <Skeleton h={"sm"} />
            </Stack>
            {/* <NumberFormatter value={51000} thousandSeparator suffix="원" /> */}
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}

export default page;
