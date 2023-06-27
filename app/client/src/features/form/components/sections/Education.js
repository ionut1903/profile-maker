/**
 * @flow
 */

import React from 'react'
import { connect } from 'react-redux'
import Section from './Section'
import { Button, Divider } from '../../../../common/components'
import LabeledInput from '../fragments/LabeledInput'
import { School } from '..'
import { addSchool, removeSchool } from '../../actions'
import type { FormValues } from '../../types'
import type { State } from '../../../../app/types'

type Props = {
  education: $PropertyType<FormValues, 'education'>,
  addSchool: () => void,
  removeSchool: () => void
}

function Education({ education, addSchool, removeSchool }: Props) {

  React.useEffect(() => {
    const newFieldIndex = education.length - 1;

    if (newFieldIndex >= 0) {
      const els = document.getElementsByName(`education[${newFieldIndex}].area`);
      if(els.length > 0) {
        els[0].scrollIntoView({ behavior: 'smooth' });
        els[0].focus();
      }
    }
  }, [education.length]);

  return (
    <Section heading="Your Educational Background">
      {education.map((school, i) => <School key={i} index={i} />)}
      <Button onClick={addSchool} type="button">
        Add School
      </Button>
      <Button
        onClick={removeSchool}
        disabled={education.length === 1}
        type="button"
      >
        Remove School
      </Button>
    </Section>
  )
}

function mapState(state: State) {
  return {
    education: state.form.resume.values.education
  }
}

const mapActions = {
  addSchool,
  removeSchool
}

export default connect(mapState, mapActions)(Education)
