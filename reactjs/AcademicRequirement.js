import React, { useState } from 'react'
import { useImperativeHandle } from 'react';
import { useRef } from 'react';
import { forwardRef } from 'react'
import { SchoolInfo, selectEmptyValueLabel } from '../../services/Constant';
import { JArray } from '../utils/Jpc';
import ArraySelect from './ArraySelect';
import GroupField from './GroupField';
import InlineNote from './InlineNote';
import LabelField from './LabelField';
import LabelFieldFormat from './LabelFieldFormat';
import { OLevelGrades, oLevelSubjects, PolytechnicGrades, ResultType, UniversityGrades } from './lov/AcademicLov';
import MultipleRow, { ColumnType } from './MultipleRow';
import Selector from './Selector';

function AcademicRequirement({ name, exportType, programmeCategory = "" }, ref) {

  const refs = useRef({});

  const [state, setState] = useState({
    utme: "No", oLevel: "No", others: "No", oLevelCompulsories: [], utmeSubjects: [], cutoffMark: 180
  });

  const getOptional = (fields = []) => {
    let res = [];
    fields.forEach(field => {
      res.push({subjects: refs.current[field].data});
    });
    return res;
  }

  const getUTMEOptional = (fields = []) => {
    let res = [];
    fields.forEach(field => {
      res.push({subjects: state[field]})
    })
    return res;
  }

  const build = () => {
    return {
      olevelRequirement: state.oLevel !== "Yes" ? null :
        {
          compulsories: refs.current[name + "oLevelCompulsories"].data,
          optionals: getOptional(refs.current[name + "oLevelOptionals"].fields)
        },
      utmeRequirement: state.utme !== "Yes" ? null :
        {
          compulsories: state.utmeSubjects,
          optionals: getUTMEOptional(refs.current[name + "utmeOptionals"].fields),
          cutoffMark: state.cutoffMark
        },
      otherRequirement: state.others !== "Yes" ? null :
        refs.current[name + "others"].data,
    }
  }

  useImperativeHandle(ref, () => {
    const res = {
      prev: ref,
      data: build()
    };

    if (exportType === ExportType.Indirect) {
      return { ...ref.current, [name]: res }
    } else {
      return res;
    }
  })


  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  }

  const subjectRow = (field) => {
    return {
      data: [
        <select name={field + "subject"} value={state[field + "subject"] || ""} onChange={handleChange}>
          <option value="" label={selectEmptyValueLabel} />
          {
            oLevelSubjects.map((item, index) => (<option key={index}>{item}</option>))
          }
        </select>,
        <select name={field + "grade"} value={state[field + "grade"] || ""} onChange={handleChange}>
          <option value="" label={selectEmptyValueLabel} />
          {
            OLevelGrades.map((item, index) => (<option key={index}>{item}</option>))
          }
        </select>
      ]
    }
  }

  const optionalRow = (field = "", index) => {
    return <fieldset>
      <legend>{"Optional Subject Set " + (index + 1)} <InlineNote note="A prospective student can only choose one out of this set to do and pass in OLEVEL Examination" /></legend>
      <MultipleRow exportType={ExportType.Indirect} setter={(st) => setState({ ...state, ...st })} getter={() => { return state }} ref={refs} name={field} serialize initialize buttonLabel="Add Subject" row={subjectRow} title={["SN", "Subject", "Minimum Grade"]} keys={["subject", "grade"]} />
    </fieldset>
  }

  const UTMEOptionalRow = (field = "", index) => {
    return <fieldset>
      <legend>{"UTME Optional Subject Set " + (index + 1)} <InlineNote note="A prospective student can only choose one out of this set to do and pass in UTME Examination" /></legend>
        <ArraySelect name={field} value={state[field] || []} onChange={handleChange} options={JArray.subtract(oLevelSubjects, state.utmeSubjects)} />
    </fieldset>
  }

  const otherRequirementRow = (field) => {
    return {
      data: [
        <select name={field + "resultType"} value={state[field + "resultType"] || ""} onChange={handleChange}>
          <option value="" label={selectEmptyValueLabel} />
          {
            ResultType.map((item, index) => (<option key={index}>{item}</option>))
          }
        </select>,
        <select name={field + "grade"} value={state[field + "grade"] || ""} onChange={handleChange}>
          <option value="" label={selectEmptyValueLabel} />
          {
            SchoolInfo().type === "university" ?
              UniversityGrades.map((item, index) => (<option key={index}>{item}</option>))
              :
              PolytechnicGrades.map((item, index) => (<option key={index}>{item}</option>))
          }
        </select>
      ]
    }
  }


  return (
    <div>
      <GroupField title="OLevel Requirement" />
      <LabelFieldFormat label=" Is OLevel a requirement?" >
        <Selector onChange={handleChange} name="oLevel" value={state.utme} values={["Yes", "No"]} />
      </LabelFieldFormat>
      {
        state.oLevel === "Yes" ?
          <div title="OLevel Requirement">
          <div label="Compulsories" on>
            <label>Compulsories <InlineNote note="These are subjects compulsory for a prospective student to do and pass in OLEVEL Examination" /></label>
            <MultipleRow exportType={ExportType.Indirect} setter={(st) => setState({ ...state, ...st })} getter={() => { return state }} ref={refs} name={name + "oLevelCompulsories"} serialize initialize buttonLabel="Add Subject" row={subjectRow} title={["SN", "Subject", "Minimum Grade"]} keys={["subject", "grade"]} />
          </div>
            <div label="Optionals" on>
              <label>Optionals <InlineNote note="These are subjects a prospective student can choose to do and pass in OLEVEL Examination" /></label>
              <MultipleRow exportType={ExportType.Indirect} columnType={ColumnType.SingleColumn} setter={(st) => setState({ ...state, ...st })} getter={() => { return state }} ref={refs} name={name + "oLevelOptionals"} initialize buttonLabel="Add set" row={optionalRow} showTitle={false} />
            </div>
          </div> : null
      }
      {
        !programmeCategory.toLowerCase().includes("undergraduate")? null :
        <>
        <GroupField title="UTME Requirement" />
        <LabelFieldFormat label="Is UTME a requirement?" >
          <Selector onChange={handleChange} name="utme" value={state.utme} values={["Yes", "No"]} />
        </LabelFieldFormat>
        {
          state.utme === "Yes" ?
            <div title="UTME Requirement">
              <div label="Compulsories" on>
                <label>Compulsories <InlineNote note="These are subjects compulsory for a prospective student to do in UTME Examination" /> </label>
                <ArraySelect name="utmeSubjects" value={state.utmeSubjects} onChange={handleChange} options={oLevelSubjects} />
              </div>
                <div label="Optionals" on>
                  <label>Optionals <InlineNote note="These are subjects a prospective student can choose to do and pass in UTME Examination" /></label>
                  <div style={{marginBottom: '18px'}}>
                    <MultipleRow exportType={ExportType.Indirect} columnType={ColumnType.SingleColumn} setter={(st) => setState({ ...state, ...st })} getter={() => { return state }} ref={refs} name={name + "utmeOptionals"} initialize buttonLabel="Add set" row={UTMEOptionalRow} showTitle={false} />
                  </div>
                </div>
              {/* <LabelFieldFormat label="Subjects" on>
                <ArraySelect name="utmeSubjects" value={state.utmeSubjects} onChange={handleChange} options={oLevelSubjects} />
              </LabelFieldFormat> */}
              <LabelField label="Cutoff mark" name="cutoffMark" value={state.cutoffMark} onChange={handleChange} />
            </div> : null
        }
        </>
      }
      {
        !programmeCategory.toLowerCase().includes("postgraduate")? null :
        <>
        <GroupField title="Other Requirement" />
        <LabelFieldFormat label="Are there other requirements?" >
          <Selector onChange={handleChange} name="others" value={state.others} values={["Yes", "No"]} />
        </LabelFieldFormat>
        {
          state.others === "Yes" ?
            <div title="Other Requirement">
              <MultipleRow exportType={ExportType.Indirect} setter={(st) => setState({ ...state, ...st })} getter={() => { return state }} ref={refs} name={name + "others"} serialize initialize row={otherRequirementRow} title={["SN", "Result Type", "Grade"]} keys={["resultType", "grade"]} />
            </div> : null
        }
        </>
      }
    </div>
  )
}

export default forwardRef(AcademicRequirement)

export const ExportType = {
  Direct: "direct",
  Indirect: "indirect"
}