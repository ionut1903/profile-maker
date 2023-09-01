import React, { useState, useRef, useMemo, useEffect } from 'react'
import JoditEditor from 'jodit-react'
import { change, getFormValues } from 'redux-form'
import { Label } from './LabeledInput'
function TextEditor ({
  placeholder,
  onChange = () => {},
  initialValue = '',
  label=''
})  {
  const editor = useRef(null)
  const [content, setContent] = useState(initialValue)
  const [isFocused, setFocus] = useState(false)
  let config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/,
    placeholder:
      placeholder || 'Dieser Senior Experte ist ein Backend-Entwickler....',
    toolbarButtonSize: 'xsmall',
    theme: 'dark',
    statusbar: false,
    containerStyle: {
      borderRadius: 0
    },
    style: {
      backgroundColor: '#202530'
    }
  }
  useEffect(() => {
    setContent(initialValue)
  }, [])

  const onBlur = (newContent) => {
    setContent(newContent)
    onChange(newContent)
  }

  return (
    <div>
      <Label style={{marginBottom:20}}>{label}</Label>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={onBlur} // preferred to use only this option to update the content for performance reasons
      />
    </div>
  )
}
function arePropsEqual(prevProps, nextProps) {
  return prevProps.initialValue === nextProps.initialValue &&
         prevProps.label === nextProps.label &&
         prevProps.placeholder === nextProps.placeholder;
}

export default React.memo(TextEditor, arePropsEqual)