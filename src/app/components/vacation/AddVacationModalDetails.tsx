import { Button, Divider, Group, Modal, Select, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DeleteAddVacationModal from "./DeleteAddVacationModal";
import ModifyAddVacationModal from "./ModifyAddVacationModal";

function AddVacationModalDetails({ opened, close }: any) {
  const [deleteModalOpened, { close: deleteModalClose, open: deleteModalOpen }] = useDisclosure(false);
  const [modifyModalOpened, { close: modifyModalClose, open: modifyModalOpen }] = useDisclosure(false);

  return (
    <Modal opened={opened} onClose={close} title="휴가 부여 내역" centered>
      <Group justify="space-between" align="flex-end" mb={"xs"}>
        <Stack gap={0}>
          <Text fz={"sm"} mb={4}>
            정진옥 팀장
          </Text>
          <Text c={"dimmed"} fz={"sm"}>
            <Text component="span" fw={500} c={"black"} fz={"sm"}>
              3건{" "}
            </Text>
            의 휴가 부여 내역입니다.
          </Text>
        </Stack>
        <Select defaultValue={"2025"} data={["2025"]} prefix="asdf" size="xs" w={100} />
      </Group>
      <Divider my={"md"} />

      <Stack my={"lg"} gap={"lg"}>
        <Group align="center" justify="space-between">
          <Stack gap={0}>
            <Group>
              <Text fz={"sm"}>휴가 종류</Text>
              <Text fz={"sm"}>연차</Text>
              <Text fz={"sm"}>워크샵 경품</Text>
            </Group>
            <Group>
              <Text w={50} fz={"sm"} c={"dimmed"}>
                추가날짜
              </Text>
              <Text fz={"sm"} c={"dimmed"}>
                2024-12-21(화)
              </Text>
            </Group>
          </Stack>
          <Group gap={"xs"}>
            <Button size="xs" variant="light" onClick={modifyModalOpen}>
              수정
            </Button>
            <Button size="xs" variant="light" color="red.5" onClick={deleteModalOpen}>
              삭제
            </Button>
          </Group>
        </Group>
        <Group align="center" justify="space-between">
          <Stack gap={0}>
            <Group>
              <Text fz={"sm"}>휴가 종류</Text>
              <Text fz={"sm"}>연차</Text>
              <Text fz={"sm"}>워크샵 경품</Text>
            </Group>
            <Group>
              <Text w={50} fz={"sm"} c={"dimmed"}>
                추가날짜
              </Text>
              <Text fz={"sm"} c={"dimmed"}>
                2024-12-21(화)
              </Text>
            </Group>
          </Stack>
          <Group gap={"xs"}>
            <Button size="xs" variant="light" onClick={modifyModalOpen}>
              수정
            </Button>
            <Button size="xs" variant="light" color="red.5" onClick={deleteModalOpen}>
              삭제
            </Button>
          </Group>
        </Group>
        <Group align="center" justify="space-between">
          <Stack gap={0}>
            <Group>
              <Text fz={"sm"}>휴가 종류</Text>
              <Text fz={"sm"}>연차</Text>
              <Text fz={"sm"}>워크샵 경품</Text>
            </Group>
            <Group>
              <Text w={50} fz={"sm"} c={"dimmed"}>
                추가날짜
              </Text>
              <Text fz={"sm"} c={"dimmed"}>
                2024-12-21(화)
              </Text>
            </Group>
          </Stack>
          <Group gap={"xs"}>
            <Button size="xs" variant="light" onClick={modifyModalOpen}>
              수정
            </Button>
            <Button size="xs" variant="light" color="red.5" onClick={deleteModalOpen}>
              삭제
            </Button>
          </Group>
        </Group>
      </Stack>
      <Button variant="light" fullWidth color="gray">
        닫기
      </Button>
      <DeleteAddVacationModal opened={deleteModalOpened} close={deleteModalClose} />
      <ModifyAddVacationModal opened={modifyModalOpened} close={modifyModalClose} />
    </Modal>
  );
}

export default AddVacationModalDetails;
