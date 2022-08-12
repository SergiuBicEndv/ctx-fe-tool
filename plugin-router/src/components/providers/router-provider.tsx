import React from 'react';
import {InitializerComponent} from './parallel-initializer';
import {BrowserRouter} from 'react-router-dom';

const RouterProvider: InitializerComponent<{
	children: React.ReactNode;
}> = {
	component: ({children}) => <BrowserRouter>{children}</BrowserRouter>,
};

export default RouterProvider;
