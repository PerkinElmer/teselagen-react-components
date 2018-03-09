import React from "react";
import { InputGroup, Button, Classes } from "@blueprintjs/core";
import { onEnterHelper } from "../utils/handlerHelpers";

const SearchBar = ({
  reduxFormSearchInput,
  setSearchTerm,
  maybeSpinner,
  disabled
}) => {
  return (
    <InputGroup
      disabled={disabled}
      className={"pt-round datatable-search-input"}
      placeholder="Search..."
      {...reduxFormSearchInput.input}
      {...onEnterHelper(e => {
        e.preventDefault();
        setSearchTerm(reduxFormSearchInput.input.value);
      })}
      rightElement={
        maybeSpinner || (
          <Button
            className={Classes.MINIMAL}
            icon={"pt-icon-search"}
            onClick={() => {
              setSearchTerm(reduxFormSearchInput.input.value);
            }}
          />
        )
      }
    />
  );
};

export default SearchBar;
