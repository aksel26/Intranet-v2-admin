"use client";

import { Grid, Paper, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import Attendance from "../components/main/Attendance";
import Notice from "../components/main/Notice";
import SearchBar from "../components/main/SearchBar";
import LunchGroup from "../components/meal/config";
function page() {
  return (
    <Grid>
      <Grid.Col>
        <SearchBar />
      </Grid.Col>
      <Grid.Col span={12} ml={5}>
        <Title order={5}>안녕하세요 👋</Title>
        <Title c={"gray.5"} order={5}>
          오늘은{" "}
          <Text c={"gray.9"} component="span" fw={600}>
            {dayjs().format("YYYY-MM-DD dddd")}
          </Text>{" "}
          입니다.
        </Title>
      </Grid.Col>
      <Grid.Col span={2} h={"100%"}>
        <Paper shadow="lg" p="lg" radius={"lg"} h={"100%"}>
          <Text fw={500}>오늘의 출근율</Text>
          <Text fz={"xl"} fw={700}>
            80%
          </Text>
          <Text fz="sm" c={"dimmed"}>
            30명 / 40명
          </Text>
          {/* <Skeleton h={100} /> */}
        </Paper>
      </Grid.Col>
      <Grid.Col span={5}>
        <Attendance />
      </Grid.Col>
      <Grid.Col span={5}>
        <LunchGroup />
      </Grid.Col>

      <Grid.Col span={6}>
        <Notice />
      </Grid.Col>

      {/* <Grid.Col span={9}>
        <Paper shadow="lg" p="lg" radius={"lg"}>
          <Text fw={500}>활동비 사용 현황</Text>
          <Stack>
            <Skeleton h={"sm"} />
            <Skeleton h={"sm"} />
            <Skeleton h={"sm"} />
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper shadow="lg" p="lg" radius={"lg"}>
          <Text fw={500}>떠든 사람</Text>
          <Stack>
            <Skeleton h={"sm"} />
            <Skeleton h={"sm"} />
            <Skeleton h={"sm"} />
          </Stack>
        </Paper>
      </Grid.Col> */}
    </Grid>
  );
}

export default page;
