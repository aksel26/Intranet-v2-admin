"use client";

import { Avatar, Badge, Box, Group, Paper, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import IconAt from "/public/icons/email.svg";
import IconPhone from "/public/icons/phone.svg";
export const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    adminEmail: "",
    adminName: "",
    gradeName: "",
    adminGradeName: "",
    teamName: "",
    hqName: "",
  });
  console.log("🚀 ~ UserInfo ~ userInfo:", userInfo);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const { adminName, adminEmail, gradeName, adminGradeName, teamName, hqName } = JSON.parse(user);
      setUserInfo((prev: any) => ({ ...prev, adminName, adminEmail, gradeName, adminGradeName, teamName, hqName }));
    }
  }, []);

  return (
    <Paper my={"md"} radius={"md"} p={"sm"} pr={0}>
      {/* <Avatar src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png" size={94} radius="md" /> */}
      {/* <Box w={"100%"}> */}
      <Stack gap={4}>
        <Group justify="space-between" align="center" mb={1}>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {userInfo.teamName || "팀이 설정되지 않았습니다."}
          </Text>
          <Badge variant="light" size="md" color="lime">
            {userInfo.adminGradeName}
          </Badge>
        </Group>
        <Text fz="lg" fw={500}>
          {userInfo.adminName}
          <Text fz={userInfo.gradeName ? "md" : "xs"} fw={500} component="span" ml={"xs"} c={userInfo.gradeName ? undefined : "dimmed"}>
            {userInfo.gradeName || "직급이 설정되지 않았습니다."}
          </Text>
        </Text>

        <Group wrap="nowrap" gap={10} mt={3}>
          <IconAt width="16" height="16" color="#868e96" />
          <Text fz="xs" c="dimmed">
            {userInfo.adminEmail}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
};
