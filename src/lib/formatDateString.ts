import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜 출력 함수
 *
 * @summary
 * - 1분 이내: 방금 전
 * - 3일 미만: 3시간 전, 2일 전
 * - 3일 이상: 2021-01-01 22:00
 *
 * @param date 날짜
 * @returns 날짜 문자열
 */
export default function formatDateString(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000; // 현재 시간과의 차이 (초)

  // 1분 이내일 경우
  if (diff < 60) {
    return '방금 전';
  }

  // 3일 미만일 경우 (몇시간 전, 며칠 전)
  if (diff < 60 * 60 * 24 * 3) {
    return formatDistanceToNow(d, { addSuffix: true, locale: ko });
  }

  // 3일 이상일 경우 (년-월-일 시간)
  // https://date-fns.org/v2.30.0/docs/format
  return format(d, 'yyyy-MM-dd p', {
    locale: ko,
  });
}
