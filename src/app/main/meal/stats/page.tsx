"use client";
import {
  ActionIcon,
  Collapse,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import IconArrowDown from "/public/icons/arrow-down.svg";
import IconArrowUp from "/public/icons/arrow-up.svg";
import { useState } from "react";

function page() {
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
    <>
      <Text fw={900} size="xl" mb={"xl"}>
        식대 통계
      </Text>
      <Tabs
        defaultValue="default"
        h={"calc(100% - var(--app-shell-footer-height)"}
      >
        <Tabs.List>
          <Tabs.Tab value="default">기본금액 설정 내역</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel h={"inherit"} value="default">
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
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default page;
