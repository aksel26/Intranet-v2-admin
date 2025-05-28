"use client";

import { Grid, Paper, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import Attendance from "../components/main/Attendance";
import MonthlyDrink from "../components/main/MonthlyDrink";
import Notice from "../components/main/Notice";
import LunchGroup from "../components/meal/config";
function page() {
  return (
    <>
      <Stack mb="sm" gap={"xs"}>
        <Title order={5}>안녕하세요 👋</Title>
        <Title c={"gray.5"} order={5}>
          오늘은{" "}
          <Text c={"gray.9"} component="span" fw={600}>
            {dayjs().format("YYYY-MM-DD dddd")}
          </Text>{" "}
          입니다.
        </Title>
      </Stack>
      <Grid>
        {/* <Grid.Col span={1.5}>
          <Paper shadow="lg" p="lg" radius={"lg"}>
            <Text fw={500}>오늘의 출근율</Text>
            <Text fz={"xl"} fw={700}>
              80%
            </Text>
            <Text fz="sm" c={"dimmed"}>
              30명 / 40명
            </Text>
          </Paper>
        </Grid.Col> */}
        <Grid.Col span={6}>
          <Attendance />
        </Grid.Col>
        <Grid.Col span={6}>
          <Notice />
        </Grid.Col>
        <Grid.Col span={3}>
          <LunchGroup />
        </Grid.Col>
        <Grid.Col span={3}>
          <MonthlyDrink />
        </Grid.Col>
      </Grid>
    </>
  );
}

export default page;
