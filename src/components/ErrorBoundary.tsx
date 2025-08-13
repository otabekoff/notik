import React, { ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { PersistentLogger } from '../utils/PersistentLogger';
import { globalStyles } from '../styles/globalStyles';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    PersistentLogger.error('ErrorBoundary caught an error', error);
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    PersistentLogger.error('ErrorBoundary componentDidCatch', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      return (
        <View style={globalStyles.errorContainer}>
          <Text style={globalStyles.errorTitle}>Something went wrong</Text>
          <Text style={globalStyles.errorText}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
          <ScrollView style={globalStyles.logContainer}>
            <Text style={globalStyles.logText}>
              Recent Logs:
              {'\n'}
              {PersistentLogger.getRecentLogs(10).join('\n')}
            </Text>
          </ScrollView>
          <View style={globalStyles.errorButtons}>
            <Pressable
              style={[
                globalStyles.errorButton,
                globalStyles.errorButtonPrimary,
              ]}
              onPress={() => {
                Alert.alert(
                  'Logs',
                  PersistentLogger.getRecentLogs(20).join('\n'),
                );
              }}
            >
              <Text style={globalStyles.errorButtonText}>View Logs</Text>
            </Pressable>
            <Pressable
              style={globalStyles.errorButton}
              onPress={() => {
                this.setState({
                  hasError: false,
                  error: null,
                  errorInfo: null,
                });
              }}
            >
              <Text style={globalStyles.errorButtonText}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
