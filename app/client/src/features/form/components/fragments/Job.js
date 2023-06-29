/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import { Divider, RoundButton, Icon } from '../../../../common/components'
import LabeledInput, { Label, TextArea, TextareaComp } from './LabeledInput'
import TextEditor from './TextEditor'


const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const ButtonRow = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 15px;
  ${props => props.hidden && 'opacity: 0;'} transition: none;
`

type Props = {
  job: any,
  index: number,
  changeField: VoidFunction
}

function Job({ job, index, changeField= () => {} }: Props) {
  return (
    <div id={`job_${index}`}>
      {index > 0 ? <Divider /> : null}
      <LabeledInput
        name={`work[${index}].name`}
        label="Company Name"
        placeholder="Google"
      />
      <LabeledInput
        name={`work[${index}].position`}
        label="Job Title"
        placeholder="Software Engineer"
      />
      <LabeledInput
        name={`work[${index}].startDate`}
        label="Start Date"
        placeholder="MM/YYYY"
      />
      <LabeledInput
        name={`work[${index}].endDate`}
        label="End Date"
        placeholder="MM/YYYY"
      />
      {/* <TextareaComp
        label="Job Responsibilities"
        name={`work[${index}].summary`}
        defaultValue={job.summary}
        placeholder="Did cool stuff at company"
      ></TextareaComp> */}

      <TextEditor
        onChange={c => changeField('resume', `work[${index}].summary`, c)}
        initialValue={job.summary}
        label="Job Responsibilities"
        placeholder="Did cool stuff at company" />
      
    </div>
  )
}

function arePropsEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps.job) === JSON.stringify(nextProps.job) &&
         prevProps.index === nextProps.index;
}

export default React.memo(Job, arePropsEqual)