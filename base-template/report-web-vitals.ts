import {ReportHandler} from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
	if (onPerfEntry && onPerfEntry instanceof Function) {
		import('web-vitals')
			.then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
				getCLS(onPerfEntry);
				getFID(onPerfEntry);
				getFCP(onPerfEntry);
				getLCP(onPerfEntry);
				getTTFB(onPerfEntry);
			})
			.catch(() => {
				throw new Error(`Error on web vitals init`);
			});
	}
};

export default reportWebVitals;
