import { GRADE_NAME_LIST } from "@/app/enums/staffInfo";
import { Button, Group, Radio, Select, Stack, Text, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import React from "react";
import classes from "./JoinModal.module.css";
import IcnoMale from "/public/icons/gender-male.svg";
import IcnoFemale from "/public/icons/gender-female.svg";

function JoinModal() {
  const form = useForm({
    // mode: "uncontrolled",
    initialValues: {
      id: "",
      userName: "",
      email: "",
      userCell: "",
      userAddress: "",
      gender: "male",
      userGrade: null,
      userBirth: null,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
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
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack>
        <Group wrap="nowrap" align="flex-end">
          <TextInput withAsterisk label="ID" placeholder="ID" key={form.key("id")} {...form.getInputProps("id")} styles={{ root: { flex: 1 } }} />
          <Button size="sm" variant="outline">
            중복확인
          </Button>
        </Group>
        <TextInput withAsterisk label="성명" placeholder="이름을 입력해 주세요." key={form.key("userName")} {...form.getInputProps("userName")} />
        <Select
          withAsterisk
          label="직급"
          placeholder="직급을 선택해 주세요"
          data={GRADE_NAME_LIST}
          key={form.key("userGrade")}
          {...form.getInputProps("userGrade")}
        />
        <TextInput type="email" label="이메일" withAsterisk placeholder="email@acghr.co.kr" key={form.key("email")} {...form.getInputProps("email")} />
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
          label="생년월일"
          withAsterisk
          clearable
          placeholder="생년월일을 선택해 주세요."
          key={form.key("userBirth")}
          {...form.getInputProps("userBirth")}
        />
        <Radio.Group label="성별" withAsterisk key={form.key("gender")} {...form.getInputProps("gender")}>
          <Group wrap="nowrap">
            <Radio.Card className={classes.root} radius="md" p={"xs"} value="male" key={"male"}>
              <Text size="sm" ta={"center"}>
                남성
              </Text>
            </Radio.Card>
            <Radio.Card className={classes.root} radius="md" p={"xs"} value="female" key="female">
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
