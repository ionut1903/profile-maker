/**
 * @flow
 */

import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Icon, PrimaryButton } from '../../../common/components'
import { colors } from '../../../common/theme'
import { syncSalesforce } from '../../../app/services/SalesforceService'

const Wrapper = styled.div`
  width: calc(100% - 2px);
  display: flex;
  background: ${darken(0.02, colors.background)};
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.borders};
  border-radius: 2px;
  user-select: none;

  @media screen and (max-width: 850px) {
    flex-direction: column;
  }
`

const ButtonGroup = styled.div`
  width: 100%;
  padding-left: 35px;
  display: flex;
  justify-content: flex-start;
  align-items: center;


  @media screen and (max-width: 850px) {
    width: 100%;
    justify-content: center;
    align-items: center;
    ${props => (props.hideOnMobile ? 'display: none;' : '')} &:first-child,
      last-child {
      justify-content: center;
    }
  }
`

const Button = styled.a`
  text-align: center;
  text-decoration: none;
  font-size: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  min-width: 65px;
  background: transparent;
  border-radius: 2px;
  color: #ddd;
  padding: 0 2px;

  i {
    margin-right: 5px;
    color: #ddd;
    font-size: 20px;
  }

  &:hover {
    color: ${colors.primary};
    cursor: pointer;

    i {
      color: ${colors.primary};
    }
  }
`

const ToolButton = Button.extend`
  border-radius: 2px;
  margin: 0 5px;

  @media screen and (max-width: 850px) {
    border: 1px solid ${colors.borders};

    i {
      display: none;
    }
  }
`

const Pagination = styled.div`
  width: calc(100% / 4);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;

  @media screen and (max-width: 850px) {
    width: 100%;
    margin-top: 10px;
  }
`

const PageNumber = styled.span`
  font-size: 12px;
  height: 35px;
  color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const PageButton = Button.extend`
  margin: 0;
  padding: 0;

  i {
    margin: 0;
    padding: 0;
  }

  &:first-of-type {
    border-right: none;
  }

  &:last-of-type {
    border-left: none;
  }
`

type Props = {
  currPage: number,
  resumeURL: string,
  jsonURL?: string,
  json: any,
  downloadSource: (enableDownload?:Boolean) => any,
  prevPage: () => void,
  nextPage: () => void,
  zoomIn: () => void,
  zoomOut: () => void,
  print: (url: string) => void
}

function Toolbar({
  resumeURL,
  jsonURL,
  currPage,
  downloadSource,
  prevPage,
  nextPage,
  print,
  zoomIn,
  zoomOut,
  json
}: Props) {
  const salesforce = localStorage.getItem('salesforce') || ''


  const handleSalesforce = async () => {
    const pdf_blob = await downloadSource(false);

    const str = JSON.stringify(json);
    const bytes = new TextEncoder().encode(str);
    const json_blob = new Blob([bytes], {
      type: "application/json;charset=utf-8"
    });
    syncSalesforce(json_blob, pdf_blob);
  }
  return (
    <Wrapper>
      <ButtonGroup sytle={{width: 'calc(100% / 3.5)'}}>
        <ToolButton onClick={downloadSource} >
          <Icon type="file_download" /> PDF
        </ToolButton>
        <ToolButton href={jsonURL} download="resume.json">
          <Icon type="file_download" /> JSON
        </ToolButton>
        {salesforce !== '' && <ToolButton onClick={handleSalesforce}>
          <Icon type="cloud" /> Salesforce
        </ToolButton>}
      </ButtonGroup>
    </Wrapper>
  )
}

export default Toolbar
