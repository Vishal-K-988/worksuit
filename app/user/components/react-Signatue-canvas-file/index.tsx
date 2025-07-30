import Proptypes from "prop-types"
import React, { Component } from 'react'
import SignaturePad from 'signature_pad'
import trimCanvas from 'trim-canvas'

// Define the options interface that matches SignaturePad constructor
interface SignaturePadOptions {
  velocityFilterWeight?: number
  minWidth?: number
  maxWidth?: number
  minDistance?: number
  dotSize?: number
  penColor?: string
  throttle?: number
  onEnd?: () => void
  onBegin?: () => void
}

export interface SignatureCanvasProps extends SignaturePadOptions {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>
  clearOnResize?: boolean
}

export class SignatureCanvas extends Component<SignatureCanvasProps> {
  static override propTypes = {
    // signature_pad's props
    velocityFilterWeight: Proptypes.number,
    minWidth: Proptypes.number,
    maxWidth: Proptypes.number,
    minDistance: Proptypes.number,
    dotSize: Proptypes.oneOfType([Proptypes.number, Proptypes.func]),
    penColor: Proptypes.string,
    throttle: Proptypes.number,
    onEnd: Proptypes.func,
    onBegin: Proptypes.func,
    // props specific to the React wrapper
    canvasProps: Proptypes.object,
    clearOnResize: Proptypes.bool
  }

  static defaultProps: Pick<SignatureCanvasProps, 'clearOnResize'> = {
    clearOnResize: true
  }

  static refNullError = new Error('react-signature-canvas is currently ' +
    'mounting or unmounting: React refs are null during this phase.')

  // shortcut reference (https://stackoverflow.com/a/29244254/3431180)
  private readonly staticThis = this.constructor as typeof SignatureCanvas

  _sigPad: SignaturePad | null = null
  _canvas: HTMLCanvasElement | null = null

  private readonly setRef = (ref: HTMLCanvasElement | null): void => {
    this._canvas = ref
    // if component is unmounted, set internal references to null
    if (this._canvas === null) {
      this._sigPad = null
    }
  }

  _excludeOurProps = (): SignaturePadOptions => {
    // Create a new object with only the SignaturePad options
    const sigPadProps: SignaturePadOptions = {}
    
    // Only copy the SignaturePad-specific props
    if (this.props.velocityFilterWeight !== undefined) sigPadProps.velocityFilterWeight = this.props.velocityFilterWeight
    if (this.props.minWidth !== undefined) sigPadProps.minWidth = this.props.minWidth
    if (this.props.maxWidth !== undefined) sigPadProps.maxWidth = this.props.maxWidth
    if (this.props.minDistance !== undefined) sigPadProps.minDistance = this.props.minDistance
    if (this.props.dotSize !== undefined) sigPadProps.dotSize = this.props.dotSize
    if (this.props.penColor !== undefined) sigPadProps.penColor = this.props.penColor
    if (this.props.throttle !== undefined) sigPadProps.throttle = this.props.throttle
    if (this.props.onEnd !== undefined) sigPadProps.onEnd = this.props.onEnd
    if (this.props.onBegin !== undefined) sigPadProps.onBegin = this.props.onBegin
    
    return sigPadProps
  }

  override componentDidMount: Component['componentDidMount'] = () => {
    const canvas = this.getCanvas()
    this._sigPad = new SignaturePad(canvas, this._excludeOurProps())
    this._resizeCanvas()
    this.on()
  }

  override componentWillUnmount: Component['componentWillUnmount'] = () => {
    this.off()
  }

  // propagate prop updates to SignaturePad
  override componentDidUpdate: Component['componentDidUpdate'] = () => {
    if (this._sigPad) {
      Object.assign(this._sigPad, this._excludeOurProps())
    }
  }

  // return the canvas ref for operations like toDataURL
  getCanvas = (): HTMLCanvasElement => {
    if (this._canvas === null) {
      throw this.staticThis.refNullError
    }
    return this._canvas
  }

  // return a trimmed copy of the canvas
  getTrimmedCanvas = (): HTMLCanvasElement => {
    // copy the canvas
    const canvas = this.getCanvas()
    const copy = document.createElement('canvas')
    copy.width = canvas.width
    copy.height = canvas.height
    copy.getContext('2d')!.drawImage(canvas, 0, 0)
    // then trim it
    return trimCanvas(copy)
  }

  // return the internal SignaturePad reference
  getSignaturePad = (): SignaturePad => {
    if (this._sigPad === null) {
      throw this.staticThis.refNullError
    }
    return this._sigPad
  }

  _checkClearOnResize = (): void => {
    if (!this.props.clearOnResize) {
      return
    }
    this._resizeCanvas()
  }

  _resizeCanvas = (): void => {
    const canvasProps = this.props.canvasProps ?? {}
    const { width, height } = canvasProps
    // don't resize if the canvas has fixed width and height
    if (typeof width !== 'undefined' && typeof height !== 'undefined') {
      return
    }

    const canvas = this.getCanvas()
    /* When zoomed out to less than 100%, for some very strange reason,
      some browsers report devicePixelRatio as less than 1
      and only part of the canvas is cleared then. */
    const ratio = Math.max(window.devicePixelRatio ?? 1, 1)

    if (typeof width === 'undefined') {
      canvas.width = canvas.offsetWidth * ratio
    }
    if (typeof height === 'undefined') {
      canvas.height = canvas.offsetHeight * ratio
    }
    canvas.getContext('2d')!.scale(ratio, ratio)
    this.clear()
  }

  override render: Component['render'] = () => {
    const { canvasProps } = this.props
    return <canvas ref={this.setRef} {...canvasProps} />
  }

  // all wrapper functions below render
  //
  on: SignaturePad['on'] = () => {
    window.addEventListener('resize', this._checkClearOnResize)
    return this.getSignaturePad().on()
  }

  off: SignaturePad['off'] = () => {
    window.removeEventListener('resize', this._checkClearOnResize)
    return this.getSignaturePad().off()
  }

  clear: SignaturePad['clear'] = () => {
    return this.getSignaturePad().clear()
  }

  isEmpty: SignaturePad['isEmpty'] = () => {
    return this.getSignaturePad().isEmpty()
  }

  fromDataURL: SignaturePad['fromDataURL'] = (dataURL, options) => {
    return this.getSignaturePad().fromDataURL(dataURL, options)
  }

  toDataURL = (type?: string, encoderOptions?: number): string => {
    return this.getSignaturePad().toDataURL(type, encoderOptions)
  }

  fromData: SignaturePad['fromData'] = (pointGroups) => {
    return this.getSignaturePad().fromData(pointGroups)
  }

  toData: SignaturePad['toData'] = () => {
    return this.getSignaturePad().toData()
  }
}

export default SignatureCanvas