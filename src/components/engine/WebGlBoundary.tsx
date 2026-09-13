import { Component, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback: ReactNode
}

type State = {
  failed: boolean
}

export class WebGlBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.setState({ failed: true })
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}
