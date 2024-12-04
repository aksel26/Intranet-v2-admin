"use client";
import { Anchor, Box, Flex, Grid, GridCol, Group, Text, Textarea, Title } from "@mantine/core";
import React from "react";

function page() {
  return (
    <Flex direction={"column"} h={"100%"} styles={{ root: { overflow: "hidden" } }}>
      <Title order={3} mb={"lg"}>
        공지사항 상세보기
      </Title>

      <Grid>
        <Grid.Col span={6} bg={"grape.3"}>
          <Group align="center" h={"100%"}>
            <Box bg={"red.1"} w={100} h={"100%"}>
              <Text>작성자</Text>
            </Box>
            <Text>홍우우</Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={6} bg={"grape.2"} p={"md"}>
          <Group>
            <Text>작성일</Text>
            <Text>2024-12-12</Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={6} bg={"grape.2"} p={"md"}>
          <Group>
            <Text>참조</Text>
            <Text>더더더더더</Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={6} bg={"grape.1"} p={"md"}>
          <Group>
            <Text>수정일</Text>
            <Text>2024-12-12</Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={3} bg={"grape.1"} p={"md"}>
          <Text>제목</Text>
        </Grid.Col>
        <Grid.Col span={9}>
          <Text>으으으암닝럼니아ㅓㄹㅁ니ㅏㅓㅇㄹ</Text>
        </Grid.Col>
      </Grid>

      <Textarea label="내용" />
      <Anchor href="https://mantine.dev/" target="_blank" underline="hover">
        첨부파일
      </Anchor>
    </Flex>
  );
}

export default page;
