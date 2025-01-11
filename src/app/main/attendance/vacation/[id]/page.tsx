"use client";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import BreadCrumb from "@/app/components/ui/BreadCrumb";
import { VACATION_DETAIL } from "@/app/enums/breadcrumbs";
import { VACATION_DETAIL_HEADER } from "@/app/enums/tableHeader";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Combobox,
  Divider,
  Flex,
  Group,
  Paper,
  Popover,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  Title,
  useCombobox,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import IconInfo from "/public/icons/info-circle.svg";
const groceries = [
  "🍎 Apples",
  "🍌 Bananas",
  "🥦 Broccoli",
  "🥕 Carrots",
  "🍫 Chocolate",
];

function page() {
  const elements = Array.from({ length: 41 }, (_, index) => {
    return {
      year: 2024,
      date: "01-23 (수)",
      authName: "전전전",
      isAuth: "승인",
      type: "반반차",
      count: 0.25,
      remain: 13,
      updatedAt: "2024-12-12",
      createdAt: "2024-12-02",
      authAt: "2024-12-02",
    };
  });

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const router = useRouter();
  const goBack = () => router.back();
  return (
    <Flex
      direction={"column"}
      h={"100%"}
      styles={{ root: { overflow: "hidden" } }}
    >
      <BreadCrumb level={VACATION_DETAIL} />

      <Stack gap={"lg"} my={"lg"}>
        <Group align="flex-end">
          <Title order={3}>정진옥 </Title>
          <Text fw={500} fz={"sm"}>
            팀장
          </Text>
          <Divider size={"xs"} orientation="vertical" />
          <Text fw={500} fz={"sm"}>
            ACG 본부
          </Text>
          <Divider size={"xs"} orientation="vertical" />
          <Text fw={500} fz={"sm"}>
            Assessment 1팀
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
                    2002-12-11
                  </Text>
                </Stack>
              </Paper>
              <Paper shadow={"0"} p="xs">
                <Stack gap={2} w={160}>
                  <Text c={"dimmed"} fz={"sm"}>
                    근속년수
                  </Text>
                  <Text fw={600} fz={"md"}>
                    10년
                  </Text>
                </Stack>
              </Paper>
              <Paper shadow={"0"} p="xs">
                <Stack gap={2} w={160}>
                  <Text c={"dimmed"} fz={"sm"}>
                    만 1년날짜
                  </Text>
                  <Text fw={600} fz={"md"}>
                    2003-12-10
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
                  <Badge
                    color="green"
                    size="lg"
                    variant="light"
                    radius="sm"
                    styles={{
                      label: { fontSize: "var(--mantine-font-size-md)" },
                    }}
                  >
                    15개
                  </Badge>
                </Stack>
              </Paper>
              <Paper shadow={"0"} p="xs">
                <Stack gap={2} w={160}>
                  <Text c={"dimmed"} fz={"sm"}>
                    사용연차 갯수(2024)
                  </Text>
                  <Text fw={600} fz={"md"}>
                    10개
                  </Text>
                </Stack>
              </Paper>
              <Paper shadow={"0"} p="xs">
                <Stack gap={2} w={160}>
                  <Text c={"dimmed"} fz={"sm"}>
                    잔여 연차 갯수
                  </Text>
                  <Text fw={600} fz={"md"}>
                    5개
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
                        <IconInfo width="20" height="20" />
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

          <Paper shadow={"0"} p="xs">
            <Text c={"dimmed"} fz={"sm"} mb={2}>
              종류별 사용현황
            </Text>
            <Group align="flex-start" gap={"lg"}>
              <Stack gap={2}>
                <Group>
                  <Text w={40} fz={"sm"}>
                    연차
                  </Text>
                  <Text fz={"sm"}>1개</Text>
                </Group>
                <Group>
                  <Text w={40} fz={"sm"}>
                    반차
                  </Text>
                  <Text fz={"sm"}>1개</Text>
                </Group>
                <Group>
                  <Text w={40} fz={"sm"}>
                    반반차
                  </Text>
                  <Text fz={"sm"}>1개</Text>
                </Group>
                <Group>
                  <Text w={40} fz={"sm"}>
                    연차
                  </Text>
                  <Text fz={"sm"}>1개</Text>
                </Group>
              </Stack>
              <Divider orientation="vertical" variant="dashed" />
              <Stack gap={2}>
                <Group>
                  <Text w={60} fz={"sm"}>
                    대체휴무
                  </Text>
                  <Text fz={"sm"}>1개</Text>
                </Group>
                <Group>
                  <Text w={60} fz={"sm"}>
                    훈련
                  </Text>
                  <Text fz={"sm"}>1개</Text>
                </Group>
                <Group>
                  <Text w={60} fz={"sm"}>
                    경조휴무
                  </Text>
                  <Text fz={"sm"}>1개</Text>
                </Group>
                <Group>
                  <Text w={60} fz={"sm"}>
                    특별휴무
                  </Text>
                  <Text fz={"sm"}>1개</Text>
                </Group>
                <Group>
                  <Text w={60} fz={"sm"}>
                    병가
                  </Text>
                  <Text fz={"sm"}>1개</Text>
                </Group>
                <Group>
                  <Text w={60} fz={"sm"}>
                    보건휴가
                  </Text>
                  <Text fz={"sm"}>1개</Text>
                </Group>
              </Stack>
            </Group>
          </Paper>
        </Group>
      </Stack>
      {/* <Divider my={"lg"} /> */}

      <Group gap={"xl"} justify="space-between">
        <Select
          styles={{
            input: {
              fontSize: "var(--mantine-font-size-lg)",
              fontWeight: 600,
            },
          }}
          label="회계연도"
          variant="unstyled"
          defaultValue={"2024년"}
          data={["2022년", "2023년", "2024년", "2025년"]}
        />
        <Group>
          <Button>휴가 부여하기</Button>
          <Button>다운로드</Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table
          striped={elements?.length < 1 ? false : true}
          stickyHeader
          highlightOnHover={elements?.length < 1 ? false : true}
        >
          <TableHeader columns={VACATION_DETAIL_HEADER} />
          <TableBody data={elements} columns={VACATION_DETAIL_HEADER}>
            {elements?.map((element: any, index: number) => (
              <Table.Tr key={index}>
                <Table.Td>{element.year}</Table.Td>
                <Table.Td>{element.date}</Table.Td>
                <Table.Td>{element.authName}</Table.Td>
                <Table.Td>{element.isAuth}</Table.Td>
                <Table.Td>
                  <Select
                    variant="unstyled"
                    data={["반반차", "연차", "반차", "Svelte"]}
                    value={element.type}
                    w={100}
                  />
                </Table.Td>

                <Table.Td>{element.count}</Table.Td>
                <Table.Td>{element.remain}</Table.Td>
                <Table.Td>{element.updatedAt}</Table.Td>
                <Table.Td>{element.createdAt}</Table.Td>
                <Table.Td>{element.authAt}</Table.Td>
                <Table.Td>
                  <Button color="red" variant="light" size="xs">
                    삭제
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
            {/* <MealExpenses data={mealsData} /> */}
          </TableBody>
        </Table>
      </ScrollArea>
    </Flex>
  );
}

export default page;
