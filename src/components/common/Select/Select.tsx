import type { FC } from "react";

import SelectOption from "./SelectOption";
import { SelectMain, type SelectMainProps } from "./SelectMain";

interface SelectComponent extends FC<SelectMainProps> {
  Option: typeof SelectOption;
}

const Select = Object.assign(SelectMain, {
  Option: SelectOption,
}) as SelectComponent;

export default Select;
