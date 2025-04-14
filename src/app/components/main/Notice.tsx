import * as api from "@/app/api/get/getApi";
import { TNotice } from "@/app/type/notice";
import { Button, Group, List, ListItem, Loader, Paper, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "@/app/styles/list.module.css";
import dayjs from "dayjs";
const Notice = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notices"],
    queryFn: () => api.getNotices(),
  });
  console.log("🚀 ~ Notice ~ data:", data);

  const notices = data?.data.data.notices.slice(0, 4);

  const router = useRouter();
  const movePage = () => router.push("/main/notice");
  const moveDetail = (noticeIdx: number) => router.push(`/main/notice/${noticeIdx}`);

  return (
    <Paper shadow="lg" p="lg" radius={"lg"}>
      <Group justify="space-between">
        <Text fw={600}>공지사항</Text>
        <Button variant="subtle" size="compact-sm" onClick={() => movePage()}>
          자세히 보기
        </Button>
      </Group>

      {isLoading ? (
        <Group justify="center" py={"lg"}>
          <Loader size={"sm"} />
        </Group>
      ) : (
        <List spacing={0} size="sm" center>
          {notices?.map((record: TNotice) => {
            return (
              <ListItem
                w={"100%"}
                onClick={() => moveDetail(record.noticeIdx)}
                key={record.noticeIdx}
                className={styles.element}
                px={"sm"}
                py={"xs"}
                styles={{ itemWrapper: { width: "100%" }, itemLabel: { width: "100%" } }}
              >
                <Group align="center" justify="space-between" wrap="nowrap">
                  <Text fz={"sm"}>{record.title}</Text>
                  <Group>
                    <Text c={"dimmed"} fz={"sm"}>
                      {record.creatorName}
                    </Text>
                    <Text c={"dimmed"} fz={"sm"}>
                      {`${dayjs(record.createdAt).format("YYYY-MM-DD (dd)")}`}
                    </Text>
                  </Group>
                </Group>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default Notice;
