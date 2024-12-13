"use client";
import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";

import { MEAL_SETTLEMENT_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { Box, Button, Divider, Drawer, Flex, Group, ScrollArea, Stack, Table, Text, Title } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useEffect, useState } from "react";
import IconDownArrow from "/public/icons/chevron-down.svg";
import { MealSettlement } from "@/app/components/table/meal/MealSettlement";
import { useDisclosure } from "@mantine/hooks";
dayjs.locale("ko");
function page() {
  const queryClient = useQueryClient();

  const [value, setValue] = useState<Date | null>(dayjs().toDate());
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [mealSettlementData, setMealSettlementData] = useState([]);
  const [searchParam, setSearchParam] = useState({
    year: dayjs().year(),
    month: dayjs().month() + 1,
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["mealsSettlement", searchParam], queryFn: () => api.getMealsSettlement(searchParam) });

  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.settlement(values),
  });
  const { mutate: settlementCancel } = useMutation({
    mutationFn: (values: any) => postApi.settlementCancel(values),
  });

  const selectMonth = (e: any) => {
    setValue(e);
    const year = dayjs(e).year();
    const month = dayjs(e).month() + 1;
    setSearchParam((prev: any) => ({ ...prev, year: year, month: month }));
  };

  const handleSettlementCancel = () => {
    settlementCancel(
      {
        mealStatsIdxList: selectedRows,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsSettlement"] });
          setSelectedRows([]);
          notification({
            title: "정산",
            message: "정산취소가 완료되었습니다.",
            color: "green",
          });
        },
      }
    );
  };

  const handleSettlement = () => {
    if (selectedRows.length < 1) {
      notification({
        title: "정산",
        message: "정산처리할 인원을 먼저 선택해 주세요.",
        color: "yellow",
      });
      return;
    }
    mutate(
      {
        mealStatsIdxList: selectedRows,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsSettlement"] });
          setSelectedRows([]);
          notification({
            title: "정산",
            message: "정산이 정상적으로 완료되었습니다.",
            color: "green",
          });
        },
      }
    );
  };

  useEffect(() => {
    if (data?.data.data.mealStats.length === 0) {
      setMealSettlementData([]);
    } else {
      setMealSettlementData(data?.data.data.mealStats);
    }
  }, [data]);

  const [selectedRowsDetail, setSelectedRowsDetail] = useState<any>();

  const [opened, { open: openExpensesDetail, close: closeExpensesDetail }] = useDisclosure(false);

  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        식대 정산
      </Title>

      <Group justify="space-between" mb={"lg"} align="flex-end">
        <MonthPickerInput
          locale="ko"
          variant="unstyled"
          label="월 선택"
          styles={{
            input: {
              fontSize: "var(--mantine-font-size-xl)",
              fontWeight: 700,
            },
          }}
          rightSection={<IconDownArrow />}
          rightSectionPointerEvents="none"
          placeholder="조회하실 월을 선택해 주세요."
          value={value}
          valueFormat="M월"
          onChange={selectMonth}
          w={100}
        />
        <Group>
          {selectedRows.length >= 1 && (
            <Button size="sm" radius="md" color="red" onClick={handleSettlementCancel}>
              정산취소
            </Button>
          )}
          <Button size="sm" radius="md" onClick={handleSettlement}>
            정산완료
          </Button>
          <Button size="sm" radius="md">
            정산요청
          </Button>
        </Group>
      </Group>

      <ScrollArea>
        <Table striped={mealSettlementData?.length < 1 ? false : true} stickyHeader highlightOnHover={mealSettlementData?.length < 1 ? false : true}>
          <TableHeader columns={MEAL_SETTLEMENT_HEADER} />
          <TableBody data={mealSettlementData} columns={MEAL_SETTLEMENT_HEADER}>
            <MealSettlement
              data={mealSettlementData}
              selectedRows={selectedRows}
              setSelectedRowsDetail={setSelectedRowsDetail}
              setSelectedRows={setSelectedRows}
              openExpensesDetail={openExpensesDetail}
            />
          </TableBody>
        </Table>
      </ScrollArea>

      <Drawer
        offset={8}
        size="md"
        radius="md"
        opened={opened}
        onClose={closeExpensesDetail}
        title={
          <Group>
            <Title order={5}>사용내역 상세</Title>
            <Title order={5}>
              {selectedRowsDetail?.userName}
              <Text component="span" ml={8} fz={"sm"}>
                {selectedRowsDetail?.gradeName}
              </Text>
            </Title>
          </Group>
        }
        position="right"
        styles={{ body: { height: "calc(100% - 60px)", display: "flex", flexDirection: "column", justifyContent: "space-between" } }}
      >
        <ScrollArea>
          <Stack gap={"xs"}>
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Divider />
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Divider />
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Divider />
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Divider />
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Divider />
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Divider />
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Divider />
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Divider />
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Divider />
            <Group>
              <Text fz={"sm"}>중식</Text>
              <Stack gap={0}>
                <Text fz={"md"} fw={700}>
                  12,500원
                </Text>
                {/* <Text>12월 5일 수요일</Text> */}
                <Group gap={"xs"}>
                  <Text c={"dimmed"} fz={"xs"}>
                    마맘테이블
                  </Text>
                  <Divider orientation="vertical" />
                  <Text c={"dimmed"} fz={"xs"}>
                    직접결제
                  </Text>
                  <Divider orientation="vertical" />

                  <Text c={"dimmed"} fz={"xs"}>
                    12월 5일 수요일
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Divider />
          </Stack>
        </ScrollArea>

        <Box pt={"sm"}>
          <Stack gap={0}>
            <Divider label={<Title order={6}>사용합계</Title>} labelPosition="left" my={"xs"} />

            <Group justify="space-around">
              <Stack gap={1}>
                <Text fz={"sm"}>조식</Text>
                <Text fz={"sm"}>5000원</Text>
              </Stack>
              <Stack gap={1}>
                <Text fz={"sm"}>중식</Text>
                <Text fz={"sm"}>40,000원</Text>
              </Stack>
              <Stack gap={1}>
                <Text fz={"sm"}>석식</Text>
                <Text fz={"sm"}>5000원</Text>
              </Stack>
            </Group>
          </Stack>
          <Stack gap={0}>
            <Divider label={<Title order={6}>정산금 합계</Title>} labelPosition="left" my={"xs"} />

            <Group justify="space-around">
              <Stack gap={1}>
                <Text fz={"sm"}>조식</Text>
                <Text fz={"sm"}>5000원</Text>
              </Stack>
              <Stack gap={1}>
                <Text fz={"sm"}>중식</Text>
                <Text fz={"sm"}>40,000원</Text>
              </Stack>
              <Stack gap={1}>
                <Text fz={"sm"}>석식</Text>
                <Text fz={"sm"}>5000원</Text>
              </Stack>
            </Group>
          </Stack>
          <Text pr={"xl"} fw={700} fz={"xl"} ta={"right"} mt={"md"}>
            45,000원
          </Text>
        </Box>
      </Drawer>
    </Flex>
  );
}

export default page;
