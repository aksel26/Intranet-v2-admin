import * as api from "@/app/api/get/getApi";
import { TNotice } from "@/app/type/notice";
import { Button, Group, List, ListItem, Loader, Paper, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "@/app/styles/list.module.css";
import dayjs from "dayjs";
import { IconChevronRight } from "@tabler/icons-react";
const Notice = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notices"],
    queryFn: () => api.getNotices({ pageNo: 1, perPage: 5 }),
  });

  const notices = data?.data.data.notices.slice(0, 4);

  const router = useRouter();
  const movePage = () => router.push("/main/notice");
  const moveDetail = (noticeIdx: number) => router.push(`/main/notice/${noticeIdx}`);

  const LoadingView = () => (
    <Group justify="center" py={"lg"}>
      <Loader size={"sm"} />
    </Group>
  );

  const EmptyView = () => (
    <Text ta={"center"} c={"dimmed"} fz={"xs"} py={"lg"}>
      공지사항 등록 내역이 없어요.
    </Text>
  );

  const NoticeList = () => (
    <List spacing={0} size="sm" center>
      {notices?.map((record: TNotice, index: number) => (
        <NoticeItem key={index} record={record} />
      ))}
    </List>
  );

  const NoticeItem = ({ record }: { record: TNotice }) => (
    <ListItem
      w={"100%"}
      onClick={() => moveDetail(record.noticeIdx)}
      key={record.noticeIdx}
      className={styles.element}
      py={"xs"}
      px={"lg"}
      styles={{ itemWrapper: { width: "100%" }, itemLabel: { width: "100%" } }}
    >
      <Group align="center" justify="space-between" wrap="nowrap">
        <Text fz={"xs"}>{record.title}</Text>
        <Group>
          <Text c={"dimmed"} fz={"xs"}>
            {record.creatorName}
          </Text>
          <Text c={"dimmed"} fz={"xs"}>
            {`${dayjs(record.createdAt).format("YYYY-MM-DD (dd)")}`}
          </Text>
        </Group>
      </Group>
    </ListItem>
  );

  const renderContent = () => {
    if (isLoading) return <LoadingView />;
    if (notices?.length === 0) return <EmptyView />;
    return <NoticeList />;
  };

  return (
    <Paper shadow="lg" py="lg" radius={"lg"}>
      <Group justify="space-between" mb={"xs"} px={"lg"}>
        <Text fw={600}>공지사항</Text>
        <Button variant="subtle" size="compact-xs" onClick={() => movePage()} rightSection={<IconChevronRight size={14} />}>
          자세히 보기
        </Button>
      </Group>

      {renderContent()}
    </Paper>
  );
};

export default Notice;
