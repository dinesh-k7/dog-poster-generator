import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import HomePage from './home-page';
const middlewares = [thunk];

describe('With React Testing Library', () => {
  const initialState = { dogPoster: { breeds: [] } };
  const mockStore = configureMockStore(middlewares);
  let store;

  it('Home page:: PosterContainerComponent not loaded', () => {
    store = mockStore(initialState);
    const { getByText } = render(
      <Provider store={store}>
        <HomePage />
      </Provider>,
    );

    expect(getByText('Dog Poster Generator')).not.toBeNull();
  });

  it('Home page:: PosterContainerComponent loaded', () => {
    const dogPosterState = {
      dogPoster: { breeds: [{ id: 201, name: 'Akita', subBreeds: [] }] },
    };
    store = mockStore(dogPosterState);
    const { getByText } = render(
      <Provider store={store}>
        <HomePage />
      </Provider>,
    );

    expect(getByText('Dog Poster Generator')).not.toBeNull();
  });
});
