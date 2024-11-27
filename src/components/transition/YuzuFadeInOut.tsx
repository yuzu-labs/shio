import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  nodeKey: React.Key | null | undefined;
  children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
};

const YuzuFadeInOut = (props: Props) => {
  return (
    <TransitionGroup component={null}>
      <CSSTransition key={props.nodeKey} timeout={1000} classNames="yuzu-fade" unmountOnExit mountOnEnter>
        {props.children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default YuzuFadeInOut;
