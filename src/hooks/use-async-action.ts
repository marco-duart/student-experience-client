import { useState, useCallback } from "react";

export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      setLoading(true);
      try {
        return await action(...args);
      } finally {
        setLoading(false);
      }
    },
    [action],
  );

  return { loading, run };
}
