/**
 * @flow
 */

import React from 'react'
import {connect} from 'react-redux'
import Section from './Section'
import {Button} from '../../../../common/components'
import {addTechSkill, removeTechSkill} from '../../actions'
import type {FormValues} from '../../types'
import type {State} from '../../../../app/types'
import AdditionalDataFragment from "../fragments/AdditionalDataFragment";

type Props = {
    allSkills: $PropertyType<FormValues, 'allSkills'>,
    addTechSkill: () => void,
    removeTechSkill: () => void,
}

function TechSkills({
                        allSkills,
                        addTechSkill,
                        removeTechSkill
                    }: Props) {
    const parentIndex = 1;
    const skills = allSkills.length > 0 ? allSkills : [];
    return (
        <Section heading="ALL TECH SKILLS">
            {skills.map((skill, i) => (
                <AdditionalDataFragment
                    key={i}
                    index={i}
                    keywords={skill}
                />
            ))}
            <Button onClick={addTechSkill} type="button">
                Add Skill
            </Button>
            <Button
                onClick={removeTechSkill}
                disabled={skills.length === 1}
                type="button"
            >
                Remove Skill
            </Button>
        </Section>
    )
}

function mapState(state: State) {
    return {
        allSkills: state.form.resume.values.allSkills
    }
}

const mapActions = {
    addTechSkill,
    removeTechSkill
}

export default connect(mapState, mapActions)(TechSkills)
