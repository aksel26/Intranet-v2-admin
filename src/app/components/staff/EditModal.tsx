import * as api from "@/app/api/get/getApi";
import * as postApi from "@/app/api/post/postApi";
import { useIdCheck } from "@/app/hooks/useValidateId";
import notification from "@/app/utils/notification";
import { formatPhoneNumber } from "@/app/utils/phoneNumber";
import { Button, Divider, Group, Radio, Select, Stack, Text, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import React, { useEffect, useState } from "react";
import classes from "./JoinModal.module.css";
dayjs.locale("ko");
function EditModal({ close, selectedRow }: any) {
  console.log("🚀 ~ EditModal ~ selectedRow:", selectedRow);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.editStaff(values),
  });

  const { data, isLoading, isError } = useQuery({ queryKey: ["hqName"], queryFn: () => api.getHqIds() });
  const { data: teamIds, isLoading: isLoadingTeamIds, isError: isErrorTeamIds } = useQuery({ queryKey: ["teamName"], queryFn: () => api.getTeamIds() });
  const { data: gradeIds, isLoading: isLoadingGradeIds, isError: isErrorGradeIds } = useQuery({ queryKey: ["grade"], queryFn: () => api.getGradeIds() });
  const {
    data: adminGradeIds,
    isLoading: isLoadingAdminGradeIds,
    isError: isErrorAdminGradeIds,
  } = useQuery({ queryKey: ["adminGrade"], queryFn: () => api.getAdminGradeIds() });

  const [hqList, setHqList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [adminGradeList, setAdminGradeList] = useState([]);
  const [gradeList, setGradeList] = useState([]);

  useEffect(() => {
    data && setHqList(data?.data.data.map((item: any) => ({ value: item.hqIdx.toString(), label: item.hqName })));
    teamIds && setTeamList(teamIds?.data.data.map((item: any) => ({ value: item.teamIdx.toString(), label: item.teamName })));
    adminGradeIds && setAdminGradeList(adminGradeIds?.data.data.map((item: any) => ({ value: item.adminGradeIdx.toString(), label: item.adminGradeName })));
    gradeIds && setGradeList(gradeIds?.data.data.map((item: any) => ({ value: item.gradeIdx.toString(), label: item.gradeName })));
  }, [data, teamIds, adminGradeIds, gradeIds]);

  const form = useForm({
    initialValues: {
      id: selectedRow.id,
      userName: selectedRow.userName,
      userEmail: selectedRow.userEmail,
      userCell: selectedRow.userCell,
      userAddress: selectedRow.userAddress,
      userGender: selectedRow.userGender,
      adminRole: selectedRow.adminRole,
      hqIdx: selectedRow.hqIdx?.toString() || null,
      teamIdx: selectedRow.teamIdx?.toString() || null,
      gradeIdx: selectedRow.gradeIdx?.toString() || null,
      adminGradeIdx: selectedRow.adminGradeIdx?.toString() || null,

      userBirth: dayjs(selectedRow.userBirth).toDate(),
      joinDate: dayjs(selectedRow.joinDate).toDate(),
    },

    validate: {
      id: (value) => (value.length < 4 ? "ID는 최소 4자 이상이어야 합니다" : null),
      userEmail: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      userCell: (value) => {
        if (!value) return "휴대폰 번호를 입력해주세요";
        if (value.replace(/-/g, "").length !== 11) {
          return "올바른 휴대폰 번호를 입력해주세요";
        }
        return null;
      },
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(event.target.value);
    form.setFieldValue("userCell", formatted);
  };

  const { isAvailable, message, isChecking } = useIdCheck({
    id: form.isDirty("id") && form.values.id,
    minLength: 4, // 선택적, 기본값 4
    debounceMs: 1000, // 선택적, 기본값 1000
    isDirty: form.isDirty("id"),
  });

  useEffect(() => {
    const { id } = form.values;

    isAvailable && form.setFieldValue("userEmail", `${id}@acghr.co.kr`);
  }, [isAvailable]);

  const addStaff = (value: any) => {
    const result = { ...value };
    result.gradeIdx = Number(result.gradeIdx);
    result.hqIdx = Number(result.hqIdx);
    result.teamIdx = Number(result.teamIdx);
    result.joinDate = dayjs(result.joinDate).format("YYYY-MM-DD");
    result.userBirth = dayjs(result.userBirth).format("YYYY-MM-DD");

    if (result.adminRole === "N") delete result.adminGradeIdx;
    else result.adminGradeIdx = Number(result.adminGradeIdx);
    mutate(
      { body: result, params: selectedRow.userIdx },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["staffs"] });
          notification({
            title: "직원 수정",
            color: "green",
            message: "새 직원이 수정되었습니다.",
          });
          close();
        },
      }
    );
  };

  return (
    <form onSubmit={form.onSubmit(addStaff)}>
      <Group wrap="nowrap" gap={"xl"} align="flex-start" px={"sm"} pb={"sm"}>
        <Stack w={"100%"}>
          <Text size="sm" c={"gray.6"}>
            개인정보
          </Text>
          <TextInput withAsterisk label="성명" placeholder="이름을 입력해 주세요." key={form.key("userName")} {...form.getInputProps("userName")} />
          <DateInput
            label="생년월일"
            withAsterisk
            locale="ko"
            clearable
            firstDayOfWeek={0}
            valueFormat={"YYYY-MM-DD"}
            placeholder="생년월일을 선택해 주세요."
            key={form.key("userBirth")}
            {...form.getInputProps("userBirth")}
          />
          <TextInput label="주소" withAsterisk placeholder="주소를 입력해 주세요." key={form.key("userAddress")} {...form.getInputProps("userAddress")} />

          <TextInput
            value={form.values.userCell}
            onChange={handleChange}
            error={form.errors.userCell}
            label="연락처"
            withAsterisk
            placeholder="010-0000-0000"
            maxLength={13}
            styles={{
              input: {
                letterSpacing: "1px",
              },
            }}
          />
          <TextInput
            type="email"
            label="이메일"
            withAsterisk
            readOnly
            placeholder="email@acghr.co.kr"
            description="ID에 맞춰 자동 입력됩니다."
            key={form.key("userEmail")}
            {...form.getInputProps("userEmail")}
          />
          <Radio.Group label="성별" withAsterisk key={form.key("userGender")} {...form.getInputProps("userGender")}>
            <Group wrap="nowrap">
              <Radio.Card className={classes.root} radius="md" p={"xs"} value="M" key={"M"}>
                <Text size="xs" ta={"center"}>
                  남성
                </Text>
              </Radio.Card>
              <Radio.Card className={classes.root} radius="md" p={"xs"} value="W" key="W">
                <Text size="xs" ta={"center"}>
                  여성
                </Text>
              </Radio.Card>
            </Group>
          </Radio.Group>
        </Stack>
        <Divider orientation="vertical" size={"xs"} />
        <Stack w={"100%"}>
          <Text size="sm" c={"gray.6"}>
            직원정보
          </Text>
          <TextInput
            withAsterisk
            label="ID"
            placeholder="최소 4글자 이상의 ID를 입력해 주세요."
            key={form.key("id")}
            {...form.getInputProps("id")}
            error={form.errors.id || (!isAvailable && message)}
          />
          <Select withAsterisk label="본부" placeholder="본부를 선택해 주세요" data={hqList} key={form.key("hqIdx")} {...form.getInputProps("hqIdx")} />
          <Select withAsterisk label="팀" placeholder="팀을 선택해 주세요" data={teamList} key={form.key("teamIdx")} {...form.getInputProps("teamIdx")} />
          <Select
            withAsterisk
            label="직급"
            placeholder="직급을 선택해 주세요"
            data={gradeList}
            key={form.key("gradeIdx")}
            {...form.getInputProps("gradeIdx")}
          />
          <DateInput
            label="입사일"
            withAsterisk
            clearable
            valueFormat={"YYYY-MM-DD"}
            locale="ko"
            firstDayOfWeek={0}
            placeholder="입사일 선택해 주세요."
            key={form.key("joinDate")}
            {...form.getInputProps("joinDate")}
          />
          <Radio.Group label="어드민 계정" withAsterisk key={form.key("adminRole")} {...form.getInputProps("adminRole")}>
            <Group wrap="nowrap">
              <Radio.Card className={classes.root} radius="md" p={"xs"} value="Y" key={"Y"}>
                <Text size="xs" ta={"center"}>
                  예
                </Text>
              </Radio.Card>
              <Radio.Card className={classes.root} radius="md" p={"xs"} value="N" key="N">
                <Text size="xs" ta={"center"}>
                  아니오
                </Text>
              </Radio.Card>
            </Group>
          </Radio.Group>
          <Select
            label={"계정등급"}
            withAsterisk
            disabled={form.values.adminRole === "N" ? true : false}
            placeholder="계정등급을 선택해 주세요"
            data={adminGradeList}
            key={form.key("adminGradeIdx")}
            {...form.getInputProps("adminGradeIdx")}
          />

          {/* <TextInput label="비밀번호" withAsterisk placeholder="email@acghr.co.kr" key={form.key("email")} {...form.getInputProps("email")} /> */}
        </Stack>
      </Group>
      <Group justify="flex-end" my={"sm"}>
        <Button size="sm" type="submit">
          수정하기
        </Button>
        <Button size="sm" onClick={close} color="gray" variant="light">
          닫기
        </Button>
      </Group>
    </form>
  );
}

export default EditModal;
