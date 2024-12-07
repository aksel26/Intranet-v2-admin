"use client";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import {
  MEAL_EXPENSES_HEADER,
  VACATION_DETAIL_HEADER,
} from "@/app/enums/tableHeader";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  List,
  Pill,
  Popover,
  ScrollArea,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import IconInfo from "/public/icons/info-circle.svg";
import IconBack from "/public/icons/arrow-left.svg";
import { useRouter } from "next/navigation";

function page() {
  const elements = Array.from({ length: 41 }, (_, index) => {
    return {
      year: 2024,
      date: "01-23 (수)",
      type: "반반차",
      count: 0.25,
      remain: 13,
    };
  });
  const router = useRouter();
  const goBack = () => router.back();
  return (
    <Flex
      direction={"column"}
      h={"100%"}
      styles={{ root: { overflow: "hidden" } }}
    >
      <Group justify="cetner" align="center" gap={4}>
        <Button
          onClick={goBack}
          leftSection={<IconBack width="15" height="15" />}
          variant="transparent"
          color="gray"
          styles={{ root: { paddingLeft: 0, fontWeight: 500 } }}
        >
          직원 휴가 관리
        </Button>
      </Group>

      <Stack gap={"lg"} mb={"lg"}>
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

        <Stack gap={0}>
          <Title order={6} mb={4}>
            휴가 상세정보
          </Title>
          <Stack gap={4}>
            <Group>
              <Stack gap={4} w={160}>
                <Text fz={"sm"}>입사일</Text>
                <Text fz={"sm"}>2002-12-11</Text>
              </Stack>
              <Stack gap={4} w={160}>
                <Text fz={"sm"}>근속년수</Text>
                <Text fz={"sm"}>10년</Text>
              </Stack>
              <Stack gap={4} w={160}>
                <Text fz={"sm"}>만 1년날짜</Text>
                <Text fz={"sm"}>2003-12-10</Text>
              </Stack>

              <Stack gap={4}>
                <Group gap={4}>
                  <Text fz={"sm"}>중도입사 연차 부여 개수</Text>
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
                <Text fz={"sm"}>4.75</Text>
              </Stack>
            </Group>

            <Divider my={1} />

            <Group>
              <Stack gap={4} w={160}>
                <Text fz={"sm"}>총 연차 갯수</Text>
                <Text fz={"sm"}>15개</Text>
              </Stack>
              <Stack gap={4} w={160}>
                <Text fz={"sm"}>사용연차 갯수(2024)</Text>
                <Text fz={"sm"}>10개</Text>
              </Stack>
              <Stack gap={4} w={160}>
                <Text fz={"sm"}>잔여 연차 갯수</Text>
                <Text fz={"sm"}>5개</Text>
              </Stack>

              <Stack gap={4} w={160}>
                <Text fz={"sm"}>사용 휴가 상세</Text>
                <Text fz={"sm"}>????</Text>
              </Stack>
            </Group>
          </Stack>
        </Stack>
      </Stack>
      {/* <Divider my={"lg"} /> */}

      <Group gap={"xl"} justify="space-between">
        <Select
          label="회계연도"
          variant="unstyled"
          defaultValue={"2024년"}
          data={["2022년", "2023년", "2024년", "2025년"]}
        />

        <Group>
          <Button>휴가 추가하기</Button>
          <Button>휴가 차감하기</Button>
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
                <Table.Td>{element.type}</Table.Td>

                <Table.Td>{element.count}</Table.Td>
                <Table.Td>{element.remain}</Table.Td>
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
