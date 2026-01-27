import { useSearchParams } from "react-router-dom";
import Select from "./Select";
import { Options } from "../types";
import { ChangeEvent } from "react";

interface SortByProps {
  options: Options[];
}

function SortBy({ options }: SortByProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSortBy = searchParams.get("sortBy") || "";

  //将事件处理函数传下去，获得下拉框中的具体选的值
  function handleClick(e: ChangeEvent<HTMLSelectElement>) {
    searchParams.set("sortBy", e.target.value);

    if (searchParams.get("page")) searchParams.set("page", "1");

    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      onChange={handleClick}
      value={currentSortBy}
      $type="white"
    ></Select>
  );
}

export default SortBy;
