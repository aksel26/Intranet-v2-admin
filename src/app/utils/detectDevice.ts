export const detectDevice = (userAgent: string, ip: string) => {
  if (!userAgent || !ip) return "-";
  let isLocal = ip.split(".")[0] === "58" ? "ACG" : "외부";
  // 소문자로 변환하여 비교
  const ua = userAgent.toLowerCase();

  // 모바일 관련 키워드 목록
  const mobileKeywords = ["mobile", "android", "iphone", "ipad", "blackberry", "iemobile", "opera mini"];

  // 키워드가 하나라도 포함되면 모바일로 판단
  for (const keyword of mobileKeywords) {
    if (ua.includes(keyword)) {
      return isLocal + " 모바일";
    }
  }
  return isLocal + " PC";
};
