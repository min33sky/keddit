import { useEffect, useRef } from 'react';

/**
 * 이전 입력값을 반환하는 훅
 *
 * @description
 * 처음에는 undefined를 반환하고, 랜더링 이후에는 바로 직전에 입력한 값을 반환한다.
 *
 * @param value 이전 입력값
 */
export default function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
