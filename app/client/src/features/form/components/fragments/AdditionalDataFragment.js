/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import { Divider, RoundButton, Icon } from '../../../../common/components'
import LabeledInput, { Label, Input } from './LabeledInput'

const ButtonRow = styled.div`
  margin-left: 15px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`

const MiniInput = Input.extend`
  width: 50%;

  @media screen and (max-width: 850px) {
    width: 65%;
  }
`

type Props = {
    keywords: Array<?string>,
    index: number,
    parentIndex: number,
    addKeyword: (index: number) => void,
    removeKeyword: (index: number) => void
}

function AdditionalDataFragment({ keywords, index, addKeyword, removeKeyword, parentIndex }: Props) {
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
