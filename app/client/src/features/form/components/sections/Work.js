/**
 * @flow
 */

import React from 'react'
import { connect } from 'react-redux'
import Section from './Section'
import { Button, Divider } from '../../../../common/components'
import { Job } from '..'
import {
  addJob,
  removeJob,
  addJobHighlight,
  removeJobHighlight
} from '../../actions'
import type { FormValues } from '../../types'
import type { State } from '../../../../app/types'
import { bindActionCreators } from 'redux'
import { change } from 'redux-form'

type Props = {
  work: $PropertyType<FormValues, 'work'>,
  jobCount: number,
  jobHighlights: Array<number>,
  addJob: () => void,
  removeJob: () => void,
  addJobHighlight: (index: number) => void,
  removeJobHighlight: (index: number) => void,
  change: VoidFunction
}

function Work({
  work,
  addJob,
  removeJob,
  addJobHighlight,
  removeJobHighlight,
  change
}: Props) {
  return (
    <Section heading="Your Work Experience">
      {work.map((job, i) => (
        <Job
          changeField={change}
          key={i}
          index={i}
          job={job}
          addHighlight={addJobHighlight}
          removeHighlight={removeJobHighlight}
        />
      ))}
      <Button onClick={addJob} type="button">
        Add Job
      </Button>
      <Button onClick={removeJob} disabled={work.length === 1} type="button">
        Remove Job
      </Button>
    </Section>
  )
}

function mapState(state: State) {
  return {
    work: state.form.resume.values.work
  }
}
const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      { 
        change, 
        addJob, 
        removeJob, 
        addJobHighlight, 
        removeJobHighlight },
      dispatch
    )
  }
}

export default connect(mapState, mapDispatchToProps)(Work)
