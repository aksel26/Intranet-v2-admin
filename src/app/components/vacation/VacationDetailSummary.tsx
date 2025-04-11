import { LeaveSummaryRoot } from "@/app/type/vacationDetail";
import { ActionIcon, Badge, Box, Button, Divider, Group, Paper, Popover, Stack, Text, Title } from "@mantine/core";
import { IconChevronRight, IconDots, IconInfoCircle } from "@tabler/icons-react";
import React from "react";
const CountText = ({ children }: any) => {
  return <Text size="xs">{children} 개</Text>;
};
const LabelText = ({ children }: any) => {
  return (
    <Text size="xs" w={70}>
      {children}
    </Text>
  );
};
const VacationDetailSummary = ({ leaveUsageStats, leaveSummary }: LeaveSummaryRoot) => {
  if (!leaveSummary || !leaveUsageStats) return;

  const {
    userName,
    gradeName,
    hqName,
    teamName,
    totalAnnualLeaveUsage,
    joinDate,
    yearsSinceJoin,
    oneYearAfterJoin,
    totalAnnualLeaveBalance,
    totalReceivedAnnualLeave,
  } = leaveSummary;

  const {
    fullLeaveUsage,
    halfLeaveUsage,
    quarterLeaveUsage,
    specialLeaveUsage,
    alternativeLeaveUsage,
    sickLeaveUsage,
    trainingLeaveUsage,
    familyEventLeaveUsage,
    healthLeaveUsage,
    totalReceivedSpecialLeave,
    totalReceivedAlternativeLeave,
  } = leaveUsageStats;

  return (
    <Stack gap={"lg"} my={"lg"}>
      <Group align="flex-end">
        <Title order={3}>{userName} </Title>
        <Text fw={500} fz={"sm"}>
          {gradeName}
        </Text>

        <Text fw={500} fz={"sm"}>
          {hqName}
        </Text>

        <Text fw={500} fz={"sm"}>
          {teamName}
        </Text>
      </Group>
      <Group align="flex-start" gap={100}>
        <Stack gap={4}>
          <Group>
            <Paper shadow={"0"} p="xs">
              <Stack gap={2} w={160}>
                <Text c={"dimmed"} fz={"sm"}>
                  입사일
                </Text>
                <Text fw={600} fz={"md"}>
                  {joinDate}
                </Text>
              </Stack>
            </Paper>
            <Paper shadow={"0"} p="xs">
              <Stack gap={2} w={160}>
                <Text c={"dimmed"} fz={"sm"}>
                  근속년수
                </Text>
                <Text fw={600} fz={"md"}>
                  {yearsSinceJoin}
                </Text>
              </Stack>
            </Paper>
            <Paper shadow={"0"} p="xs">
              <Stack gap={2} w={160}>
                <Text c={"dimmed"} fz={"sm"}>
                  만 1년날짜
                </Text>
                <Text fw={600} fz={"md"}>
                  {oneYearAfterJoin}
                </Text>
              </Stack>
            </Paper>
          </Group>
          <Group>
            <Paper shadow={"0"} p="xs">
              <Stack gap={2} w={160}>
                <Text c={"dimmed"} fz={"sm"}>
                  총 연차 갯수
                </Text>
                <Text fw={600} fz={"md"}>
                  {totalReceivedAnnualLeave}
                </Text>
              </Stack>
            </Paper>
            <Paper shadow={"0"} p="xs">
              <Stack gap={2} w={160} align="start">
                <Text c={"dimmed"} fz={"sm"}>
                  사용연차 갯수(2024)
                </Text>

                <Popover width={"auto"} position="bottom-start" withArrow shadow="md">
                  <Popover.Target>
                    <Button variant="subtle" size="compact-md" rightSection={<IconChevronRight strokeWidth={1.1} size={18} />}>
                      {totalAnnualLeaveUsage}
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown py={"md"}>
                    <Paper bg={"white"} radius={"lg"}>
                      <Title order={6} mb={"xs"}>
                        휴가/연차 유형별 사용 현황
                      </Title>
                      <Stack gap={"xs"} align="start">
                        <Group align="center" justify="space-around">
                          <LabelText>연차</LabelText>
                          <CountText>{fullLeaveUsage}</CountText>
                        </Group>
                        <Group align="center" justify="space-around">
                          <LabelText>반차</LabelText>
                          <CountText>{halfLeaveUsage}</CountText>
                        </Group>
                        <Group align="center" justify="space-around">
                          <LabelText>반반차</LabelText>
                          <CountText>{quarterLeaveUsage}</CountText>
                        </Group>
                        <Divider w={"100%"} />
                        <Group align="center" justify="space-around">
                          <LabelText>보건휴가</LabelText>
                          <CountText>{healthLeaveUsage}</CountText>
                        </Group>
                        <Group align="center" justify="space-around">
                          <LabelText>특별 휴무</LabelText>
                          <CountText>{`${specialLeaveUsage} / ${totalReceivedSpecialLeave}`}</CountText>
                        </Group>
                        <Group align="center" justify="space-around">
                          <LabelText>경조 휴무</LabelText>
                          <CountText>{familyEventLeaveUsage}</CountText>
                        </Group>
                        <Group align="center" justify="space-around">
                          <LabelText>병가</LabelText>
                          <CountText>{sickLeaveUsage}</CountText>
                        </Group>
                        <Group align="center" justify="space-around">
                          <LabelText>대체 휴무</LabelText>
                          <CountText>{`${alternativeLeaveUsage} / ${totalReceivedAlternativeLeave}`}</CountText>
                        </Group>
                        <Group align="center" justify="space-around">
                          <LabelText>훈련</LabelText>
                          <CountText>{trainingLeaveUsage}</CountText>
                        </Group>
                      </Stack>

                      <Divider my={"xs"} />
                      <Text fz={"xs"}>* 반반차는 0.25 차감입니다.</Text>
                      <Text fz={"xs"}>* 무급(보건)휴가는 연말정산됩니다.</Text>
                    </Paper>
                  </Popover.Dropdown>
                </Popover>
              </Stack>
            </Paper>
            <Paper shadow={"0"} p="xs">
              <Stack gap={2} w={160}>
                <Text c={"dimmed"} fz={"sm"}>
                  잔여 연차 갯수
                </Text>
                <Text fw={600} fz={"md"}>
                  {totalAnnualLeaveBalance}
                </Text>
              </Stack>
            </Paper>

            <Stack gap={2}>
              <Group gap={4}>
                <Text c={"dimmed"} fz={"sm"}>
                  중도입사 연차 부여 개수
                </Text>
                <Popover withArrow>
                  <Popover.Target>
                    <ActionIcon variant="transparent">
                      <IconInfoCircle width="20" height="20" />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Stack>
                      <Stack gap={1}>
                        <Text fz={"sm"}>전년도 재직일 수</Text>
                        <Text fz={"sm"}>280일</Text>
                      </Stack>
                      <Box>
                        <Text fz={"sm"}>15일 x 전년도 재직일 수 / 365</Text>
                        <Text fz="sm" fw={600}>
                          = 4.75일
                        </Text>
                      </Box>
                    </Stack>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              <Text fw={600} fz={"md"}>
                4.75
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

export default VacationDetailSummary;
