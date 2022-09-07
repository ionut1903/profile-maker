/**
 * @flow
 */

import React from 'react'
import { Divider} from '../../../../common/components'
import LabeledInput from './LabeledInput'

type Props = {
    index: number,
    parentIndex: number,
}

function AdditionalDataFragment({ index, parentIndex }: Props) {
    return (
        <div>
            {index > 0 ? <Divider /> : null}
            <LabeledInput
                name={`additionalData[${parentIndex}].value[${index}]`}
                label="Skill Name"
                placeholder="Programming Languages"
            />
        </div>
    )
}

export default AdditionalDataFragment
