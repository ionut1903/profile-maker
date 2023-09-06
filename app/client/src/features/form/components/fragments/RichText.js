import React, { useState, useRef, useMemo, useEffect } from 'react'
import JoditEditor from 'jodit-react'
import { change, getFormValues } from 'redux-form'
import { Label, TextareaComp } from './LabeledInput'
import { Button } from '../../../../common/components'
import styled from 'styled-components'
import { colors } from '../../../preview/components/TemplateCommonComponents'

const ReadOnlyTextArea = styled.div`
  height: 80px;
  width: 100%;
  background: #202530;
  padding: 10px 0 30px 0;
  appearance: none;
  outline: 0;
  font-size: 0.9em;
  font-family: inherit;
  border: none;
  border-bottom: 1px solid ${colors.borders};
  color: ${colors.foreground};
  transition: all 0.4s;
  outline: none;
  border-radius: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
    `

function RichText({
  placeholder,
  input: {
    value,
    onChange
  },
  label = '',
  index,
  key
}) {
  const editor = useRef(null)
  const [isFocused, setFocus] = useState(false)
  const [edition, setEdition] = useState(false);

  let config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/,
    placeholder:
      placeholder || 'Dieser Senior Experte ist ein Backend-Entwickler....',
    toolbarButtonSize: 'xsmall',
    theme: 'dark',
    statusbar: false,
    containerStyle: {
      borderRadius: 0,
    },
    style: {
      backgroundColor: '#202530',
    }
  }
 


  const onBlur = (newContent) => {
 
    onChange(newContent)
  }

  return (
    <div id={`text_ed_job_${index}`} key={key} style={{width:500}}>
      <Label style={{ marginBottom: 20 }}>{label}</Label>
      <div style={{maxWidth:550, display: 'flex', flexDirection: 'row', columnGap:10, alignItems:'flex-start'}}>
      <div style={{flexGrow: 1, maxWidth: '100%'}}>
        
          {!edition ?
            <ReadOnlyTextArea dangerouslySetInnerHTML={{__html: value}}>
              
            </ReadOnlyTextArea>
            :
            <JoditEditor
              ref={editor}
              value={value}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={onBlur} // preferred to use only this option to update the content for performance reasons
            />
          }
      </div>
        <div>
          <Button type="button" onClick={() => setEdition((s) => !s)}>{!edition ? `✎` : `✓`}</Button>
        </div>
    </div>
    </div>
    
  )
}/* 
function arePropsEqual(prevProps, nextProps) {
  return prevProps.initialValue === nextProps.initialValue &&
    prevProps.label === nextProps.label &&
    prevProps.placeholder === nextProps.placeholder;
} */

export default RichText
