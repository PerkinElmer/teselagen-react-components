import React from "react";
import { Provider } from "react-redux";
import { Button } from "@blueprintjs/core";
import store from "../store";
import { FileUploadField } from "../../../src";
import DemoWrapper from "../DemoWrapper";
import { reduxForm } from "redux-form";
import { useToggle } from "../useToggle";
import getIdOrCodeOrIndex from "../../../src/DataTable/utils/getIdOrCodeOrIndex";

const simpleValidateAgainst = {
  fields: [{ path: "name" }, { path: "description" }, { path: "sequence" }]
};
const validateAgainstSchema = ({
  asyncNameValidation,
  multipleExamples,
  enforceNameUnique,
  allowEitherNameOrId
}) => ({
  helpInstructions:
    "This template file is used to add rows to the sequence table.",
  allowAdditionalOnEnd: "ext-", // allow additional fields that start with "ext-" at the end of the csv
  allowAdditionalOnEndDescription:
    "This will add extended properties to the uploaded sequence",
  ...(asyncNameValidation && {
    tableWideAsyncValidation: async ({ entities }) => {
      await new Promise(resolve => setTimeout(resolve, 400));
      const toRet = {};
      entities.forEach(entity => {
        if (entity.name.toLowerCase() === "thomas") {
          toRet[`${getIdOrCodeOrIndex(entity)}:name`] = "Cannot be Thomas";
        }
      });
      return toRet;
    }
  }),
  tableWideValidation: allowEitherNameOrId
    ? ({ entities }) => {
        const toRet = {};
        entities.forEach(entity => {
          if (!entity.name && !entity.ID) {
            toRet[`${getIdOrCodeOrIndex(entity)}:name`] =
              "Must have a Name or an ID";
            toRet[`${getIdOrCodeOrIndex(entity)}:ID`] =
              "Must have a Name or an ID";
          } else if (entity.name && entity.ID) {
            toRet[`${getIdOrCodeOrIndex(entity)}:name`] =
              "Cannot have both a Name and an ID";
            toRet[`${getIdOrCodeOrIndex(entity)}:ID`] =
              "Cannot have both a Name and an ID";
          }
        });
        return toRet;
      }
    : undefined,
  fields: [
    {
      isRequired: !allowEitherNameOrId,
      isUnique: enforceNameUnique,
      path: "name",
      backupPath: "id",
      description: allowEitherNameOrId
        ? `The ID of the model to be tagged. Used if a Name is NOT provided`
        : "The Sequence Name",
      example: multipleExamples ? ["pj5_0001", "someOtherSeq"] : "pj5_0001"

      // defaultValue: "asdf"
    },
    ...(allowEitherNameOrId
      ? [
          {
            path: "ID",
            description: `The ID of the model to be tagged. Used if a Name is NOT provided`
          }
        ]
      : []),
    {
      path: "description",
      example: multipleExamples
        ? ["Example description of a sequence", "A 2nd description"]
        : "Example description of a sequence"
    },
    {
      isRequired: true,
      displayName: "Sequence BPs",
      path: "sequence",
      example: "gtgctttca",
      description: "The dna sequence base pairs"
    },
    {
      path: "isRegex",
      type: "boolean",
      description: "Whether the sequence is a regex",
      defaultValue: false
    },
    {
      path: "matchType",
      type: "dropdown",
      // isRequired: true,
      description: "Whether the sequence is a dna or protein sequence",
      values: ["dna", "protein"],
      example: multipleExamples ? ["dna", "protein"] : "dna"
    },
    {
      path: "type",
      type: "dropdown",
      // isRequired: true,
      values: ["misc_feature", "CDS", "rbs"],
      example: multipleExamples ? ["misc_feature", "CDS"] : "misc_feature"
    }
  ]
});

export default function UploadCsvWizardDemo() {
  return (
    <Provider store={store}>
      <div className="form-components">
        <Inner></Inner>
      </div>
    </Provider>
  );
}

const Inner = reduxForm({ form: "UploadCsvWizardDemo" })(({ handleSubmit }) => {
  const [simpleSchema, simpleSchemaComp] = useToggle({
    type: "simpleSchema",
    label: "Simple Schema"
  });
  const [enforceNameUnique, enforceNameUniqueComp] = useToggle({
    type: "enforceNameUnique"
  });
  const [asyncNameValidation, asyncNameValidationComp] = useToggle({
    type: "asyncNameValidation",
    description:
      "If checked, will validate asynchronously that the names do not equal Thomas"
  });
  const [allowEitherNameOrId, allowEitherNameOrIdComp] = useToggle({
    type: "allowEitherNameOrId"
  });
  // const [allowZip, allowZipComp] = useToggle({
  //   type: "allowZip"
  // });
  const [multipleExamples, multipleExamplesComp] = useToggle({
    type: "multipleExamples"
  });
  const [allowMultipleFiles, allowMultipleFilesComp] = useToggle({
    type: "allowMultipleFiles"
  });
  return (
    <DemoWrapper>
      <h6>Options</h6>
      {simpleSchemaComp}
      {enforceNameUniqueComp}
      {asyncNameValidationComp}
      {allowMultipleFilesComp}
      {multipleExamplesComp}
      {/* {allowZipComp} */}
      {allowEitherNameOrIdComp}
      <br></br>
      <br></br>
      <br></br>
      <FileUploadField
        label="CSV upload with wizard"
        onFieldSubmit={function(fileList) {
          console.info("do something with the finished file list:", fileList);
        }}
        isRequired
        className={"fileUploadLimitAndType"}
        accept={[
          {
            type: [".csv", ".xlsx"],
            validateAgainstSchema: simpleSchema
              ? simpleValidateAgainst
              : validateAgainstSchema({
                  asyncNameValidation,
                  enforceNameUnique,
                  allowEitherNameOrId,
                  multipleExamples
                }),
            exampleFile: "/manual_data_entry (3).csv"
          }
        ]}
        name={"exampleFile"}
        fileLimit={allowMultipleFiles ? undefined : 1}
      />
      <Button
        intent="success"
        text="Finish Upload"
        onClick={handleSubmit(async function(values) {
          window.parsedData = values.exampleFile[0].parsedData;
          window.toastr.success("Upload Successful");
          console.info(
            `values.exampleFile.parsedData:`,
            values.exampleFile[0].parsedData
          );
        })}
      />
    </DemoWrapper>
  );
});
