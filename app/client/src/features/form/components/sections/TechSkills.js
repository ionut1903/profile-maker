/**
 * @flow
 */

import React from 'react'
import {connect} from 'react-redux'
import Section from './Section'
import {Button} from '../../../../common/components'
import {Skill} from '..'
import {
    addSkill,
    removeSkill,
    addSkillKeyword,
    removeSkillKeyword
} from '../../actions'
import type {FormValues} from '../../types'
import type {State} from '../../../../app/types'
import AdditionalDataFragment from "../fragments/AdditionalDataFragment";

type Props = {
    additionalData: $PropertyType<FormValues, 'additionalData'>,
    addSkill: () => void,
    removeSkill: () => void,
    addSkillKeyword: (index: number) => void,
    removeSkillKeyword: (index: number) => void
}

function TechSkills({
                       additionalData,
                       addSkill,
                       removeSkill,
                       addSkillKeyword,
                       removeSkillKeyword
                   }: Props) {
    const parentIndex = 1;
    const {value} = additionalData.length > 1 ? additionalData[parentIndex] : {value:[]};
    return (
        <Section heading="TECH SKILLS">
            {value.map((skill, i) => (
                    <AdditionalDataFragment
                        key={i}
                        index={i}
                        parentIndex={parentIndex}
                        keywords={skill}
                        addKeyword={addSkillKeyword}
                        removeKeyword={removeSkillKeyword}
                    />
                ))}
            <Button onClick={addSkill} type="button">
                Add Skill
            </Button>
            <Button
                onClick={removeSkill}
                disabled={value.length === 1}
                type="button"
            >
                Remove Skill
            </Button>
        </Section>
    )
}

function mapState(state: State) {
    return {
        additionalData: state.form.resume.values.additionalData
    }
}

const mapActions = {
    addSkill,
    removeSkill,
    addSkillKeyword,
    removeSkillKeyword
}

export default connect(mapState, mapActions)(TechSkills)