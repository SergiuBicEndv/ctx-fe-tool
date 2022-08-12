/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-unsafe-call */
import React, {
	FunctionComponent,
	ReactElement,
	useEffect,
	useMemo,
	useState,
} from 'react';

type InitializerProps = {
	providers: Array<InitializerComponent<any, any, React.ReactNode>>;
	loader?: React.ReactNode;
	children?: React.ReactNode;
};

export type InitializerComponent<T, H = undefined, C = undefined> = {
	component: React.ComponentType<T>;
	initialize?: (args: H) => Promise<T>;
	hooks?: H;
	children?: C;
} & Partial<React.ReactElement>;

const ParallelInitializer: FunctionComponent<InitializerProps> = ({
	providers,
	loader,
	children,
}) => {
	const [loaded, setLoaded] = useState(false);
	const [initializedProps, setInitializedProps] = useState<
		Array<Record<string, unknown>>
	>([]);

	const initializationResults = providers.map(provider => {
		const hookResult =
			typeof provider.hooks === 'function' ? provider.hooks() : {};

		return useMemo(
			() => provider.initialize?.(hookResult),
			Object.values(hookResult),
		);
	});

	useEffect(() => {
		Promise.all(initializationResults)
			.then(props => {
				if (props !== undefined) {
					setInitializedProps(props);
				}

				setLoaded(true);
			})
			.catch(error => {
				throw new Error(
					`Error initializing the application: ${error as string}`,
				);
			});
	}, [...initializationResults]);

	if (!loaded) {
		return loader ? <>{loader}</> : <div>...</div>;
	}

	const renderTree = (index = 0): ReactElement => {
		if (index === providers.length) {
			return <>{children}</>;
		}

		const Component = providers[index].component;

		return (
			<Component {...initializedProps[index]}>{renderTree(++index)}</Component>
		);
	};

	return renderTree();
};

export default ParallelInitializer;
