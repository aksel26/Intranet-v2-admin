"use client";
import { getLunchGroup } from "@/app/api/get/getApi";
import { manualAssignLunchGroup, resetLunchGroup } from "@/app/api/post/postApi";
import classes from "@/app/styles/lunchGroup.module.css";
import { adjustGroupArrays } from "@/app/utils/lunchGroup";
import notification from "@/app/utils/notification";
import { Avatar, Box, Button, Checkbox, Divider, Group, Loader, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import LunchGroupDrawer from "./drawer";

const LabelStack = ({ label, value }: { label: string; value: string }) => {
  return (
    <Stack gap={1}>
      <Text c={"dimmed"} fz={"sm"}>
        {label}
      </Text>
      <Text styles={{ root: { whiteSpace: "pre-wrap" } }} fz={"xs"}>
        {value}
      </Text>
    </Stack>
  );
};
const GroupNumber = ({ groupNumber }: { groupNumber: number }) => {
  return (
    <Avatar color="blue" radius="md" size={"sm"} w={40}>
      <Text fz={"xs"}>{`${groupNumber}조`}</Text>
    </Avatar>
  );
};

const GroupDisplay = ({ data, matches }: any) => {
  // Convert the object keys to an array and sort them numerically
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (values: any) => resetLunchGroup(values),
  });

  const reset = (userIdx: number) => {
    mutate(
      {
        userIdx: userIdx,
      },
      {
        onSuccess: () => {
          notification({ message: "점심조 배정이 취소되었습니다.", title: "점심조 설정", color: "green" });
          // Invalidate the query to refetch the updated data
          queryClient.invalidateQueries({ queryKey: ["lunchGroup"] });
        },
        onError: (error: any) => {
          notification({ message: error.response?.data?.message || "점심조 배정 중 문제가 발생하였습니다.", title: "점심조 초기화", color: "red" });
        },
      }
    );
  };

  const result = adjustGroupArrays(data);
  const groupNumbers = Object.keys(result.groups);

  return (
    <>
      {groupNumbers.map((groupNumber) => {
        const members = result.groups[groupNumber];
        // Skip rendering if the group has no members
        if (members.length === 0) return null;

        return (
          <Group wrap="nowrap" key={`group-${groupNumber}`} mb="xs" align="start">
            <GroupNumber groupNumber={parseInt(groupNumber)} />
            <Group gap={"sm"} align="center" flex={1}>
              {members.map((member: any, index: number) => {
                if (!member) {
                  return (
                    <Box key={`blank${index}`} fz={"xs"} w={44} style={{ border: "2px dotted var(--mantine-color-gray-4)", borderRadius: 5 }} py={2} px={5} c={"gray.6"} ta={"center"}>
                      ?
                    </Box>
                  );
                }
                return (
                  <Text
                    key={member.userIdx}
                    style={{
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      ":hover": {
                        color: "var(--mantine-color-gray-5)",
                      },
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "var(--mantine-color-gray-5)";
                      e.target.style.transform = "rotate(10deg)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "";
                      e.target.style.transform = "";
                    }}
                    py={1.5}
                    px={5}
                    fz={"xs"}
                    onClick={() => reset(member.userIdx)}
                  >
                    {member.userName}
                  </Text>
                );
              })}
            </Group>
          </Group>
        );
      })}
    </>
  );
};

const LunchGroup = () => {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const { data, isLoading: lunchGroupLoading, isError: lunchGroupError } = useQuery({ queryKey: ["lunchGroup"], queryFn: () => getLunchGroup() });
  const { mutate } = useMutation({
    mutationFn: (values: any) => manualAssignLunchGroup(values),
  });
  const lunchGroup = data?.data.data;

  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const handleAssign = () => {
    if (selectedStaff.length < 1) {
      notification({ message: "배정할 인원을 선택해 주세요.", title: "점심조 배정", color: "yellow" });
      return;
    }
    mutate(
      { targetUserIdxs: selectedStaff.map((userIdx) => parseInt(userIdx)) },
      {
        onSuccess: () => {
          notification({ message: "점심조가 배정되었습니다.", title: "점심조 배정", color: "green" });
          queryClient.invalidateQueries({ queryKey: ["lunchGroup"] });
          close();
        },
        onError: (error: any) => {
          notification({ message: error.response?.data?.message || "점심조 배정에 실패하였습니다.", title: "점심조 배정", color: "red" });
        },
      }
    );
    setSelectedStaff([]);
  };

  const cards = lunchGroup?.unAssigned.map((staff: any) => (
    <Checkbox.Card className={classes.root} radius="md" value={staff.userIdx.toString()} key={staff.userIdx} w={"max-content"} py={4}>
      <Text fz={"xs"}>{staff.userName}</Text>
    </Checkbox.Card>
  ));

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
          <Group gap={"md"} my={"lg"} align="flex-start">
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
              <GroupDisplay data={lunchGroup} />
            </ScrollArea>
          )}
        </>
      )}
      <Divider my={"md"} />
      <Group justify="space-between">
        <Text fz={"sm"}>❓ 미추첨 인원</Text>
        <Button size="xs" variant="light" onClick={handleAssign}>
          배정하기
        </Button>
      </Group>
      <Group mt={"xs"}>
        <Checkbox.Group value={selectedStaff} onChange={setSelectedStaff}>
          <Group>{cards}</Group>
        </Checkbox.Group>
      </Group>
      <LunchGroupDrawer opened={opened} close={close} details={lunchGroup} />
    </Paper>
  );
};

export default LunchGroup;
