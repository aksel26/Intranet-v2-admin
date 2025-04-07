"use client";

import { Button, Grid, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import SearchBar from "../components/main/SearchBar";
import LunchGroup from "../components/meal/config";
function page() {
  return (
    <Grid>
      <Grid.Col>
        <SearchBar />
      </Grid.Col>
      <Grid.Col span={2}>
        <Paper shadow="lg" p="lg" radius={"lg"}>
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
        <Paper shadow="lg" p="lg" radius={"lg"}>
          <Group justify="space-between">
            <Group gap={"xs"}>
              <Text fw={500}>직원 근태 현황</Text>
              <Text c={"dimmed"} fz={"sm"}>
                2025-01-23
              </Text>
            </Group>
            <Button variant="subtle" size="compact-sm">
              자세히 보기
            </Button>
          </Group>

          <Text fz={"sm"}>자세히보기 누르면 출퇴근 내역으로</Text>
          <Text>ㅁㄴㅇㅁㄴㅇㄹ</Text>
          <Text>ㅁㄴㅇㅁㄴㅇㄹ</Text>
          <Text>ㅁㄴㅇㅁㄴㅇㄹ</Text>
          {/* <Skeleton h={100} /> */}
        </Paper>
      </Grid.Col>
      <Grid.Col span={5}>
        <Paper shadow="lg" p="lg" radius={"lg"}>
          <Group justify="space-between">
            <Group gap={"xs"}>
              <Text fw={500}>금일 일정</Text>
              <Text c={"dimmed"} fz={"sm"}>
                2025-01-23
              </Text>
            </Group>
            <Button variant="subtle" size="compact-sm">
              자세히 보기
            </Button>
          </Group>
          <Text>[외근] CJ ENM 미팅</Text>
          <Text>ㅁㄴㅇㅁㄴㅇㄹ</Text>
          <Text>ㅁㄴㅇㅁㄴㅇㄹ</Text>
          <Text>ㅁㄴㅇㅁㄴㅇㄹ</Text>
          <Text>ㅁㄴㅇㅁㄴㅇㄹ</Text>
          {/* <Skeleton h={100} /> */}
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <Paper shadow="lg" p="lg" radius={"lg"}>
          <Group justify="space-between">
            <Text fw={500}>공지사항</Text>
            <Button variant="subtle" size="compact-sm">
              자세히 보기
            </Button>
          </Group>
          <Text fz={"sm"}>자세히보기 누르면 공지사항 조회 페이지로</Text>
          <Text>ㅁㄴㅇㅁㄴㅇㄹ</Text>
          <Text>ㅁㄴㅇㅁㄴㅇㄹ</Text>
          <Text>ㅁㄴㅇㅁㄴㅇㄹ</Text>
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <LunchGroup />
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
