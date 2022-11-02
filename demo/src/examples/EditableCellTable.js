import { Chance } from "chance";
import { times } from "lodash";
import { nanoid } from "nanoid";
import React, { useRef, useState } from "react";
import DataTable from "../../../src/DataTable";
import DemoWrapper from "../DemoWrapper";
import { useToggle } from "../useToggle";
import OptionsSection from "../OptionsSection";
import { toNumber } from "lodash";

const schema = {
  fields: [
    {
      path: "name",
      validate: newVal => {
        if (!newVal || !newVal.includes("a"))
          return "Must include the letter 'a'";
      },
      format: newVal => {
        return newVal?.toLowerCase();
      }
    },
    {
      path: "type",
      type: "dropdown",
      values: ["old", "new"]
    },
    {
      path: "weather",
      //should auto validate against list of accepted values, should auto format to try to coerce input values into accepted
      type: "dropdown",
      defaultValue: "sunny",
      values: ["cloudy", "rainy", "sunny", "overcast"]
    },
    {
      path: "howMany",
      //should auto validate to make sure the type is numeric, should auto format (I think this already works..) to try to coerce input values into accepted
      type: "numeric",
      defaultValue: 1,
      //should be able to pass additional validation/formatting
      validate: newVal => {
        if (newVal > 20) return "This val is toooo high";
      },
      format: newVal => {
        return toNumber(newVal) + 1;
      }
    },
    {
      path: "isProtein",
      //should auto validate to coerce Yes -> true "true"->true, should auto format to try to coerce input values into accepted
      type: "boolean",
      defaultValue: true
    }
  ]
};
const chance = new Chance();
function getEnts(num) {
  return times(num).map(i => {
    return {
      name: i === 0 ? "Tom" : chance.name(),
      id: nanoid(),
      type: i === 0 ? "fail" : chance.pickone(["new", "old"]),
      howMany:
        i === 0 ? "fail" : i === 1 ? "15" : chance.pickone(["3", 40, 2, 5]),
      isProtein: true,
      weather: chance.pickone(["rainy", "cloudy", "HOT"])
    };
  });
}

export default function SimpleTable(p) {
  const key = useRef(0);
  const [, numComp] = useToggle({
    type: "num",
    label: "Number of Entities",
    isSelect: true,
    defaultValue: 50,
    hook: v => {
      key.current++;
      setEnts(getEnts(toNumber(v)));
    },
    options: [20, 50, 100]
  });
  const [entities, setEnts] = useState([]);
  return (
    <div>
      <OptionsSection>{numComp}</OptionsSection>
      <DemoWrapper>
        <DataTable
          key={key.current}
          formName="editableCellTable"
          isSimple
          isCellEditable
          entities={entities}
          schema={schema}
          // isEntityDisabled={
          //   isEntityDisabled
          //     ? ent => ent.name === "chris" || ent.name === "sam"
          //     : undefined
          // }
          {...p}
        ></DataTable>
      </DemoWrapper>
    </div>
  );
}
