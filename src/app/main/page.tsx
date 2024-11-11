"use client";

import { Grid, Paper, Skeleton, Stack, Text } from "@mantine/core";
import React from "react";

function page() {
  return (
    <Grid>
      <Grid.Col>
        <Paper shadow="lg" p="lg" radius={"lg"}>
          <Text fw={700}>현재 점심조 현황</Text>
          <Skeleton h={100} />
        </Paper>
      </Grid.Col>

      <Grid.Col span={7}>
        <Paper shadow="lg" p="lg" radius={"lg"}>
          <Text fw={700}>활동비 사용 현황</Text>
          <Stack>
            <Skeleton h={"sm"} />
            <Skeleton h={"sm"} />
            <Skeleton h={"sm"} />
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span={5}>
        <Paper shadow="lg" p="lg" radius={"lg"}>
          <Text fw={700}>떠든 사람</Text>
          <Stack>
            <Skeleton h={"sm"} />
            <Skeleton h={"sm"} />
            <Skeleton h={"sm"} />
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}

export default page;
