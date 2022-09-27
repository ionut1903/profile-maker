/**
 * @flow
 */

import React from 'react'
import {connect} from 'react-redux'
import Section from './Section'
import {Button} from '../../../../common/components'
import {addLanguage, removeLanguage
} from '../../actions'
import type {FormValues} from '../../types'
import type {State} from '../../../../app/types'
import LanguageFragment from "../fragments/LanguageFragment";

type Props = {
    languages: $PropertyType<FormValues, 'languages'>,
    addLanguage: () => void,
    removeLanguage: () => void,
}

function Languages({
                       languages,
                       addLanguage,
                       removeLanguage,
                   }: Props) {
    const lang = languages.length > 0 ? languages : languages;

    return (
        <Section heading="LANGUAGES">
            {lang.map((lang, i) => (
                <LanguageFragment
                    key={i}
                    index={i}
                    keywords={lang}
                />
            ))}
            <Button onClick={addLanguage} type="button">
                Add Language
            </Button>
            <Button
                onClick={removeLanguage}
                disabled={lang.length === 1}
                type="button"
            >
                Remove Language
            </Button>
        </Section>
    )
}

function mapState(state: State) {
    return {
        languages: state.form.resume.values.languages
    }
}

const mapActions = {
    addLanguage,
    removeLanguage,
}

export default connect(mapState, mapActions)(Languages)
