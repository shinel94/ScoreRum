export const AUTH_EMAIL_SUBJECT = "score-rum 사용자 인증 이메일";
export const AUTH_EMAIL_CONTENT = `<p>아래의 링크를 클릭하여, 사용자 인증을 완료해주세요.</p><br><p>인증이 진행되지 않는 경우 기능 이용이 불가능합니다.</p><br><a href="${process.env.HOST_NAME}/api/auth/email/{hash}"><b>이메일 인증하기</b></a>`;
