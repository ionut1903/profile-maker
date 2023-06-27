/**
 * @flow
 */

import React, {Component}  from 'react'
import {withRouter, type Location} from 'react-router-dom'
import {connect} from 'react-redux'
import Section from './Section'
import {Button} from '../../../../common/components'
import {addTechSkill, removeTechSkill, removeSkillKeyword, addSkillKeyword, setAllSkills} from '../../actions'
import styled from 'styled-components'
import {arrayMove} from 'react-sortable-hoc'
import { colors } from '../../../../common/theme'
import { Divider } from '../../../../common/components'
import type {FormValues} from '../../types'
import type {State} from '../../../../app/types'
import AdditionalDataFragment from "../fragments/AdditionalDataFragment";
import {
    SortableContainer,
    SortableElement,
    SortableHandle
  } from 'react-sortable-hoc'
import { render } from 'react-dom'

type Props = {
    allSkills: $PropertyType<FormValues, 'allSkills'>,
    addTechSkill: () => void,
    removeTechSkill: () => void,
}

const AdditionalSkill = styled(AdditionalDataFragment)`
  text-decoration: none;
  font-weight: 300;
  color: ${colors.foreground};
  list-style: none;
  display: inline-block;
  margin-bottom: 20px;
  position: relative;

  &:hover {
    &::before {
      width: 100% !important;
      opacity: 1;
    }
  }

  &.active {
    transform: scale(1, 1);
    color: ${colors.primary};

    &:before {
      opacity: 1;
    }
  }

  &:before {
    transition: all 0.4s ease;
    content: '';
    height: 1px;
    background: ${colors.primary};
    position: absolute;
    pointer-events: none;
    bottom: -2px;
    margin: 0 auto;
    width: 0%;
    opacity: 1;
  }
`

const Handle = styled.span`
  position: relative;
  right: 25px;
  top: 45px;
  color: ${colors.primary};
  opacity: ${props => (props.disabled ? '0' : '1')};
  cursor: grab;
  user-select: none;
`

const DragHandle = SortableHandle(({ disabled }) => {
    return <Handle disabled={disabled}>::</Handle>
  })
  
const Item = styled.div`
        z-index: 2;
        min-width: 80px;
        width: 73%;
    `

    const FlexContainer = styled.div`
        display: flex;
        justify-content: space-between`

const SortableItem = SortableElement(({ value, indx }) => {
    return (
        <Item>
            <DragHandle disabled={false} />
            <AdditionalDataFragment
                        key={indx}
                        index={indx}
                        keywords={value}
                    />
         <Divider style={{'marginTop':'0px', height: '1px'}}/>
        </Item>
    )
})

const SortableList = SortableContainer(({ items,  addSkillByIndex, removeSkillByIndex}) => {
    const addSkill = (index)=>{
        addSkillByIndex(index)
    }

    const removeSkill = (index) =>{
        removeSkillByIndex(index)
    }
    React.useEffect(() => {
      const newFieldIndex = items.length - 1;
  
      if (newFieldIndex >= 0) {
        const els = document.getElementsByName(`allSkills[${newFieldIndex}]`);
        if(els.length > 0) {
          els[0].scrollIntoView({ behavior: 'smooth' });
          els[0].focus();
        }
      }
    }, [items.length]);
    return (
      <List>
        {items.map((value, index) => (
        <FlexContainer  key={`flex-${index}`}>
          <SortableItem
            disabled={false}
            key={`item-${index}`}
            index={index}
            indx={index}
            value={value}
          />
        </FlexContainer>
        ))}
      </List>
    )
  });

  const List = styled.div`
    margin: 0;
    padding: 0;
    font-weight: 300;
    margin-bottom: 25px;
`

class TechSkills extends Component<Props> {
        onSortStart = () => {
            this.toggleGrabCursor()
        }
    
        onSortEnd = ({oldIndex, newIndex}) => {
            const {allSkills, setAllSkills} = this.props;
            const newSectionOrder = arrayMove(allSkills, oldIndex, newIndex);
            setAllSkills(newSectionOrder)
            this.toggleGrabCursor()
        }
    
    toggleGrabCursor() {
        document.body && document.body.classList.toggle('grabbing');
    }

    addSkillByIndex = (index) => {
        const {allSkills, setAllSkills} = this.props;
        const lastItems = allSkills.slice(index);
        const firstItems = allSkills.slice(0, index);
        lastItems.unshift('');
        const concatItems = firstItems.concat(lastItems);
        setAllSkills(concatItems);
    }

    removeSkillByIndex = (index) => {
        const {allSkills, setAllSkills} = this.props;
        allSkills.splice(index, 1);
        setAllSkills(allSkills);
    }
    render() {
        const { allSkills,
            addTechSkill,
            removeTechSkill,
        } = this.props

        const skills = allSkills.length > 0 ? allSkills : [];
    
        return (
            <Section heading="ALL TECH SKILLS">
               <SortableList 
                useDragHandle
                lockToContainerEdges
                lockAxis="y"
                items={skills}
                addSkillKeyword={addSkillKeyword}
                removeSkillKeyword={removeSkillKeyword}
                onSortStart={this.onSortStart}
                onSortEnd={this.onSortEnd}
                addSkillByIndex={this.addSkillByIndex}
                removeSkillByIndex={this.removeSkillByIndex}
               ></SortableList>
                <Button onClick={addTechSkill} type="button">
                    Add Skill
                </Button>
                <Button
                    onClick={removeTechSkill}
                    disabled={skills.length === 1}
                    type="button"
                >
                    Remove Skill
                </Button>
            </Section>
        )
    }
}

function mapState(state: State) {
    return {
        allSkills: state.form.resume.values.allSkills,
    }
}

const mapActions = {
    addTechSkill,
    removeTechSkill,
    addSkillKeyword,
    removeSkillKeyword,
    setAllSkills
}

const x = connect(mapState, mapActions)(SortableList);
const ConnectedTechSkills = connect(mapState, mapActions)(TechSkills)
export default withRouter(ConnectedTechSkills)