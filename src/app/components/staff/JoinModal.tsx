import * as postApi from "@/app/api/post/postApi";
import notification from "@/app/utils/notification";
import { Button, Group, Radio, Select, Stack, Text, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import classes from "./JoinModal.module.css";
import { useIdCheck } from "@/app/hooks/useValidateId";

function JoinModal({ close }: any) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (values: any) => postApi.addStaff(values),
  });

  const form = useForm({
    initialValues: {
      id: "",
      userName: "",
      userEmail: "",
      userCell: "",
      userAddress: "",
      userGender: "M",
      gradeIdx: null,
      userBirth: null,
      joinDate: null,
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

  const formatPhoneNumber = (input: string) => {
    const numbers = input.replace(/[^\d]/g, "");
    const trimmed = numbers.substring(0, 11);

    if (trimmed.length <= 3) {
      return trimmed;
    } else if (trimmed.length <= 7) {
      return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
    } else {
      return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 7)}-${trimmed.slice(7)}`;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(event.target.value);
    form.setFieldValue("userCell", formatted);
  };

  const { isAvailable, message, isChecking } = useIdCheck({
    id: form.values.id,
    minLength: 4, // 선택적, 기본값 4
    debounceMs: 1000, // 선택적, 기본값 1000
  });

  useEffect(() => {
    const { id } = form.values;

    isAvailable && form.setFieldValue("userEmail", `${id}@acghr.co.kr`);
  }, [isAvailable]);

  const addStaff = (value: any) => {
    const result = { ...value };
    result.gradeIdx = Number(result.gradeIdx);
    result.joinDate = dayjs(result.joinDate).format("YYYY-MM-DD");
    result.userBirth = dayjs(result.userBirth).format("YYYY-MM-DD");
    mutate(result, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["staffs"] });
        notification({
          title: "직원 등록",
          color: "green",
          message: "새 직원이 등록되었습니다.",
        });
        close();
      },
    });
  };
  return (
    <form onSubmit={form.onSubmit(addStaff)}>
      <Stack>
        <TextInput
          withAsterisk
          label="ID"
          placeholder="최소 4글자 이상의 ID를 입력해 주세요."
          key={form.key("id")}
          {...form.getInputProps("id")}
          error={form.errors.id || (!isAvailable && message)}
        />

        <TextInput withAsterisk label="성명" placeholder="이름을 입력해 주세요." key={form.key("userName")} {...form.getInputProps("userName")} />
        <Select
          withAsterisk
          label="직급"
          placeholder="직급을 선택해 주세요"
          data={[{ value: "1", label: "대표" }]}
          key={form.key("gradeIdx")}
          {...form.getInputProps("gradeIdx")}
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
        <TextInput label="주소" withAsterisk placeholder="주소를 입력해 주세요." key={form.key("userAddress")} {...form.getInputProps("userAddress")} />
        <DatePickerInput
          label="입년월일"
          withAsterisk
          clearable
          placeholder="생년월일을 선택해 주세요."
          key={form.key("userBirth")}
          {...form.getInputProps("userBirth")}
        />
        <DatePickerInput
          label="입사일"
          withAsterisk
          clearable
          placeholder="입사일 선택해 주세요."
          key={form.key("joinDate")}
          {...form.getInputProps("joinDate")}
        />
        <Radio.Group label="성별" withAsterisk key={form.key("userGender")} {...form.getInputProps("userGender")}>
          <Group wrap="nowrap">
            <Radio.Card className={classes.root} radius="md" p={"xs"} value="M" key={"M"}>
              <Text size="sm" ta={"center"}>
                남성
              </Text>
            </Radio.Card>
            <Radio.Card className={classes.root} radius="md" p={"xs"} value="W" key="W">
              <Text size="sm" ta={"center"}>
                여성
              </Text>
            </Radio.Card>
          </Group>
        </Radio.Group>
        {/* <TextInput label="비밀번호" withAsterisk placeholder="email@acghr.co.kr" key={form.key("email")} {...form.getInputProps("email")} /> */}

        <Group mt="md">
          <Button fullWidth type="submit">
            등록하기
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default JoinModal;
