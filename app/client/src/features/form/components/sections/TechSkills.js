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
    additionalData: $PropertyType<FormValues, 'additionalData'>,
    addTechSkill: () => void,
    removeTechSkill: () => void,
}

function TechSkills({
                        additionalData,
                        addTechSkill,
                        removeTechSkill
                    }: Props) {
    const parentIndex = 1;
    const {value} = additionalData.length > 1 ? additionalData[parentIndex] : {value: []};
    return (
        <Section heading="TECH SKILLS">
            {value.map((skill, i) => (
                <AdditionalDataFragment
                    key={i}
                    index={i}
                    parentIndex={parentIndex}
                    keywords={skill}
                />
            ))}
            <Button onClick={addTechSkill} type="button">
                Add Skill
            </Button>
            <Button
                onClick={removeTechSkill}
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
    addTechSkill,
    removeTechSkill
}

export default connect(mapState, mapActions)(TechSkills)
