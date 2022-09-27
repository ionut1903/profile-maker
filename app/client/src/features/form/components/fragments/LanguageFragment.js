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

function LanguageFragment({ index }: Props) {
    return (
        <div>
            {index > 0 ? <Divider /> : null}
            <LabeledInput
                name={`languages[${index}]`}
                label="Language"
                placeholder="Language"
            />
        </div>
    )
}

export default LanguageFragment
