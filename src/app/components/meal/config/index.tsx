"use client";
import { getLunchGroup } from "@/app/api/get/getApi";
import { Avatar, Button, Divider, Group, List, Loader, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
import LunchGroupDrawer from "./drawer";
import { IconChevronRight } from "@tabler/icons-react";

const LabelStack = ({ label, value }: { label: string; value: string }) => {
  return (
    <Stack gap={1}>
      <Text c={"dimmed"} fz={"sm"}>
        {label}
      </Text>
      <Text styles={{ root: { whiteSpace: "pre-wrap" } }} fz={"sm"}>
        {value}
      </Text>
    </Stack>
  );
};
const GroupNumber = ({ groupNumber }: { groupNumber: number }) => {
  return (
    <Avatar color="blue" radius="md" size={"sm"} w={34}>
      <Text fz={"xs"}>{`${groupNumber}조`}</Text>
    </Avatar>
  );
};

const LunchGroup = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data, isLoading: lunchGroupLoading, isError: lunchGroupError } = useQuery({ queryKey: ["lunchGroup"], queryFn: () => getLunchGroup() });

  const lunchGroup = data?.data.data;
  console.log("🚀 ~ LunchGroup ~ lunchGroup:", lunchGroup);

  return (
    <Paper shadow="lg" p="lg" radius={"lg"}>
      <Stack gap={4}>
        <Group justify="space-between">
          <Text fw={600}>점심조 현황</Text>
          <Button variant="subtle" size="compact-xs" onClick={open} rightSection={<IconChevronRight size={14} />}>
            설정
          </Button>
        </Group>
        <Text fz={"sm"} c={"dimmed"}>{`${dayjs(lunchGroup?.sDate).format("MM월 DD일 dddd")} ~ ${dayjs(lunchGroup?.eDate).format("MM월 DD일 dddd")}`}</Text>
      </Stack>
      {lunchGroupLoading ? (
        <Group justify="center" py={"lg"}>
          <Loader size={"sm"} />
        </Group>
      ) : (
        <>
          <Group gap={"xl"} my={"lg"} align="flex-start">
            <LabelStack label="총원" value={lunchGroup?.total} />
            <LabelStack label="조별 인원" value={lunchGroup?.perGroup} />

            <LabelStack label="월/금 점심조" value={lunchGroup?.notice} />
          </Group>
          {!lunchGroup?.groups ? (
            <Text ta={"center"} c={"dimmed"} py={"lg"} fz={"xs"}>
              점심조가 설정되지 않았습니다.
              <br />
              점심조 설정을 통해 점심조를 설정해 주세요.
            </Text>
          ) : (
            <ScrollArea flex={1}>
              <List spacing="xs" size="sm" center mah={250}>
                {Object.entries(lunchGroup?.groups)?.map((item: any, index: number) => (
                  <List.Item icon={<GroupNumber groupNumber={item[0]} />} key={index}>
                    <Group gap={"sm"} ml={0}>
                      {item[1].length === 0 ? (
                        <Text size="xs" c={"dimmed"}>
                          아직 배정인원이 없어요.
                        </Text>
                      ) : (
                        item[1].map((name: string, index: number, arr: any) => {
                          return (
                            <React.Fragment key={index}>
                              <Text size="xs">{name}</Text>
                              {arr.length === index + 1 ? null : <Divider orientation="vertical" size={"xs"} />}
                            </React.Fragment>
                          );
                        })
                      )}
                    </Group>
                  </List.Item>
                ))}
              </List>
            </ScrollArea>
          )}
        </>
      )}
      <LunchGroupDrawer opened={opened} close={close} />
    </Paper>
  );
};

export default LunchGroup;
