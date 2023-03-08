import React, { PropsWithChildren } from "react";

interface ErrorBoundaryState {
  error: Error | null;
}
const initialState: ErrorBoundaryState = { error: null };

export default class ErrorBoundary extends React.Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  state = initialState;
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const error = this.state.error;

    if (error) {
      return <div>{error.message}</div>;
    }

    return this.props.children;
  }
}
