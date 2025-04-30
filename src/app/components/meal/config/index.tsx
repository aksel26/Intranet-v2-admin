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
      <Text fz={"sm"}>{value}</Text>
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

  return (
    <Paper shadow="lg" p="lg" radius={"lg"}>
      <Group justify="space-between" mb={"sm"}>
        <Stack gap={4}>
          <Text fw={600}>점심조 현황</Text>
          <Text fz={"sm"} c={"dimmed"}>{`${dayjs(lunchGroup?.sDate).format("MM월 DD일 dddd")} ~ ${dayjs(lunchGroup?.eDate).format("MM월 DD일 dddd")}`}</Text>
        </Stack>
        <Button variant="subtle" size="compact-xs" onClick={open} rightSection={<IconChevronRight size={14} />}>
          설정
        </Button>
      </Group>
      {lunchGroupLoading ? (
        <Group justify="center" py={"lg"}>
          <Loader size={"sm"} />
        </Group>
      ) : (
        <>
          <Group gap={"xl"} my={"lg"}>
            <LabelStack label="총원" value={lunchGroup.total} />
            <LabelStack label="조별 인원" value={lunchGroup.perGroup} />

            <LabelStack label="월/금 점심조" value={lunchGroup.notice} />
          </Group>
          {!lunchGroup?.groups ? (
            <Text ta={"center"} c={"dimmed"} py={"lg"}>
              점심조 진행을 위해 <br />
              우측 '점심조 설정'에서 설정을 먼저 진행해 주세요.
            </Text>
          ) : (
            <ScrollArea flex={1}>
              <List spacing="xs" size="sm" center mah={250}>
                {Object.entries(lunchGroup.groups)?.map((item: any, index: number) => (
                  <List.Item icon={<GroupNumber groupNumber={item[0]} />} key={index}>
                    <Group gap={"xl"} ml={0}>
                      {item[1].length === 0 ? (
                        <Text size="xs" c={"dimmed"}>
                          아직 배정인원이 없어요.
                        </Text>
                      ) : (
                        item[1].map((name: string, index: number, arr: any) => {
                          return (
                            <React.Fragment key={index}>
                              <Text size="sm">{name}</Text>
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
