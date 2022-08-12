import React from 'react';
import {InitializerComponent} from './parallel-initializer';
import {Provider} from 'react-redux';
import {AnyAction, Store} from '@reduxjs/toolkit';

const ReduxProvider: InitializerComponent<{
	store: Store;
	children?: React.ReactNode;
}> = {
	initialize: async () =>
		import(`../../state/store`).then(({store}) => ({store})),

	component: ({store, children}) => (
		<Provider store={store}>{children}</Provider>
	),
};

export default ReduxProvider;
