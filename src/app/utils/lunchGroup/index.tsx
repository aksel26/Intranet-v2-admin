export const adjustGroupArrays = (data: any) => {
  // 데이터의 깊은 복사본 생성 (원본 데이터 보호)
  const result = JSON.parse(JSON.stringify(data));

  // groupInfo 배열을 순회하며 각 그룹 처리
  result.groupInfo.forEach((groupInfo: any) => {
    const groupNo = groupInfo.groupNo.toString(); // groups 객체의 키는 문자열
    const targetCount = groupInfo.availMemberCount;

    // 해당 그룹이 groups 객체에 존재하는지 확인
    if (result.groups.hasOwnProperty(groupNo)) {
      const currentArray = result.groups[groupNo];
      const currentLength = currentArray.length;

      if (currentLength < targetCount) {
        // 배열이 목표 길이보다 짧으면 null로 채움
        const additionalSlots = targetCount - currentLength;
        for (let i = 0; i < additionalSlots; i++) {
          currentArray.push(null);
        }
      } else if (currentLength > targetCount) {
        // 배열이 목표 길이보다 길면 뒤에서부터 제거 (기존 값 우선 보존)
        result.groups[groupNo] = currentArray.slice(0, targetCount);
      }
      // currentLength === targetCount인 경우는 변경 없음
    }
  });

  return result;
};
