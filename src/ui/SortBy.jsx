import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSortBy = searchParams.get("sortBy") || "";

  //将事件处理函数传下去，获得下拉框中的具体选的值
  function handleClick(e) {
    searchParams.set("sortBy", e.target.value);

    if (searchParams.get("page")) searchParams.set("page", 1);

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
