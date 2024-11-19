"use client";
import { Badge, Box, Divider, Flex, Group, List, Pill, Popover, Select, Stack, Tabs, Text, Title } from "@mantine/core";

function page() {
  return (
    <Flex direction={"column"} justify={"space-between"} pb={50}>
      <Box>
        <Title order={3} mb={"xl"}>
          직원 휴가 관리
        </Title>
      </Box>
      <Stack gap={"sm"}>
        <Group>
          <Text fw={600} size="lg">
            ACG 본부
          </Text>
          <Divider size={"sm"} orientation="vertical" />
          <Text fw={600} size="lg">
            Assessment 1팀
          </Text>
          <Divider size={"sm"} orientation="vertical" />
          <Text fw={600} size="lg">
            정진옥{" "}
            <Text fw={600} component="span">
              팀장
            </Text>
          </Text>
        </Group>

        <Group gap={"lg"}>
          <Group gap={"sm"}>
            <Pill>입사일</Pill>
            <Text>1990-02-11</Text>
          </Group>
          <Group gap={"sm"}>
            <Pill>근속년수</Pill>
            <Text>40년</Text>
          </Group>
        </Group>
      </Stack>
      <Divider my={"lg"} />

      <Group gap={"xl"} mb={"lg"}>
        <Text>회계연도</Text>
        <Select variant="unstyled" defaultValue={"2024년"} data={["2022년", "2023년", "2024년", "2025년"]} />
        <Group>
          <Badge size="lg" variant="light" color="green">
            총 연차일수
          </Badge>
          <Text>15일</Text>
        </Group>
      </Group>
      <Tabs defaultValue="1월" orientation="vertical">
        <Tabs.List styles={{ list: { rowGap: "var(--mantine-spacing-md)" } }}>
          <Tabs.Tab value="1월">1월</Tabs.Tab>
          <Tabs.Tab value="2월">2월</Tabs.Tab>
          <Tabs.Tab value="3월">3월</Tabs.Tab>
          <Tabs.Tab value="4월">4월</Tabs.Tab>
          <Tabs.Tab value="5월">5월</Tabs.Tab>
          <Tabs.Tab value="6월">6월</Tabs.Tab>
          <Tabs.Tab value="7월">7월</Tabs.Tab>
          <Tabs.Tab value="8월">8월</Tabs.Tab>
          <Tabs.Tab value="9월">9월</Tabs.Tab>
          <Tabs.Tab value="10월">10월</Tabs.Tab>
          <Tabs.Tab value="11월">11월</Tabs.Tab>
          <Tabs.Tab value="12월">12월</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="1월">
          <Group justify="flex-start" align="flex-start" wrap="nowrap" h={"100%"}>
            <Box w={"35%"} px={"xl"}>
              <Title order={5}>사용내역</Title>
              <Stack gap={2} py={"lg"} px={"xl"}>
                <Group>
                  <Text size="md">2024-01-12 (월)</Text>
                  <Badge size="md" variant="light" color="blue">
                    연차
                  </Badge>
                </Group>
                <Group gap={"xs"}>
                  <Text c="dimmed" size="sm">
                    승인자 :
                  </Text>
                  <Text c="dimmed" size="sm">
                    정지누
                  </Text>
                  {/* <Pill size="sm">미승인</Pill> */}
                </Group>
              </Stack>
              <Divider />
              <Stack gap={2} py={"lg"} px={"xl"}>
                <Group>
                  <Text size="md">2024-01-15 (수)</Text>
                  <Badge size="md" variant="light" color="yellow">
                    오전 반차
                  </Badge>
                </Group>
                <Group gap={"xs"}>
                  <Text c="dimmed" size="sm">
                    승인자 :
                  </Text>
                  <Text c="dimmed" size="sm">
                    정지누
                  </Text>
                  {/* <Pill size="sm">미승인</Pill> */}
                </Group>
              </Stack>
            </Box>
            <Divider size={"xs"} orientation="vertical" />
            <Box px={"xl"} flex={1}>
              <Title order={5}>사용내역 요약</Title>
              <Group px={"xl"} py={"lg"} align="flex-end" gap={100}>
                <Group align="flex-start">
                  <Stack>
                    <Group>
                      <Stack gap={"xs"}>
                        <Popover position="top-end" withArrow shadow="lg" radius="lg">
                          <Popover.Target>
                            <Group>
                              <Text>연차</Text>
                              <Text>1회</Text>
                            </Group>
                          </Popover.Target>
                          <Popover.Dropdown>
                            <Title mb={"xs"} order={5}>
                              누적 사용내역
                            </Title>
                            <List withPadding>
                              <List.Item>1월 : 1회</List.Item>
                              <List.Item>2월 : 0회</List.Item>
                              <List.Item>3월 : 1.5회</List.Item>
                            </List>
                          </Popover.Dropdown>
                        </Popover>

                        <Group>
                          <Text>반차</Text>
                          <Text>1회</Text>
                        </Group>
                        <Group>
                          <Text>반반차</Text>
                          <Text>1회</Text>
                        </Group>
                      </Stack>
                      <Divider orientation="vertical" size={"xs"} />
                      <Stack gap={"xs"}>
                        <Group>
                          <Text>조퇴</Text>
                          <Text>1회</Text>
                        </Group>
                        <Group>
                          <Text>공제</Text>
                          <Text>1회</Text>
                        </Group>
                        <Group>
                          <Text>훈련</Text>
                          <Text>1회</Text>
                        </Group>
                        <Group>
                          <Text>하계휴가</Text>
                          <Text>1회</Text>
                        </Group>
                        <Group>
                          <Text>대체휴무</Text>
                          <Text>1회</Text>
                        </Group>
                        <Group>
                          <Text>특별휴가</Text>
                          <Text>1회</Text>
                        </Group>
                        <Group>
                          <Text>경조휴무</Text>
                          <Text>1회</Text>
                        </Group>
                        <Group>
                          <Text>무급휴가</Text>
                          <Text>1회</Text>
                        </Group>
                      </Stack>
                    </Group>
                    <Group>
                      <Badge size="lg" radius={"md"} variant="outline" color="gray">
                        공제 연차일
                      </Badge>
                      <Text>1.5일</Text>
                    </Group>
                  </Stack>
                </Group>

                <Group align="flex-end">
                  <Stack>
                    <Group>
                      <Badge size="lg" radius={"md"} variant="light" color="green">
                        총 연차일
                      </Badge>
                      <Text>15일</Text>
                    </Group>
                    <Group>
                      <Badge size="lg" radius={"md"} variant="outline" color="gray">
                        사용연차일
                      </Badge>
                      <Text>1.5일</Text>
                    </Group>
                    <Group>
                      <Badge size="lg" radius={"md"} variant="outline" color="blue">
                        남은 연차일
                      </Badge>
                      <Text>10.5일</Text>
                    </Group>
                  </Stack>
                  <Group>
                    <Badge size="lg" radius={"md"} variant="outline" color="gray">
                      무급휴가 (별도정산)
                    </Badge>
                    <Text>0일</Text>
                  </Group>
                </Group>
              </Group>
              {/* 연차 */}
              {/* 반차 */}
              {/* 반반차 */}
              {/* 조퇴 */}
              {/* 공제 */}
              {/* 훈련 */}
              {/* 하계휴가 */}
              {/* 대체휴무 */}
              {/* 특별휴가 */}
              {/* 경조휴무 */}
              {/* 무급휴가 */}
            </Box>
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>
        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
      </Tabs>
    </Flex>
  );
}

export default page;
