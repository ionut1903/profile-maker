/**
 * @flow
 */

import React from 'react'
import LabeledInput from './LabeledInput'

type Props = {
    index: number,
    parentIndex: number,
}

function AdditionalDataFragment({ index }: Props) {
    return (
        <div>
            <LabeledInput
                name={`allSkills[${index}]`}
                label="Skill Name"
                placeholder="Programming Languages"
            />
        </div>
    )
}

export default AdditionalDataFragment
