/**
 * @flow
 */

import React from 'react'
import {connect} from 'react-redux'
import Section from './Section'
import {Button} from '../../../../common/components'
import {
    addSkillKeyword,
    removeSkillKeyword, addLanguage, removeLanguage
} from '../../actions'
import type {FormValues} from '../../types'
import type {State} from '../../../../app/types'
import AdditionalDataFragment from "../fragments/AdditionalDataFragment";

type Props = {
    additionalData: $PropertyType<FormValues, 'additionalData'>,
    addLanguage: () => void,
    removeLanguage: () => void,
}

function Languages({
                       additionalData,
                       addLanguage,
                       removeLanguage,
                   }: Props) {
    const parentIndex = 0;
    const {value} = additionalData.length > 1 ? additionalData[parentIndex] : {value: []};

    return (
        <Section heading="LANGUAGES">
            {value.map((skill, i) => (
                <AdditionalDataFragment
                    key={i}
                    index={i}
                    parentIndex={parentIndex}
                    keywords={skill}
                />
            ))}
            <Button onClick={addLanguage} type="button">
                Add Language
            </Button>
            <Button
                onClick={removeLanguage}
                disabled={value.length === 1}
                type="button"
            >
                Remove Language
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
    addLanguage,
    removeLanguage,
}

export default connect(mapState, mapActions)(Languages)
