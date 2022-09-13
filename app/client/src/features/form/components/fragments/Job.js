/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import {Divider, RoundButton, Icon} from '../../../../common/components'
import LabeledInput, {Label, TextArea, TextareaComp} from './LabeledInput'

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
}

function Job({job, index}: Props) {
    return (
        <div>
            {index > 0 ? <Divider/> : null}
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
                placeholder="YYYY-MM-DD"
            />
            <LabeledInput
                name={`work[${index}].endDate`}
                label="End Date"
                placeholder="YYYY-MM-DD"
            />
            <TextareaComp
                label="Job Responsibilities"
                name={`work[${index}].summary`}
                defaultValue={job.summary}
                placeholder="Did cool stuff at company"
            ></TextareaComp>
        </div>
    )
}

export default Job
