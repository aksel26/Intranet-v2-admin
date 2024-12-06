"use client";
import {
  ActionIcon,
  Affix,
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  Flex,
  Group,
  NumberInput,
  rem,
  ScrollArea,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  Transition,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import { TableBody } from "@/app/components/Global/table/Body";
import { TableHeader } from "@/app/components/Global/table/Header";
import { MealConfig } from "@/app/components/meal/MealConfig";
import { MONTH } from "@/app/enums/month";
import { MEAL_CONFIG_HEADER } from "@/app/enums/tableHeader";
import notification from "@/app/utils/notification";
import { useForm } from "@mantine/form";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import dayjs from "dayjs";
import IconArrowUp from "/public/icons/arrow-up.svg";
import IconArrowDown from "/public/icons/arrow-down.svg";
import IconInfo from "/public/icons/info-circle.svg";

interface FormValues {
  baseAmount: null | number;
  mealBudget: string | null | number;
  year: string | number;
  month: string | number;
}

function page() {
  const queryClient = useQueryClient();

  const [baseAmount, setBaseAmount] = useState(0);
  const [mealBudget, setMealBudget] = useState<string | number>("");
  const [workDay, setWorkDay] = useState<string | number>("");

  const [opened, { open, close }] = useDisclosure(false);
  const [mealBudgetData, setMealBudgetData] = useState([]);
  const [searchParam, setSearchParam] = useState<{
    month: number;
    year: number;
  }>({
    month: dayjs().month() + 1,
    year: dayjs().year(),
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["mealsBudget", searchParam], queryFn: () => api.getMealsBudget(searchParam) });

  const { mutate: saveBaseBudget } = useMutation({
    mutationFn: (values: any) => postApi.updateMealBudget(values),
  });

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      baseAmount: null,
      mealBudget: null,
      year: searchParam.year.toString(),
      month: searchParam.month.toString(),
    },
  });

  const changeMonth = (e: any) => setSearchParam((prev) => ({ ...prev, month: e.replace("월", "") }));

  const defaultPrice = (e: any) => {
    setMealBudget(() => e * Number(workDay));
    setBaseAmount(e);
  };
  const handleWorkDay = (e: any) => {
    setWorkDay(e);
    setMealBudget(() => e * baseAmount);
  };

  const saveBaseAmount = () => {
    form.setFieldValue("baseAmount", baseAmount);
    form.setFieldValue("mealBudget", mealBudget);
    form.setFieldValue("year", searchParam.year.toString());
    form.setFieldValue("month", searchParam.month.toString());

    saveBaseBudget(
      { body: form.getValues() },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["mealsBudget"] });
          notification({
            title: "식대 기본 금액 설정",
            color: "green",
            message: "식대 기본 금액이 설정되었습니다.",
          });
          close();
          setWorkDay("");
          setMealBudget("");
          form.reset();
        },
        onError: () => {
          notification({
            title: "식대 기본 금액 설정",
            color: "red",
            message: "식대 기본 금액 설정 요청을 실패하였습니다.",
          });
        },
      }
    );
  };

  useEffect(() => {
    if (data?.data.data.mealBudget.length === 0) {
      setMealBudgetData([]);
    } else {
      setMealBudgetData(data?.data.data.mealBudget);
    }
  }, [data]);
  const [scroll, scrollTo] = useWindowScroll();
  const [collapsed, { toggle }] = useDisclosure();

  // 3개년 범위
  const [years, setYears] = useState({
    "2024": true,
    "2023": false,
    "2022": false,
    "2021": false,
  });

  const collapseList = (key: "2024" | "2023" | "2022" | "2021") => {
    setYears((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Flex direction={"column"} h={"100%"}>
      <Title order={3} mb={"lg"}>
        식대 설정
      </Title>

      <Group justify="flex-end">
        <Button size="sm" onClick={open}>
          기본금액 설정
        </Button>
      </Group>

      <Tabs defaultValue="messages">
        <Tabs.List>
          <Tabs.Tab value="gallery">인원별 조회</Tabs.Tab>
          <Tabs.Tab value="messages">기간별 조회</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="gallery">
          <Box pt={"md"}>
            <Group mb={"md"} align="flex-end">
              <Select
                allowDeselect={false}
                maxDropdownHeight={200}
                w={100}
                size="sm"
                checkIconPosition="right"
                data={MONTH}
                variant="unstyled"
                defaultValue={`${dayjs().month() + 1}월`}
                onChange={changeMonth}
                styles={{
                  input: {
                    fontSize: "var(--mantine-font-size-lg)",
                    fontWeight: 700,
                  },
                }}
              />

              <Group gap={4}>
                <ThemeIcon variant="transparent">
                  <IconInfo width="20" height="20" />
                </ThemeIcon>
                <Text fz={"xs"} c={"dimmed"}>
                  인원별 조회 시 기준 연도는 당해 연도입니다..
                </Text>
              </Group>
            </Group>

            <ScrollArea>
              <Table striped={mealBudgetData?.length < 1 ? false : true} stickyHeader highlightOnHover={mealBudgetData?.length < 1 ? false : true}>
                <TableHeader columns={MEAL_CONFIG_HEADER} />
                <TableBody data={mealBudgetData} columns={MEAL_CONFIG_HEADER}>
                  <MealConfig data={mealBudgetData} />
                </TableBody>
              </Table>
            </ScrollArea>
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="messages">
          <ScrollArea p={"md"}>
            <Divider
              my="md"
              label={
                <Group gap={"sm"}>
                  <Title order={4}>2024년</Title>
                  <ActionIcon variant="subtle">
                    <IconArrowUp />
                  </ActionIcon>
                </Group>
              }
              labelPosition="left"
              onClick={() => collapseList("2024")}
            />
            <Collapse in={years["2024"]}>
              <Group gap={140} justify="center">
                <Stack gap={"xs"}>
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      12월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                  <Divider />
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      11월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                  <Divider />
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      11월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                  <Divider />
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      11월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                  <Divider />
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      11월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                  <Divider />
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      11월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                </Stack>
                <Stack gap={"xs"}>
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      12월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                  <Divider />
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      11월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                  <Divider />
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      11월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                  <Divider />
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      11월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                  <Divider />
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      11월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                  <Divider />
                  <Group gap={70} px={"lg"}>
                    <Text fw={600} fz={"md"}>
                      11월
                    </Text>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        총 금액
                      </Text>
                      <Text fz="sm">43,000원</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        근무일
                      </Text>
                      <Text fz="sm">29일</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text c={"dimmed"} fz="sm">
                        기본금액
                      </Text>
                      <Text fz="sm">129,000원</Text>
                    </Stack>
                  </Group>
                </Stack>
              </Group>
            </Collapse>
            <Divider
              my="md"
              label={
                <Group gap={"sm"}>
                  <Title order={4}>2023년</Title>
                  <ActionIcon variant="subtle">
                    <IconArrowDown />
                  </ActionIcon>
                </Group>
              }
              labelPosition="left"
              onClick={() => collapseList("2023")}
            />
            <Collapse in={years["2023"]}>
              <Stack gap={"xs"} px={"md"}>
                <Group gap={70}>
                  <Text fw={600} fz={"md"}>
                    12월
                  </Text>
                  <Stack gap={3}>
                    <Text c={"dimmed"} fz="sm">
                      총 금액
                    </Text>
                    <Text fz="sm">43,000원</Text>
                  </Stack>
                  <Stack gap={3}>
                    <Text c={"dimmed"} fz="sm">
                      근무일
                    </Text>
                    <Text fz="sm">29일</Text>
                  </Stack>
                  <Stack gap={3}>
                    <Text c={"dimmed"} fz="sm">
                      기본금액
                    </Text>
                    <Text fz="sm">129,000원</Text>
                  </Stack>
                </Group>
                <Divider />
                <Group gap={70}>
                  <Text fw={600} fz={"md"}>
                    11월
                  </Text>
                  <Stack gap={3}>
                    <Text c={"dimmed"} fz="sm">
                      총 금액
                    </Text>
                    <Text fz="sm">43,000원</Text>
                  </Stack>
                  <Stack gap={3}>
                    <Text c={"dimmed"} fz="sm">
                      근무일
                    </Text>
                    <Text fz="sm">29일</Text>
                  </Stack>
                  <Stack gap={3}>
                    <Text c={"dimmed"} fz="sm">
                      기본금액
                    </Text>
                    <Text fz="sm">129,000원</Text>
                  </Stack>
                </Group>
                <Divider />
                <Group gap={70}>
                  <Text fw={600} fz={"md"}>
                    11월
                  </Text>
                  <Stack gap={3}>
                    <Text c={"dimmed"} fz="sm">
                      총 금액
                    </Text>
                    <Text fz="sm">43,000원</Text>
                  </Stack>
                  <Stack gap={3}>
                    <Text c={"dimmed"} fz="sm">
                      근무일
                    </Text>
                    <Text fz="sm">29일</Text>
                  </Stack>
                  <Stack gap={3}>
                    <Text c={"dimmed"} fz="sm">
                      기본금액
                    </Text>
                    <Text fz="sm">129,000원</Text>
                  </Stack>
                </Group>
              </Stack>
            </Collapse>
          </ScrollArea>

          <Affix position={{ bottom: 20, right: 20 }}>
            <Transition transition="slide-up" mounted={scroll.y > 0}>
              {(transitionStyles) => (
                <Button leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />} style={transitionStyles} onClick={() => scrollTo({ y: 0 })}>
                  Scroll to top
                </Button>
              )}
            </Transition>
          </Affix>
        </Tabs.Panel>
      </Tabs>

      <Drawer offset={8} size="md" radius="md" opened={opened} onClose={close} title="식대 기본금액 설정" position="right">
        <form onSubmit={form.onSubmit(saveBaseAmount)}>
          <Stack gap={"lg"} py={"md"}>
            <Select
              withAsterisk
              allowDeselect={false}
              label="적용 월 선택"
              maxDropdownHeight={200}
              size="sm"
              checkIconPosition="right"
              data={MONTH}
              defaultValue={`${dayjs().month() + 1}월`}
              onChange={changeMonth}
            />

            <NumberInput
              withAsterisk
              description="식대금액이 설정한 기간에 일괄적으로 적용됩니다."
              label="기본 제공 식대"
              placeholder="금액을 입력해 주세요."
              thousandSeparator=","
              hideControls
              suffix=" 원"
              onChange={defaultPrice}
            />

            <NumberInput
              withAsterisk
              label="업무일"
              thousandSeparator=","
              hideControls
              suffix=" 일"
              value={workDay}
              onChange={handleWorkDay}
              placeholder="해당 월의 업무일을 입력해 주세요."
              allowNegative={false}
            />

            <NumberInput
              label={"인원별 총 금액"}
              description="기본제공 식대 x 업무일"
              readOnly
              variant="unstyled"
              thousandSeparator=","
              hideControls
              suffix=" 원"
              value={mealBudget}
              styles={{ root: { fontWeight: 700 } }}
              placeholder="자동계산되어 표시됩니다."
            />
            <Group wrap="nowrap">
              <Button fullWidth type="submit" radius={"md"}>
                저장
              </Button>
              <Button fullWidth onClick={close} radius={"md"} variant="light" color="gray">
                닫기
              </Button>
            </Group>
          </Stack>
        </form>
      </Drawer>
    </Flex>
  );
}

export default page;
