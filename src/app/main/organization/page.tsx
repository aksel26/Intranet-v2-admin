"use client";
import { Box, Flex, Paper, Text } from "@mantine/core";
function page() {
  return (
    <Flex direction={"column"} justify={"space-between"} pb={50}>
      <Box>
        <Text fw={900} size="xl" mb={"xl"}>
          조직 관리
        </Text>
        <Flex columnGap={"xl"}>
          <Paper radius={"lg"} shadow="xl" p={"lg"}>
            <Text fw={800} mb={"md"} size="lg">
              조직 구성
            </Text>
            <Text>본부1</Text>
            <Text>P&C팀</Text>
            <Text>본부2</Text>
            <Text>P&C팀</Text>
            <Text>본부3</Text>
            <Text>P&C팀</Text>
            <Text>P&C팀</Text>
            <Text>P&C팀</Text>
          </Paper>
          <Paper radius={"lg"} shadow="xl" p={"lg"}>
            <Text fw={800} mb={"md"} size="lg">
              직급 구성
            </Text>
            <Text>대표</Text>
            <Text>본부장</Text>
            <Text>팀장</Text>
            <Text>책임</Text>
            <Text>선임</Text>
            <Text>위원</Text>
          </Paper>
          <Paper radius={"lg"} shadow="xl" p={"lg"}>
            <Text fw={800} mb={"md"} size="lg">
              검사 구성
            </Text>
            <Text>검사운영</Text>
            <Text>교육운영</Text>
          </Paper>
        </Flex>
      </Box>
    </Flex>
  );
}

export default page;
