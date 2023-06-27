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
  addKeyword: (index: number) => void,
  removeKeyword: (index: number) => void
}

function Skill({ keywords, index, addKeyword, removeKeyword }: Props) {
  return (
    <div>
      {index > 0 ? <Divider /> : null}
      <LabeledInput
        name={`skills[${index}].name`}
        label="Competence Name"
        placeholder="Programming Languages"
      />
    </div>
  )
}

export default Skill
