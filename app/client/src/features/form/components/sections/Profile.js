/**
 * @flow
 */

import React from 'react'
import {connect} from 'react-redux'
import Section from './Section'
import LabeledInput, {TextareaComp} from '../fragments/LabeledInput'
import type {FormValues} from '../../types'
import type {State} from '../../../../app/types'

type Props = {
    basics: $PropertyType<FormValues, 'basics'>,
}

function Profile({
                     basics
                 }: Props) {
    return (
        <Section heading="Your Personal Info">
            <LabeledInput
                name="basics.name"
                label="Full Name"
                placeholder="John Smith"
            />
            <LabeledInput
                name="basics.email"
                label="Email"
                placeholder="johnsmith@gmail.com"
            />
            <LabeledInput
                name="basics.phone"
                label="Phone Number"
                placeholder="(555) 123-4567"
            />
            <LabeledInput
                name="basics.fullAddress"
                label="Address"
                placeholder="New York, NY"
            />
            <TextareaComp
                label="Professional profile description"
                name={`basics.summary`}
                defaultValue={basics.summary}
                placeholder="Senior Software Developer"
            ></TextareaComp>
            <LabeledInput
                name="basics.shortDescription"
                label="Short description"
                placeholder="Senior Software Developer"
            />
            {/*TODO: should we display the date of birth? also the labels should be named dateOfbirth?*/}
            <LabeledInput
                name="basics.year"
                label="Year"
                placeholder="1993"
            />
            <LabeledInput
                name="basics.website"
                label="Link"
                placeholder="mycoolportfolio.com/myname"
            />
        </Section>
    )
}

const mapActions = {}

function mapState(state: State) {
    return {
        basics: state.form.resume.values.basics,
        selectedTemplate: state.form.resume.values.selectedTemplate
    }
}

export default connect(mapState, mapActions)(Profile)
