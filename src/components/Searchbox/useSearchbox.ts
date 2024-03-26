import * as React from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { notification } from "antd";

import { NotificationType } from "../../types/types";

const useSearchbox = () => {
  const [selected, setSelected] = React.useState<Array<string>>([]);
  const [query, setQuery] = React.useState<string>("");
  const debounced = useDebounce<string>(query, 1000);

  const [api, notificationContext] = notification.useNotification();

  const notify = React.useCallback(
    (type: NotificationType, title: string, message: string) => {
      api[type]({ message: title, description: message });
    },
    [api]
  );

  const handleChange = React.useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleSelect = React.useCallback((value: string) => {
    if (selected.length === 2) {
      notify("error", "Error", "More than 2 packages can not selected");
      setQuery("");
      return;
    }
    setSelected((prev) => {
      //to avoid repeatedSelection
      if (prev.includes(value)) {
        return prev;
      }
      return [...prev, value];
    });
    setQuery("");
  }, []);

  const handleClose = React.useCallback((tag: string) => {
    setSelected((prev) => {
      return prev.filter((pTag) => pTag !== tag);
    });
  }, []);

  return {
    selected,
    query,
    handleQueryChange: handleChange,
    handleSelect,
    handleTagClose: handleClose,
    debouncedQueryValue: debounced,
    notificationContext,
    notify,
  };
};

export default useSearchbox;
