"use client";

import { Avatar, Badge, Box, Group, Paper, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import IconAt from "/public/icons/email.svg";
import IconPhone from "/public/icons/phone.svg";
export const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    adminEmail: "",
    adminName: "",
  });

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const { adminName, adminEmail } = JSON.parse(user);
      setUserInfo((prev: any) => ({ ...prev, adminName, adminEmail }));
    }
  }, []);

  return (
    <Paper my={"md"} radius={"md"} p={"sm"} pr={0}>
      {/* <Avatar src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png" size={94} radius="md" /> */}
      {/* <Box w={"100%"}> */}
      <Stack gap={4}>
        <Group justify="space-between" align="center" mb={1}>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            P&C팀
          </Text>
          <Badge variant="light" size="md" color="lime">
            상위 관리자
          </Badge>
        </Group>
        <Text fz="lg" fw={500}>
          {userInfo.adminName}
          <Text fz="md" fw={500} component="span" ml={"xs"}>
            위원
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
