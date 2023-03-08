import React, { PropsWithChildren } from "react";

export default class ErrorBoundary extends React.Component<
  PropsWithChildren<{}>,
  { error: Error }
> {
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
