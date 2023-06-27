/**
 * @flow
 */

import React from 'react'
import { connect } from 'react-redux'
import Section from './Section'
import { Button } from '../../../../common/components'
import { Skill } from '..'
import {
  addSkill,
  removeSkill,
  addSkillKeyword,
  removeSkillKeyword
} from '../../actions'
import type { FormValues } from '../../types'
import type { State } from '../../../../app/types'

type Props = {
  skills: $PropertyType<FormValues, 'skills'>,
  addSkill: () => void,
  removeSkill: () => void,
  addSkillKeyword: (index: number) => void,
  removeSkillKeyword: (index: number) => void
}

function Skills({
  skills,
  addSkill,
  removeSkill,
  addSkillKeyword,
  removeSkillKeyword
}: Props) {
  React.useEffect(() => {
    const newFieldIndex = skills.length - 1;

    if (newFieldIndex >= 0) {
      const els = document.getElementsByName(`skills[${newFieldIndex}].name`);
      if(els.length > 0) {
        els[0].scrollIntoView({ behavior: 'smooth' });
        els[0].focus();
      }
    }
  }, [skills.length]);
  return (
    <Section heading="CORE COMPETENCIES">
      {skills.map((skill, i) => (
        <Skill
          key={i}
          index={i}
          keywords={skill.keywords}
          addKeyword={addSkillKeyword}
          removeKeyword={removeSkillKeyword}
        />
      ))}
      <Button onClick={addSkill} type="button">
        Add Competence
      </Button>
      <Button
        onClick={removeSkill}
        disabled={skills.length === 1}
        type="button"
      >
        Remove Competence
      </Button>
    </Section>
  )
}

function mapState(state: State) {
  return {
    skills: state.form.resume.values.skills
  }
}

const mapActions = {
  addSkill,
  removeSkill,
  addSkillKeyword,
  removeSkillKeyword
}

export default connect(mapState, mapActions)(Skills)
