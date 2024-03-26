import { FC, useCallback, useMemo } from "react";

import { AutoComplete, Tag, Button, Spin } from "antd";

import { SearchboxProps } from "../../types/types";

import useSearchbox from "./useSearchbox";
import useData from "./useData";

import "./styles.css";

const SearchBox: FC<SearchboxProps> = ({ onCompareClick }) => {
  const {
    selected,
    query,
    debouncedQueryValue,
    notificationContext,
    handleQueryChange,
    handleSelect,
    handleTagClose,
    notify,
  } = useSearchbox();

  const { data, isSuccess, isError, isLoading } = useData(debouncedQueryValue);

  if (isError)
    notify("error", "Error", "Error encountered while fetching packages!");

  const autocomplteOptions = useMemo<Array<JSX.Element> | null>(() => {
    if (isSuccess) {
      return data?.map((item) => {
        return (
          <AutoComplete.Option key={item.package.name}>
            {item.package.name}
          </AutoComplete.Option>
        );
      });
    }
    return null;
  }, [data]);

  const selectedLibs = useMemo(() => {
    return selected.map((tag) => (
      <Tag
        onClose={() => handleTagClose(tag)}
        key={tag}
        color="red"
        className="tag"
        closable
      >
        {tag}
      </Tag>
    ));
  }, [selected]);

  const handleCompareClick = useCallback(() => {
    if (selected.length < 2) {
      notify("error", "Error", "Please select 2 packages!");
      return;
    }
    onCompareClick?.();
  }, [onCompareClick]);

  return (
    <div className="search-box">
      {notificationContext}
      <div className="input-section d-flex horizontal-center">
        <AutoComplete
          className="input"
          placeholder="Enter name of the library"
          value={query}
          onChange={handleQueryChange}
          onSelect={handleSelect}
        >
          {autocomplteOptions}
        </AutoComplete>
      </div>
      <div className="name-section d-flex d-flex-center horizontal-center">
        {selectedLibs}
        {isLoading && <Spin size="large" />}
      </div>
      <div className="actions">
        <Button type="primary" danger onClick={handleCompareClick}>
          Compare
        </Button>
      </div>
    </div>
  );
};

export default SearchBox;
