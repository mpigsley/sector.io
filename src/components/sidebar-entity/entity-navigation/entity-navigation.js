import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import copy from 'copy-to-clipboard';

import FlexContainer from 'primitives/container/flex-container';
import Header, { HeaderType } from 'primitives/text/header';
import Button from 'primitives/other/button';
import ButtonLink from 'primitives/other/button-link';
import Entities from 'constants/entities';

import './style.css';

export default function EntityNavigation(props) {
  const {
    name,
    children,
    currentSector,
    entity,
    entityType,
    activateSidebarEdit,
    isSaved,
    isSynced,
    isCloudSave,
  } = props;
  const onCopy = () => {
    copy(window.location.href);
    toastr.success(
      'Copied to Clipboard',
      `You have copied a link directly to this ${Entities[entityType].name}.`,
    );
  };

  const onPrint = () => {
    window.print();
  };

  let saveButton = null;
  if (!isSaved && !isCloudSave) {
    saveButton = <Button minimal>Save</Button>;
  }

  let editButton = null;
  if (!isCloudSave) {
    editButton = (
      <Button minimal onClick={activateSidebarEdit}>
        Edit
      </Button>
    );
  }

  let shareButton = null;
  if ((isSynced || isCloudSave) && isSaved) {
    shareButton = (
      <Button minimal onClick={onCopy}>
        Share
      </Button>
    );
  }

  let deleteButton = null;
  if (isSaved && !isCloudSave) {
    deleteButton = <Button minimal>Delete</Button>;
  }

  let backUrl = '/';
  if (entity.parent) {
    backUrl = `${backUrl}sector/${currentSector}`;
    if (entity.parentEntity !== Entities.sector.key) {
      backUrl = `${backUrl}/${entity.parentEntity}/${entity.parent}`;
    }
  }

  return (
    <FlexContainer className="EntityNavigation-Info" direction="column">
      <div className="EntityNavigation-Header">
        <FlexContainer align="center" shrink="0">
          <FlexContainer flex="1" justify="center" align="flexEnd">
            <Header type={HeaderType.header2}>{name}</Header>
            <Header
              type={HeaderType.header3}
              className="EntityNavigation-TypeHeader"
            >
              ({Entities[entityType].name})
            </Header>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer justify="center" shrink="0">
          <ButtonLink minimal to={backUrl}>
            Back
          </ButtonLink>
          <span className="EntityNavigation-Spacer" />
          {saveButton}
          {saveButton ? <span className="EntityNavigation-Spacer" /> : null}
          {editButton}
          {editButton ? <span className="EntityNavigation-Spacer" /> : null}
          {deleteButton}
          {deleteButton ? <span className="EntityNavigation-Spacer" /> : null}
          {shareButton}
          {shareButton ? <span className="EntityNavigation-Spacer" /> : null}
          <Button minimal onClick={onPrint}>
            Print
          </Button>
        </FlexContainer>
      </div>
      <FlexContainer direction="column" flex="1" scroll>
        {children}
      </FlexContainer>
      <div className="EntityNavigation-Footer">
        <FlexContainer justify="center">
          <ButtonLink
            minimal
            to="https://goo.gl/forms/eOanpGEuglCYYg7u2"
            target="_blank"
          >
            Report Problem
          </ButtonLink>
          <span className="EntityNavigation-Spacer" />
          <ButtonLink minimal to="/changelog">
            Changelog
          </ButtonLink>
          <span className="EntityNavigation-Spacer" />
          <ButtonLink
            minimal
            to="https://github.com/mpigsley/sectors-without-number"
            target="_blank"
          >
            Github
          </ButtonLink>
        </FlexContainer>
      </div>
    </FlexContainer>
  );
}

EntityNavigation.propTypes = {
  currentSector: PropTypes.string.isRequired,
  entity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    parent: PropTypes.string,
    parentEntity: PropTypes.string,
  }).isRequired,
  entityType: PropTypes.string,
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  activateSidebarEdit: PropTypes.func.isRequired,
  isSaved: PropTypes.bool.isRequired,
  isSynced: PropTypes.bool.isRequired,
  isCloudSave: PropTypes.bool.isRequired,
};

EntityNavigation.defaultProps = {
  entityType: undefined,
};
