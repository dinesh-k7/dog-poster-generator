import React, { Fragment, ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import './home-page.scss';
import PosterContainerComponent from '../../components/poster-container/poster-container.component';
import {
  getBreeds,
  selectAllBreeds,
} from '../../redux/features/dog-poster/dogPosterSlice';
import { useTypedSelector } from '../../redux/store';

const HomePage: React.FC = (): ReactElement => {
  const dispatch = useDispatch();

  const breeds = useTypedSelector(selectAllBreeds);

  useEffect(() => {
    dispatch(getBreeds() as never);
  }, []);

  return (
    <Fragment>
      <div className="home-page-container">
        <div className="home-page-header">
          <h3> Dog Poster Generator</h3>
        </div>
        {breeds && breeds.length ? (
          <PosterContainerComponent breeds={breeds} />
        ) : (
          ''
        )}
      </div>
    </Fragment>
  );
};

export default HomePage;
