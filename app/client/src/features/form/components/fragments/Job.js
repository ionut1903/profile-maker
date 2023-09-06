/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import { Divider, RoundButton, Icon, Button } from '../../../../common/components'
import LabeledInput, { Label, TextArea, TextareaComp, JobSummary } from './LabeledInput'



const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const JobContainer = styled.div`
  display:grid;
  grid-rows: 30px 1fr;
`

const ButtonGroup = styled.div`
  padding: 30px 0px 0px 0px;
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
  changeField: VoidFunction,
  total: number,
  changeOrder: (index: number, direction: number) => void,
  work:  any[]
}

function Job({ job, index, changeField= () => {}, total, changeOrder, work }: Props) {
  return (
    <JobContainer id={`job_${index}`} key={index.toString()}>
    {index > 0 ? <Divider /> : null}
      <ButtonGroup>
      <Button onClick={() => changeOrder(index, 1)} disabled={index == 0} type="button">
        ˄
        </Button>
        <Button onClick={() => changeOrder(index, 0)} disabled={index == (total - 1) || total == 1}  type="button">
        ˅
        </Button>
      </ButtonGroup>
      <div >
        
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
        <JobSummary
          name={`work[${index}].summary`}
          placeholder="Did cool stuff at company"
          label="Job Responsibilities"
        />
          
        
      </div>
    </JobContainer>
    
  )
}

function arePropsEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps.job) === JSON.stringify(nextProps.job) &&
         prevProps.index === nextProps.index;
}

export default Job