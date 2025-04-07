"use client";
import { Avatar, Button, Divider, Group, List, Loader, LoadingOverlay, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import LunchGroupDrawer from "./drawer";
import { useQuery } from "@tanstack/react-query";
import { getLunchGroup } from "@/app/api/get/getApi";
import dayjs from "dayjs";

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
    <Avatar color="blue" radius="md" size={"sm"}>
      <Text fz={"xs"}>{`${groupNumber}조`}</Text>
    </Avatar>
  );
};

interface TLunchGroupInit {
  total: undefined | number | string;
  perGroup: undefined | number | string;
  notice: readonly string[] | undefined | number | null;
  sDate: null | Date;
  eDate: null | Date;
  groups: any[];
}
const LunchGroup = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data, isLoading: lunchGroupLoading, isError: lunchGroupError } = useQuery({ queryKey: ["lunchGroup"], queryFn: () => getLunchGroup() });

  const lunchGroup = data?.data.data;
  console.log("🚀 ~ LunchGroup ~ lunchGroup:", lunchGroup);
  const [initialValue, setInitialValue] = useState<TLunchGroupInit>({
    total: undefined,
    perGroup: undefined,
    notice: null,
    sDate: null,
    eDate: null,
    groups: [],
  });
  return (
    <Paper shadow="lg" p="lg" radius={"lg"}>
      <Group justify="space-between" mb={"sm"}>
        <Text fw={500}>점심조 현황</Text>
        <Button variant="subtle" size="compact-sm" onClick={open}>
          설정
        </Button>
      </Group>
      {lunchGroupLoading ? (
        <Loader />
      ) : (
        <>
          <Group gap={"xl"} mb={"sm"}>
            <LabelStack label="총원" value={lunchGroup.total} />
            <LabelStack label="조별 인원" value={lunchGroup.perGroup} />
            <LabelStack
              label="점심조 기간"
              value={`${dayjs(lunchGroup.sDate).format("MM월 DD일 dddd")} ~ ${dayjs(lunchGroup.eDate).format("MM월 DD일 dddd")}`}
            />
          </Group>
          {!lunchGroup?.groups ? (
            <Text ta={"center"} c={"dimmed"} py={"lg"}>
              점심조 진행을 위해 <br />
              우측 '점심조 설정'에서 설정을 먼저 진행해 주세요.
            </Text>
          ) : (
            <ScrollArea flex={1}>
              <List spacing="xs" size="sm" center>
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
