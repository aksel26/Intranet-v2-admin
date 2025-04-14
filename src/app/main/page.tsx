"use client";

import { Button, Grid, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import SearchBar from "../components/main/SearchBar";
import LunchGroup from "../components/meal/config";
import Notice from "../components/main/Notice";
import Attendance from "../components/main/Attendance";
function page() {
  return (
    <Grid>
      <Grid.Col>
        <SearchBar />
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
