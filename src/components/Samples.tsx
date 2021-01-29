import React, { useRef, useEffect, useState } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import '../styles/EnvVisualizer.css';
import { EnvVisualiser } from './EnvVisualiser';
import useForceUpdate from '../utils/forceUpdate';
import { Sample } from '../samples';

import { Libraries } from '../libraries';

interface Props {
  samples: Sample[];
  renderLibButton: () => JSX.Element;
  selectedLib: Libraries;
  setUpLib: (
    envVisContainer: React.RefObject<HTMLDivElement>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    forceUpdate: () => void
  ) => void;
}

export const Samples: React.FC<Props> = ({ samples, renderLibButton, selectedLib, setUpLib }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const envVisContainer = useRef<HTMLDivElement>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    setUpLib(envVisContainer, setLoading, forceUpdate);
  }, [forceUpdate, selectedLib, setUpLib]);

  let { path } = useRouteMatch();
  return (
    <>
      <div className="ui horizontal list">
        {renderLibButton()}
        {samples.map(({ id, name }) => (
          <Link key={id} to={`${path}/${id}`} className="ui button">
            {name}
          </Link>
        ))}
      </div>
      <div ref={envVisContainer} className="sa-env-visualizer"></div>
      {loading && <p>loading environment visualiser..</p>}
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}/0`} />
        <Route
          exact
          path={`${path}/:id`}
          render={({
            match: {
              params: { id }
            }
          }) => loading || <EnvVisualiser sample={samples[id]} selectedLib={selectedLib} />}
        />
      </Switch>
    </>
  );
};