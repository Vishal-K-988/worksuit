import PropTypes from 'prop-types'
import React, { Component } from 'react'
import SignaturePad from 'signature_pad'
import trimCanvas from 'trim-canvas'

export interface SignatureCanvasProps extends SignaturePad.SignaturePadOptions {
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>
  clearOnResize?: boolean
}

export class SignatureCanvas extends Component<SignatureCanvasProps> {
  static override propTypes = {
    velocityFilterWeight: PropTypes.number,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    minDistance: PropTypes.number,
    dotSize: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    penColor: PropTypes.string,
    throttle: PropTypes.number,
    onEnd: PropTypes.func,
    onBegin: PropTypes.func,
    canvasProps: PropTypes.object,
    clearOnResize: PropTypes.bool,
  }

  static defaultProps: Pick<SignatureCanvasProps, 'clearOnResize'> = {
    clearOnResize: true,
  }

  static refNullError = new Error(
    'react-signature-canvas is currently mounting or unmounting: React refs are null during this phase.'
  )

  private readonly staticThis = this.constructor as typeof SignatureCanvas

  _sigPad: SignaturePad | null = null
  _canvas: HTMLCanvasElement | null = null

  private readonly setRef = (ref: HTMLCanvasElement | null): void => {
    this._canvas = ref
    if (this._canvas === null) {
      this._sigPad = null
    }
  }

  _excludeOurProps = (): SignaturePad.SignaturePadOptions => {
    const {  ...sigPadProps } = this.props
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

  override componentDidUpdate: Component['componentDidUpdate'] = () => {
    Object.assign(this._sigPad, this._excludeOurProps())
  }

  getCanvas = (): HTMLCanvasElement => {
    if (this._canvas === null) {
      throw this.staticThis.refNullError
    }
    return this._canvas
  }

  getTrimmedCanvas = (): HTMLCanvasElement => {
    const canvas = this.getCanvas()
    const copy = document.createElement('canvas')
    copy.width = canvas.width
    copy.height = canvas.height
    copy.getContext('2d')!.drawImage(canvas, 0, 0)
    return trimCanvas(copy)
  }

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

    if (typeof width !== 'undefined' && typeof height !== 'undefined') {
      return
    }

    const canvas = this.getCanvas()
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

  toDataURL: SignaturePad['toDataURL'] = (type, encoderOptions) => {
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
