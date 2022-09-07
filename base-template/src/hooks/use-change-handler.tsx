import {Dispatch, SetStateAction, useCallback} from 'react';

export const useChangeHandler = <C, T>(
	dependency: T,
	callback: Dispatch<SetStateAction<T>>,
) => {
	return useCallback(
		(value: T) => {
			callback(value);
		},
		[dependency],
	);
};
