/**
 * @flow
 */

import React from 'react'
import { connect } from 'react-redux'
import Section from './Section'
import { Button, Divider } from '../../../../common/components'
import LabeledInput from '../fragments/LabeledInput'
import { School } from '..'
import { addSchool, removeSchool } from '../../actions'
import type { FormValues } from '../../types'
import type { State } from '../../../../app/types'


function Footer() {

    return (
        <Section heading="Footer content">
            <LabeledInput  placeholder="Herr Hans-Justus Daase" label="Contact Name" name="footer.contactName" />
            <LabeledInput placeholder="+49 (0)173 43 91 430" label="Contact Number 1" name="footer.contactNumber1" />
            <LabeledInput placeholder="+49 (0)40 571 99 133" label="Contact Number 2" name="footer.contactNumber2" />
            <LabeledInput placeholder="justus.daase@mertus-consulting.com" label="Email Address" name="footer.contactEmail" />

        </Section>
    )
}




export default Footer
