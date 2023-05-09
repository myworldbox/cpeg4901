import React from 'react';
import { CircularProgress } from '@mui/material/';

/**
 * Wraps the React Component with React.Suspense and FallbackComponent while loading.
 * @param {React.Component} WrappedComponent - lazy loading component to wrap.
 * @param {React.Component} FallbackComponent - component to show while the WrappedComponent is loading.
 */
const withSuspense = (WrappedComponent: any, FallbackComponent: any = null) => {
	return class extends React.Component {
		render() {
			if (!FallbackComponent) FallbackComponent = <CircularProgress />; // by default
			return (
				<React.Suspense fallback={FallbackComponent}>
					<WrappedComponent {...this.props} />
				</React.Suspense>
			);
		}
	};
};

export default withSuspense;